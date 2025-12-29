import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

// Icons
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaTrashAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { RiResetRightFill } from "react-icons/ri";

// Stores & APIs
import { DeleteOrderApi, getAllOrderByAdminAPi } from "../../../Api/OrderApi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";
import {
  OrderPaid,
  OrderPending,
  OrderRefund,
  PaymentPaid,
  PaymentPending,
  PaymentRefund,
  StatusPaid,
  StatusPending,
  StatusProcess,
  StatusShift,
} from "./Status";

function OrderUserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Filter States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [orderFilter, setOrderFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  // Data Fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllOrder"],
    queryFn: getAllOrderByAdminAPi,
  });

  console.log(data)

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: DeleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllOrder"]);
      toast.success("Order cleared from records");
    },
    onError: () => toast.error("Could not delete order"),
  });

  // Professional Filter Engine (Memoized)
  const { paginatedData, pageCount, totalResults } = useMemo(() => {
    if (!data?.data)
      return { paginatedData: [], pageCount: 0, totalResults: 0 };

    let results = data.data.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store?.[0]?.food?.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchPayment = paymentFilter
        ? item.stripePaymentStatus === paymentFilter
        : true;
      const matchOrder = orderFilter ? item.orderStatus === orderFilter : true;
      const matchStatus = statusFilter ? item.status === statusFilter : true;

      return matchSearch && matchPayment && matchOrder && matchStatus;
    });

    return {
      totalResults: results.length,
      pageCount: Math.ceil(results.length / itemsPerPage),
      paginatedData: results.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
      ),
    };
  }, [
    data,
    searchTerm,
    paymentFilter,
    orderFilter,
    statusFilter,
    currentIndex,
  ]);

  if (isLoading) return <Lodding />;
  if (isError) return <Error />;

  const handleReset = () => {
    setStatusFilter(null);
    setPaymentFilter(null);
    setOrderFilter(null);
    setSearchTerm("");
    setCurrentIndex(0);
  };

  const getBadgeColor = (status) => {
    if ([StatusPaid, StatusShift, OrderPaid, PaymentPaid].includes(status))
      return "bg-green-100 text-green-700 border-green-200";
    if (
      [StatusPending, StatusProcess, OrderPending, PaymentPending].includes(
        status
      )
    )
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Order Management
            </h1>
            <p className="text-sm text-slate-500">
              Found {totalResults} matching records
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm shadow-sm"
              placeholder="Search by customer or email..."
            />
          </div>
        </div>

        {/* Professional Multi-Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FilterGroup
              title="Payment"
              current={paymentFilter}
              options={[PaymentPaid, PaymentPending, PaymentRefund]}
              setter={(v) => {
                setPaymentFilter(v);
                setCurrentIndex(0);
              }}
            />
            <FilterGroup
              title="Delivery"
              current={orderFilter}
              options={[OrderPaid, OrderPending, OrderRefund]}
              setter={(v) => {
                setOrderFilter(v);
                setCurrentIndex(0);
              }}
            />
            <FilterGroup
              title="Lifecycle"
              current={statusFilter}
              options={[StatusShift, StatusProcess, StatusPending]}
              setter={(v) => {
                setStatusFilter(v);
                setCurrentIndex(0);
              }}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              <RiResetRightFill /> RESET ALL FILTERS
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {order.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {order.store?.[0]?.food?.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${getBadgeColor(
                        order.stripePaymentStatus
                      )}`}
                    >
                      {order.stripePaymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${getBadgeColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${getBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate("/Payment", {
                          state: { id: order.id, pathName: location.pathname },
                        })
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(order.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {paginatedData.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-slate-800">{order.name}</h3>
                  <p className="text-xs text-slate-400">
                    {order.store?.[0]?.food?.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(order.id)}
                  className="p-2 text-red-500 bg-red-50 rounded-xl"
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span
                  className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase ${getBadgeColor(
                    order.stripePaymentStatus
                  )}`}
                >
                  Pay: {order.stripePaymentStatus}
                </span>
                <span
                  className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase ${getBadgeColor(
                    order.orderStatus
                  )}`}
                >
                  Ord: {order.orderStatus}
                </span>
                <span
                  className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase ${getBadgeColor(
                    order.status
                  )}`}
                >
                  St: {order.status}
                </span>
              </div>
              <button
                onClick={() =>
                  navigate("/Payment", {
                    state: { id: order.id, pathName: location.pathname },
                  })
                }
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Professional Pagination */}
        <div className="flex justify-center pt-8">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            previousLabel={<FaAngleLeft />}
            pageCount={pageCount}
            onPageChange={(data) => {
              setCurrentIndex(data.selected);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            containerClassName="flex items-center gap-2"
            pageClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-blue-50 transition-all"
            activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-lg shadow-blue-200"
            previousClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200"
            nextClassName="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

const FilterGroup = ({ title, current, options, setter }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {title}
    </p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => setter(current === opt ? null : opt)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
            current === opt
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export default OrderUserDetails;
