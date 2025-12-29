import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";
import {
  IoArrowBackSharp,
  IoTrashOutline,
  IoBagCheckOutline,
} from "react-icons/io5";
import { CartStore } from "../../../../Store/CartStore";
import { useNavigate } from "react-router-dom";

/**
 * Professional Animation Constants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function Cart() {
  const { cart, updateCart } = CartStore((state) => state);
  const navigate = useNavigate();

  // 1. Advanced Calculations
  const { subtotal, tax, total } = useMemo(() => {
    const sub = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tx = sub * 0.05; // Assuming 5% tax
    return {
      subtotal: sub,
      tax: tx,
      total: sub + tx,
    };
  }, [cart]);

  // 2. Professional Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-blue-50 p-8 rounded-full mb-6"
        >
          <IoBagCheckOutline className="text-blue-500 text-6xl" />
        </motion.div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Your cart is feeling light
        </h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">
          Looks like you haven't added any delicious meals to your cart yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200"
        >
          Explore Menu
        </motion.button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <motion.button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 mb-2 hover:opacity-70 transition-opacity"
            >
              <IoArrowBackSharp size={18} /> BACK TO STORE
            </motion.button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Checkout Bag
            </h1>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase">
                Estimated Total
              </p>
              <p className="text-xl font-black text-gray-900">
                ${total.toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-gray-100" />
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-black">
              {cart.length} Items
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* --- CART LIST (8 COLS) --- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  className="group relative bg-white border border-gray-100 p-4 md:p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Image with Hover Effect */}
                    <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={
                          `/external-assets/${item.imagePath}` || "https://via.placeholder.com/150"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-xl font-black text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-lg font-black text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 pr-4">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-gray-50">
                        {/* Professional Counter */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                          <button
                            onClick={() => updateCart(item.id, -1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            {item.quantity === 1 ? (
                              <IoTrashOutline size={18} />
                            ) : (
                              "-"
                            )}
                          </button>
                          <span className="w-12 text-center font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCart(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                          Item Total:{" "}
                          <span className="text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* --- SUMMARY SIDEBAR (4 COLS) --- */}
          <aside className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-8 overflow-hidden"
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

              <h2 className="text-2xl font-black mb-8">Payment Summary</h2>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Est. Tax (5%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-gray-800 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    Total Amount
                  </span>
                  <span className="text-4xl font-black text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ y: -4, backgroundColor: "#2563EB" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/Summary")}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3"
                >
                  Checkout Now <IoBagCheckOutline size={22} />
                </motion.button>

                <p className="text-center text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
                  By clicking checkout you agree to our Terms
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
