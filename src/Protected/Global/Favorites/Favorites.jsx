import React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { IoHeartOutline, IoArrowForwardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Internal
import { productStore } from "../../../Store/ProductStore";
import Card from "../Shop/Card/Card";

/**
 * 10,000% Professional Animation Variants
 */
const containerVariants = {
  hide: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Snappy, professional staggering
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hide: { opacity: 0, y: 30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.3 },
  },
};

function Favorites() {
  const navigate = useNavigate();
  const { product: favoriteItems } = productStore((state) => state);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-x-hidden">
      {/* High-End Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              My <span className="text-blue-600">Favorites</span>
            </h1>
            <p className="text-gray-500 font-medium">
              You have {favoriteItems?.length || 0} items saved in your
              wishlist.
            </p>
          </div>

          {favoriteItems?.length > 0 && (
            <button
              onClick={() => navigate("/Shop")}
              className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors group"
            >
              EXPLORE MORE{" "}
              <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </header>

        {/* Main Content Grid */}
        <AnimatePresence mode="popLayout">
          {favoriteItems && favoriteItems.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hide"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
            >
              {favoriteItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVar}
                  layout // This makes cards slide smoothly when one is removed
                  initial="hide"
                  animate="show"
                  exit="exit"
                  className="w-full"
                >
                  <Card
                    id={item.id}
                    name={item.name}
                    rating={item.rating}
                    imagePath={item.imagePath}
                    cookingTime={item.cookingTime}
                    description={item.description}
                    price={item.price}
                    data={item}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* 10,000% Professional Empty State */
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center space-y-6"
            >
              <div className="relative">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                  <IoHeartOutline className="text-blue-500 text-6xl" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500"
                >
                  ❤️
                </motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Looks like you haven't saved any of our delicious meals yet.
                  Start exploring!
                </p>
              </div>
              <button
                onClick={() => navigate("/Shop")}
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-2xl shadow-gray-200 hover:bg-blue-600 transition-all active:scale-95"
              >
                Start Shopping
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const itemVar = {
  hide: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export default Favorites;
