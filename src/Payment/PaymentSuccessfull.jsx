import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Icons
import {
  IoArrowBackOutline,
  IoCheckmarkCircle,
  IoReceiptOutline,
  IoCalendarOutline,
  IoWalletOutline,
} from "react-icons/io5";

// Internal
import { ConfirmPaymentApi, getSingleOrderAPi } from "../Api/OrderApi";
import Lodding from "../UtilityFolder/Lodding";

// Animation Variants
const containerVar = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function PaymentSuccessfull() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("CHECKOUT_SESSION_ID");
  const orderId = searchParams.get("order_id");

  // 1. Data Fetching (Order Details)
  const {
    data: orderResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getPaymentSuccessfull", orderId],
    queryFn: () => getSingleOrderAPi(orderId),
    enabled: !!orderId,
  });

  const orderItems = orderResponse?.data?.store || [];

  // 2. Mutation (Confirm Sync with Backend)
  const confirmMutation = useMutation({
    mutationKey: ["ConfirmPayment"],
    mutationFn: (id) => ConfirmPaymentApi(id),
    onSuccess: (res) => {
      if (res) {
        toast.success("Transaction verified and order placed!");
        navigate("/MyOrder");
      } else {
        toast.error("Verification failed. Please contact support.");
      }
    },
    onError: () => toast.error("Network error during verification"),
  });

  // 3. Totals Calculation
  const totalAmount = useMemo(() => {
    return orderItems.reduce((acc, curr) => acc + curr?.price * curr?.qty, 0);
  }, [orderItems]);

  if (isLoading) return <Lodding />;
  if (isError || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-2xl font-black text-gray-800">Invalid Session</h2>
          <p className="text-gray-500 mb-6">
            We couldn't verify your payment details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVar}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-100"
      >
        {/* Header - Success Badge */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="white" />
            </svg>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="relative z-10 inline-flex items-center justify-center w-20 h-20 bg-white rounded-full text-blue-600 shadow-xl mb-4"
          >
            <IoCheckmarkCircle size={48} />
          </motion.div>
          <h1 className="relative z-10 text-2xl font-black text-white">
            Payment Received!
          </h1>
          <p className="relative z-10 text-blue-100 opacity-80 text-sm">
            Session: {sessionId.substring(0, 15)}...
          </p>
        </div>

        <div className="p-6 md:p-10">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <IoReceiptOutline /> Order ID
              </div>
              <p className="text-gray-900 font-bold">#{orderId || "N/A"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-1">
                <IoCalendarOutline /> Date
              </div>
              <p className="text-gray-900 font-bold">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <h3 className="text-gray-900 font-black mb-4 flex items-center gap-2">
            Order Items{" "}
            <span className="text-blue-600 text-sm">({orderItems.length})</span>
          </h3>

          {/* Items List */}
          <div className="space-y-3 mb-8">
            {orderItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVar}
                className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl hover:border-blue-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs">
                    {item?.qty}x
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {item?.food?.name}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      ${item?.price?.toFixed(2)} each
                    </p>
                  </div>
                </div>
                <p className="font-black text-gray-900">
                  ${(item?.price * item?.qty).toFixed(2)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Tear-off Section */}
          <div className="border-t-2 border-dashed border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center mb-2 text-gray-500">
              <span className="font-bold">Subtotal</span>
              <span className="font-black text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-6 text-gray-500">
              <span className="font-bold">Processing Fee</span>
              <span className="text-green-500 font-black uppercase text-xs tracking-widest">
                Waived
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  Total Paid
                </p>
                <p className="text-4xl font-black text-gray-900">
                  ${totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  <IoWalletOutline /> Stripe Secure
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/MyOrder")}
              className="w-full py-4 px-6 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
            >
              <IoArrowBackOutline /> Back to Orders
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => confirmMutation.mutate(sessionId)}
              disabled={confirmMutation.isPending}
              className="w-full py-4 px-6 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {confirmMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Confirm Final Order"
              )}
            </motion.button>
          </div>
        </div>

        {/* Professional Footer Badge */}
        <div className="bg-gray-50 py-4 text-center border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Thank you for choosing EJ FOOD
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentSuccessfull;
