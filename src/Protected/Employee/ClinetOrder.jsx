import React, { useState, useMemo } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

// APIs & Utilities
import { getDeliveryUserOrderAPi } from "../../Api/OrderApi";
import Lodding from "../../UtilityFolder/Lodding";
import Error from "../../UtilityFolder/Error";
import {
  PaymentPaid,
  PaymentPending,
  OrderPaid,
  OrderPending,
  StatusPaid,
  StatusShift,
  StatusPending,
  StatusProcess,
} from "../Admin/Order User Details/Status";

function ClientOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Professional spacing usually shows 5-10 items

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getDeliveryUserOrder"],
    queryFn: getDeliveryUserOrderAPi,
  });

  // 1. Professional Data Processing (Memoized)
  const { paginatedData, pageCount } = useMemo(() => {
    if (!data?.data) return { paginatedData: [], pageCount: 0 };

    let filtered = data.data.filter((order) => {
      const searchTerm = input.toLowerCase();
      return (
        order.name?.toLowerCase().includes(searchTerm) ||
        order.store?.[0]?.food?.user?.email
          ?.toLowerCase()
          .includes(searchTerm) ||
        order.phone?.includes(searchTerm)
      );
    });

    const count = Math.ceil(filtered.length / itemsPerPage);
    const sliced = filtered.slice(
      currentIndex * itemsPerPage,
      currentIndex * itemsPerPage + itemsPerPage
    );

    return { paginatedData: sliced, pageCount: count };
  }, [data, input, currentIndex]);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Lodding />
      </div>
    );
  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Error />
      </div>
    );

  const getStatusColor = (status) => {
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Delivery Orders
          </h1>
          <div className="relative group w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCurrentIndex(0);
              }}
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden lg:block overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                {["Customer", "Contact", "Location", "Status", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {order.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.store?.[0]?.food?.user?.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {order.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                    {order.address || order.city || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(
                          order.status
                        )} uppercase`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-black border ${getStatusColor(
                          order.stripePaymentStatus
                        )} uppercase`}
                      >
                        {order.stripePaymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate("/Payment", {
                          state: { id: order.id, pathName: location.pathname },
                        })
                      }
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (Hidden on Desktop) */}
        <div className="lg:hidden space-y-4">
          <AnimatePresence>
            {paginatedData.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">
                      {order.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaEnvelope /> {order.store?.[0]?.food?.user?.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusColor(
                      order.status
                    )} uppercase`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                      Phone
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 font-medium">
                      <FaPhoneAlt className="text-blue-500" /> {order.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">
                      Payment
                    </p>
                    <p
                      className={`font-black ${
                        getStatusColor(order.stripePaymentStatus).split(" ")[1]
                      }`}
                    >
                      {order.stripePaymentStatus}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate max-w-[60%] flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-500" />{" "}
                    {order.address || order.city}
                  </p>
                  <button
                    onClick={() =>
                      navigate("/Payment", {
                        state: { id: order.id, pathName: location.pathname },
                      })
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-100 active:scale-90 transition-transform"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Professional Pagination */}
        <div className="py-6 flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel={<FaAngleRight />}
            previousLabel={<FaAngleLeft />}
            pageCount={pageCount}
            onPageChange={(data) => {
              setCurrentIndex(data.selected);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            containerClassName="flex gap-2 items-center"
            pageClassName="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-blue-50 transition-colors"
            activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-lg shadow-blue-100"
            previousClassName="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all"
            nextClassName="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all"
            disabledClassName="opacity-30 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

export default ClientOrder;
