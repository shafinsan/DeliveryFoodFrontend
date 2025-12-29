import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  IoShieldCheckmarkOutline,
  IoLocationOutline,
  IoCallOutline,
  IoPersonOutline,
} from "react-icons/io5";

// Internal Imports
import Lodding from "../../../../UtilityFolder/Lodding";
import { ProfileApi } from "../../../../Api/Profile";
import { CartStore } from "../../../../Store/CartStore";
import { AddToCart } from "../../../../Api/CartApi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Summary() {
  const { cart, deleteCart } = CartStore((state) => state);
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) navigate("/");
  }, [cart, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 1. Data Fetching (Profile)
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileApi(),
  });

  // 2. Mutation (Place Order)
  const orderMutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: (value) => AddToCart(value),
    onSuccess: (data) => {
      if (data.status) {
        toast.success("Order placed successfully!");
        deleteCart();
        navigate("/");
      } else {
        toast.error("Something went wrong on our end.");
      }
    },
  });

  // 3. Totals Calculation
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const onPlaceOrder = (formData) => {
    const payload = cart.map((item) => ({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      phone: formData.phone,
      foodId: item.id,
      qty: item.quantity,
      price: item.price,
      userID: null,
    }));
    orderMutation.mutate(payload);
  };

  if (profileLoading) return <Lodding />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-gray-900">
            Confirm Your Order
          </h1>
          <p className="text-gray-500">
            Please review your details and items before finishing.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onPlaceOrder)}
          className="grid lg:grid-cols-12 gap-8"
        >
          {/* --- LEFT: SHIPPING FORM (7 COLS) --- */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <IoLocationOutline size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Shipping Destination
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Recipient Name
                  </label>
                  <div className="relative">
                    <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register("name", { required: "Name is required" })}
                      defaultValue={
                        profile?.data?.firstName
                          ? `${profile.data.firstName} ${
                              profile.data.lastName || ""
                            }`
                          : ""
                      }
                      className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      } rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <input
                    {...register("address", {
                      required: "Address is required",
                    })}
                    defaultValue={profile?.data?.address}
                    className={`w-full px-4 py-3.5 bg-gray-50 border ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    placeholder="Street name, Apartment, etc."
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-2 font-medium">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    defaultValue={profile?.data?.location}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Post Code
                  </label>
                  <input
                    {...register("zipCode", {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]{4,5}$/,
                        message: "Invalid code",
                      },
                    })}
                    placeholder="1200"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      defaultValue={profile?.data?.phone}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT: ORDER SUMMARY (5 COLS) --- */}
          <aside className="lg:col-span-5">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden sticky top-8"
            >
              <div className="p-8">
                <h2 className="text-xl font-black text-gray-900 mb-6">
                  Order Breakdown
                </h2>

                {/* Product List */}
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-600">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 tracking-tight">
                            ${item.price.toFixed(2)} / unit
                          </p>
                        </div>
                      </div>
                      <p className="font-black text-gray-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-dashed border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-500 font-bold uppercase text-xs">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-gray-900 font-black text-lg">
                      Total
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={orderMutation.isPending}
                  type="submit"
                  className={`w-full mt-8 py-4 ${
                    orderMutation.isPending
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3`}
                >
                  {orderMutation.isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Complete Purchase</>
                  )}
                </motion.button>

                <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                  <IoShieldCheckmarkOutline size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Secure encrypted checkout
                  </span>
                </div>
              </div>
            </motion.div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default Summary;
