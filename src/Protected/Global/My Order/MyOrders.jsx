import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOrderApi, getCurrentUserOrderAPi } from "../../../Api/OrderApi";
import Lodding from "../../../UtilityFolder/Lodding";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import {
  OrderPaid,
  OrderPending,
  PaymentPaid,
  PaymentPending,
  StatusPaid,
  StatusPending,
  StatusProcess,
  StatusShift,
} from "../../Admin/Order User Details/Status";
import { motion } from "framer-motion";

function MyOrders() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(0);
  const [filterData, setFilterProduct] = useState([]);
  const date = new Date();
  date.setDate(date.getDate() + 7); // Add 7 days
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getUTCMonth()]; // Convert month number to name
  const year = date.getUTCFullYear();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCurrentUserOrder"],
    queryFn: getCurrentUserOrderAPi,
  });
  const [dataLoadDelete, setDataLoadDelete] = useState(false);
  const MyDelete = useMutation({
    mutationKey: ["deleteOrder"],
    mutationFn: async (id) => {
      setDataLoadDelete(true);
      return await DeleteOrderApi(id);
    },
    onSuccess: (data) => {
      if (data.status) {
        setDataLoadDelete(false);
        client.invalidateQueries(["getCurrentUserOrder"]);
        toast.success("Order Deleted Successfully");
      } else {
        setAdminLoading(false);
        toast.success("Operation Failed");
      }
    },
  });
  useEffect(() => {
    if (!data || !data.data) return;
    setPage(Math.ceil(data?.data.length / 2));
    let operationData = [...data.data];
    if (input.trim() !== "") {
      operationData = operationData.filter(
        (f) =>
          f.name?.toLowerCase().includes(input.toLowerCase()) ||
          f.store?.[0]?.food?.user?.email
            ?.toLowerCase()
            .includes(input.toLowerCase())
      );
      operationData;
    }
    operationData = operationData.slice(currentIndex * 2, currentIndex * 2 + 2);
    setFilterProduct(operationData);
  }, [data, input, currentIndex]);
  if (isLoading) {
    return (
      <>
        <Lodding />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Error />
      </>
    );
  }
  const handlePage = (data) => {
    setCurrentIndex(data.selected);
  };

  const handleDelete = (id) => {
    MyDelete.mutate(id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="flex flex-col justify-center items-center space-y-4 p-4"
    >
      <div className="w-full flex justify-end pr-4">
        <div className="shadow-md flex items-center bg-white rounded-md px-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="search"
            placeholder="Search"
            className="p-2 text-sm sm:text-base border-none w-44 sm:w-72 outline-none rounded-l-md"
          />
          <IoIosSearch
            size={20}
            className="text-gray-600 hover:text-black cursor-pointer"
          />
        </div>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full border border-gray-300 rounded-lg text-xs sm:text-sm">
          {/* Table Head */}
          <thead className="bg-gray-200 text-gray-700 uppercase">
            <tr className="text-[10px] sm:text-sm">
              <th className="p-2 sm:p-4">Email</th>
              <th className="p-2 sm:p-4">Name</th>
              <th className="p-2 sm:p-4">Location</th>
              <th className="p-2 sm:p-4">Phone</th>
              <th className="p-2 sm:p-4">payment</th>
              <th className="p-2 sm:p-4">Order</th>
              <th className="p-2 sm:p-4">Status</th>
              <th className="p-2 sm:p-4">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-700">
            {filterData?.map((d, i) => (
              <>
                <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                    <div className="font-semibold text-[10px] sm:text-base">
                      {d?.store[0].food?.user?.email}
                    </div>
                  </td>
                  {/* Name */}
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                    <div className="font-semibold text-[10px] sm:text-base">
                      {d?.name}
                    </div>
                  </td>

                  {/* location */}
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-[10px] sm:text-base">
                    {d?.address || d?.city || null}
                  </td>

                  {/* phone */}
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-[10px] sm:text-base">
                    {d?.phone}
                  </td>

                  {/* payment */}
                  <td
                    className={`${
                      d?.stripePaymentStatus === PaymentPaid
                        ? "text-green-500"
                        : d?.stripePaymentStatus === PaymentPending
                        ? "text-yellow-500"
                        : "text-red-500"
                    } py-2 sm:py-3 px-2 sm:px-4 text-center text-[10px] sm:text-base`}
                  >
                    {d?.stripePaymentStatus}
                  </td>
                  <td
                    className={`${
                      d?.orderStatus === OrderPaid
                        ? "text-green-500"
                        : d?.orderStatus === OrderPending
                        ? "text-yellow-500"
                        : "text-red-500"
                    } py-2 sm:py-3 px-2 sm:px-4 text-center text-[10px] sm:text-base`}
                  >
                    {d?.orderStatus}
                  </td>
                  <td
                    className={`${
                      d?.status === StatusPaid || d?.status === StatusShift
                        ? "text-green-500"
                        : d?.status === StatusPending ||
                          d?.status === StatusProcess
                        ? "text-yellow-500"
                        : "text-red-500"
                    } py-2 sm:py-3 px-2 sm:px-4 text-center text-[10px] sm:text-base`}
                  >
                    {d?.status}
                  </td>

                  {/* Actions */}
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                    <div className="py-2 sm:py-3 px-2 sm:px-4 space-x-1 sm:space-x-2 text-center flex justify-center items-center">
                      <button
                        onClick={() =>
                          navigate("/Payment", {
                            state: { id: d?.id, pathName: location?.pathname },
                          })
                        }
                        className="bg-green-500 text-white text-[10px] sm:text-sm px-2 sm:px-4 py-1 rounded-md hover:bg-blue-600 transition active:scale-95"
                      >
                        Details
                      </button>
                      {(d?.status === StatusPending || d?.status === null) && (
                        <button
                          onClick={() => handleDelete(d?.id)}
                          className="bg-red-600 text-white text-[10px] sm:text-sm px-2 sm:px-4 py-1 rounded-md hover:bg-red-400 transition active:scale-95"
                        >
                          {dataLoadDelete ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<FaAngleRight className="text-sm sm:text-lg" />}
        previousLabel={<FaAngleLeft className="text-sm sm:text-lg" />}
        pageRangeDisplayed={2}
        pageCount={page}
        onPageChange={handlePage}
        renderOnZeroPageCount={null}
        className="flex gap-1 sm:gap-2 flex-wrap justify-center items-center my-3 sm:my-4 space-x-1 sm:space-x-2 cursor-pointer"
        pageClassName="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-md shadow-sm hover:bg-blue-100 transition duration-300"
        pageLinkClassName="text-gray-700 font-medium"
        activeClassName="bg-blue-500 text-white border-blue-600 shadow-md"
        previousClassName="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-white shadow-sm hover:bg-gray-200 transition duration-300"
        nextClassName="border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-white shadow-sm hover:bg-gray-200 transition duration-300"
        breakClassName="text-gray-500 px-2"
      />
    </motion.div>
  );
}

export default MyOrders;
