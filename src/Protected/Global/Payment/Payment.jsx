import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckOutApi,
  getSingleOrderAPi,
  RefundedApi,
  UpdateOrderDetailsAPi,
  UpdateStatusByAdminApi,
  UpdateStatusByEmployeeApi,
} from "../../../Api/OrderApi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";
import {
  StatusPaid,
  StatusPending,
  StatusProcess,
  StatusShift,
} from "../../Admin/Order User Details/Status";
import { pre } from "framer-motion/client";
import { toast } from "react-toastify";
function Payment() {
  const client = useQueryClient();
  const [dataLoadCheckOut, setDataLoadCheckOut] = useState(false);
  const navigate = useNavigate();
  //get order
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getSingleOrder"],
    queryFn: () => getSingleOrderAPi(location.state?.id),
  });

  //payment
  const MyPayment = useMutation({
    mutationKey: ["checkOut"],
    mutationFn: async (data) => {
      setDataLoadCheckOut(true);
      return await CheckOutApi(data);
    },
    onSuccess: (data) => {
      setDataLoadCheckOut(false);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Payment Unsuccessfull");
      }
    },
    onError:(data)=>{
      console.log("payment",data)
    }
  });
  //update by admin
  const [adminLoading, setAdminLoading] = useState(false);
  const UpdateByAdmin = useMutation({
    mutationKey: ["updateByadmin"],
    mutationFn: async (id) => {
      setAdminLoading(true);
      return await UpdateStatusByAdminApi(id);
    },
    onSuccess: (data) => {
      if (data.status) {
        setAdminLoading(false);
        client.invalidateQueries(["getSingleOrder"]);
        toast.success("Order Confrim By Admin");
      } else {
        setAdminLoading(false);
        toast.success("Operation Failed");
      }
    },
  });
  //update by employee
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const UpdateByEmployee = useMutation({
    mutationKey: ["updateByEmployee"],
    mutationFn: async (id) => {
      setEmployeeLoading(true);
      return await UpdateStatusByEmployeeApi(id);
    },
    onSuccess: (data) => {
      if (data.status) {
        setEmployeeLoading(false);
        client.invalidateQueries(["getSingleOrder"]);
        toast.success("Order Shifted Successfully");
      } else {
        setEmployeeLoading(false);
        toast.success("Operation Failed");
      }
    },
  });
  //delete by user
  //refunded

  const [refundedLoading, setrefundedLoading] = useState(false);
  const refundedByUser = useMutation({
    mutationKey: ["refunded"],
    mutationFn: async (id) => {
      setrefundedLoading(true);
      return await RefundedApi(id);
    },
    onSuccess: (data) => {
      if (data.status) {
        setrefundedLoading(false);
        client.invalidateQueries(["getSingleOrder"]);
        toast.success("Refunded Successfully");
      } else {
        setrefundedLoading(false);
        toast.success("Refunded Failed");
      }
    },
  });

  const Role = localStorage.getItem("Role") || null;
  const clinet = useQueryClient();

  const [edit, setEdit] = useState(false);
  const location = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const updateData = useMutation({
    mutationKey: ["updateData"],
    mutationFn: (data) => UpdateOrderDetailsAPi(data),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data?.data || "Update Successfull");
        clinet.invalidateQueries("[getSingleOrder]");
      } else {
        toast.error(data?.data || "Update unSuccessfull");
        clinet.invalidateQueries("[getSingleOrder]");
      }
    },
  });
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

  const mySubmit = (data) => {
    if (!edit) {
      setEdit(true);
      return;
    }
    const myData = {
      orderId: location.state?.id,
      name: data?.name,
      address: data?.address,
      city: data?.city,
      phone: data?.phone,
      zipCode: data?.zipCode,
    };
    updateData.mutate(myData);
    setEdit(false);
    return;
  };

  const handleCheckOut = (OrderId) => {
    MyPayment.mutate(OrderId);
  };
  const handleConfirm = (OrderId) => {
    UpdateByAdmin.mutate(OrderId);
  };
  const handleShift = (OrderId) => {
    UpdateByEmployee.mutate(OrderId);
  };
  const handleRefunded = (OrderId) => {
    refundedByUser.mutate(OrderId);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="m-auto md:w-2xl bg-gray-100 p-6 rounded-lg shadow-md my-10">
        <div className="p-4 border-2 border-gray-300 bg-white flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-2 rounded-lg">
          {/* Shipping Details */}
          <form className="w-[100%]" onSubmit={handleSubmit(mySubmit)}>
            <div className="flex flex-col w-full md:w-[100%] border-2 border-gray-300 bg-gray-50 p-4 rounded-lg">
              <h1 className="mb-4 text-lg font-semibold text-gray-700">
                Shipping Details
              </h1>

              {/* Name */}
              <label className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">
                  Name {errors.name && <span className="text-red-500">*</span>}
                </span>
                <input
                  {...register("name", {
                    required: "Name is Required",
                    minLength: 3,
                  })}
                  defaultValue={data?.data?.name}
                  readOnly={edit ? false : true}
                  type="text"
                  className="input input-bordered border-gray-400 focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                  placeholder="Full Name"
                />
              </label>

              {/* Address */}
              <label className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">
                  Address{" "}
                  {errors.address && <span className="text-red-500">*</span>}
                </span>
                <input
                  {...register("address", {
                    required: "Address is Required",
                    minLength: 3,
                  })}
                  defaultValue={data?.data?.address}
                  readOnly={edit ? false : true}
                  type="text"
                  className="input input-bordered border-gray-400 focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                  placeholder="Your Address"
                />
              </label>

              {/* City */}
              <label className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">
                  City {errors.city && <span className="text-red-500">*</span>}
                </span>
                <input
                  {...register("city", {
                    required: "City is Required",
                    minLength: 2,
                  })}
                  defaultValue={data?.data?.city}
                  readOnly={edit ? false : true}
                  type="text"
                  className="input input-bordered border-gray-400 focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                  placeholder="City Name"
                />
              </label>

              {/* Post Code */}
              <label className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">
                  Post Code{" "}
                  {errors.zipCode && <span className="text-red-500">*</span>}
                </span>
                <input
                  {...register("zipCode", {
                    required: "Post Code is Required",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "Enter a valid Post Code",
                    },
                  })}
                  defaultValue={data?.data?.zipCode}
                  readOnly={edit ? false : true}
                  type="text"
                  className="input input-bordered border-gray-400 focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                  placeholder="1234"
                />
              </label>

              {/* Phone */}
              <label className="flex flex-col mb-2">
                <span className="text-gray-600 font-medium">
                  Phone
                  {errors.phone && <span className="text-red-500">*</span>}
                </span>
                <input
                  {...register("phone", {
                    required: "Phone is Required",
                    pattern: {
                      value: /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  defaultValue={data?.data?.phone}
                  readOnly={edit ? false : true}
                  type="text"
                  className="input input-bordered border-gray-400 focus:ring-2 focus:ring-blue-500 rounded-md p-2"
                  placeholder="018XXXXXXXX"
                />
              </label>

              {/* check if admin confirm the product then disable this button */}
              {(data?.data?.status === StatusPaid ||
                data?.data?.status === StatusPending ||
                data?.data?.status === null) && (
                <button
                  onSubmit={handleSubmit}
                  className={`${
                    edit
                      ? "bg-yellow-600 hover:bg-yellow-400"
                      : "bg-gray-500 hover:hover:bg-gray-400"
                  } mt-4 py-2 text-white font-semibold rounded-lg `}
                >
                  {edit ? "Confirm Update" : "Modify Information"}
                </button>
              )}
            </div>
          </form>

          <div className="border-2 border-gray-300 bg-gray-50 p-4 rounded-lg w-full md:w-[50%]">
            <h1 className="mb-4 text-lg font-semibold text-gray-700">
              Order Summary
            </h1>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-gray-700">
                <thead className="bg-gray-200 text-gray-600">
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Count</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {data?.data?.store?.map((d, i) => (
                    <>
                      <tr key={i} className="hover:bg-gray-100 text-center">
                        <td className="text-sm">{d?.food?.name}</td>
                        <td>${d?.price}</td>
                        <td>{d?.qty}</td>
                        <td>${(d?.price * d?.qty).toFixed(2)}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <th className="p-2">Total</th>
                    <th></th>
                    <th></th>
                    <th className="p-2">
                      $
                      {data?.data?.store
                        ?.reduce(
                          (pre, curr) => pre + curr?.price * curr?.qty,
                          0
                        )
                        .toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-2 mt-4">
              {(data?.data?.status === StatusPending ||
                data?.data?.status === null) && (
                <button
                  onClick={() => handleCheckOut(data?.data?.id)}
                  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95"
                >
                  {dataLoadCheckOut ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Check Out"
                  )}
                </button>
              )}
              {data?.data?.status === StatusPaid && Role === "Admin" && (
                <button
                  onClick={() => handleConfirm(data?.data?.id)}
                  className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:scale-95"
                >
                  {adminLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              )}
              {data?.data?.status === StatusProcess && Role === "Employee" && (
                <button
                  onClick={() => handleShift(data?.data?.id)}
                  className="w-full py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 active:scale-95"
                >
                  {employeeLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Shipped"
                  )}
                </button>
              )}
              {data?.data?.status === StatusPaid && (
                <button
                  onClick={() => handleRefunded(data?.data?.id)}
                  className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:scale-95"
                >
                  {refundedLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Refuned"
                  )}
                </button>
              )}

              <button
                onClick={() => navigate(location?.state?.pathName || "/")}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-red-700 active:scale-95"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Payment;
