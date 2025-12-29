import React, { useEffect, useState, useMemo } from "react";
import Rating from "react-rating";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaRegStar,
  FaChevronLeft,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Styles & Internal
import "react-quill/dist/quill.snow.css";
import {
  addComment,
  getAllComment,
  getUserComment,
  SingleFood,
} from "../../../Api/FoodApi";
import { productStore } from "../../../Store/ProductStore";
import { CartStore } from "../../../Store/CartStore";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";
import Comment from "./Comment/Comment";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const id = location.state?.id;

  // Stores
  const { addToCart } = CartStore((state) => state);
  const { product: favList, addProduct } = productStore((state) => state);
  const userEmail = localStorage.getItem("Email");

  // Local UI State
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");

  // 1. Data Fetching
  const {
    data: food,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => SingleFood(id),
    enabled: !!id,
  });

  const { data: commentsResponse } = useQuery({
    queryKey: ["allComments", id],
    queryFn: () => getAllComment(),
  });

  // 2. Mutation Logic
  const commentMutation = useMutation({
    mutationFn: (data) => addComment(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["allComments"]);
      if (res.status) {
        toast.success("Thank you for your review!");
        setComment("");
        setUserRating(0);
      }
    },
  });

  // 3. Sync Favorite State
  useEffect(() => {
    if (food) {
      setIsFavorite(favList.some((p) => p.id === food.id));
    }
  }, [food, favList]);

  // 4. Computed Stats
  const reviewStats = useMemo(() => {
    const relevant =
      commentsResponse?.data?.filter((c) => c.foodId === id) || [];
    const uniqueReviewers = [...new Set(relevant.map((c) => c.userId))];
    return { count: uniqueReviewers.length, data: relevant };
  }, [commentsResponse, id]);

  const handleSubmitReview = () => {
    if (!userEmail) return toast.warn("Please login to leave a review");
    if (!comment.trim()) return toast.warn("Review text cannot be empty");

    commentMutation.mutate({
      foodId: id,
      comment,
      ratting: userRating || food?.rating,
      foodName: food?.name,
      userName: userEmail,
    });
  };

  if (isLoading) return <Lodding />;
  if (isError || !id) return <Error />;
  const handleAddToCart = () => {
    if (food) {
      addToCart(food); // Your existing Zustand store action

      toast.success(`${food.name} added to cart!`, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // Using 'colored' makes the success toast solid green
      });
    }
  };

  const imageUrl = food?.imagePath
    ? `http://ejfoodieordernow.runasp.net/${food.imagePath}`
    : "https://t3.ftcdn.net/jpg/00/69/85/64/360_F_69856461_O8p56mlDwWo0mXFswcYbGbP7Ihlbimiw.jpg";

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 mb-8 transition-colors group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
          BACK TO MENU
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 sticky top-24"
          >
            <div className="relative group rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl border-8 border-white">
              <img
                src={imageUrl}
                alt={food?.name}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Favorite Button */}
              <button
                onClick={() => addProduct(food)}
                className="absolute top-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl text-gray-400 hover:text-red-500 transition-all active:scale-90"
              >
                <FaHeart
                  size={24}
                  className={isFavorite ? "text-red-500 scale-110" : ""}
                />
              </button>

              <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold">
                Organic Certified
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
                Chef's Special Recommendation
              </span>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">
                {food?.name}
              </h1>

              <div className="flex items-center gap-4">
                <Rating
                  initialRating={food?.rating}
                  emptySymbol={<FaRegStar className="text-gray-300 text-xl" />}
                  fullSymbol={<FaStar className="text-yellow-500 text-xl" />}
                  readonly
                />
                <span className="text-gray-400 font-bold text-sm">
                  ({reviewStats.count} Verified Reviews)
                </span>
              </div>
            </div>

            <div
              className="text-gray-500 leading-relaxed text-lg prose prose-blue"
              dangerouslySetInnerHTML={{ __html: food?.description }}
            />

            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase mb-1">
                  Price per serving
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-gray-900">
                    ${food?.price}
                  </span>
                  <span className="text-lg text-gray-300 line-through">
                    ${(food?.price * 1.4).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="h-12 w-[1px] bg-gray-200" />
              <div className="flex-1">
                <p className="text-xs font-bold text-green-600 uppercase">
                  Save 40% Today
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToCart} // Call the handler instead of the store directly
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <FaShoppingCart /> Add to Order
            </button>
          </motion.div>
        </div>

        {/* --- REVIEWS & RATING SECTION --- */}
        <div className="mt-24 pt-20 border-t border-gray-100 grid lg:grid-cols-12 gap-16">
          {/* Review Input */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              Post a Review
            </h3>
            <p className="text-gray-500">
              Your feedback helps us maintain our quality standards.
            </p>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
              <label className="block text-sm font-black text-gray-400 uppercase mb-3">
                Overall Rating
              </label>
              <Rating
                initialRating={userRating}
                emptySymbol={<FaRegStar className="text-gray-200 text-3xl" />}
                fullSymbol={<FaStar className="text-yellow-400 text-3xl" />}
                onClick={setUserRating}
              />

              <div className="mt-8 space-y-2">
                <label className="block text-sm font-black text-gray-400 uppercase">
                  Your Experience
                </label>
                <div className="quill-modern-container">
                  <ReactQuill
                    value={comment}
                    onChange={setComment}
                    placeholder="Tell us about the flavor, portion size, and presentation..."
                    className="h-40 mb-12"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={commentMutation.isPending}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
              >
                {commentMutation.isPending ? "Posting..." : "Submit My Review"}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                Customer Voices
              </h3>
              <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-black uppercase">
                Sort: Latest
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {reviewStats.data.length > 0 ? (
                  reviewStats.data.map(
                    (d, i) =>
                      d.comment && (
                        <motion.div
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          key={d.id || i}
                        >
                          <Comment
                            userName={d.userName}
                            foodName={d.foodName}
                            myComment={d.comment}
                            myId={d.userId}
                            cmtId={d.id}
                          />
                        </motion.div>
                      )
                  )
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold italic">
                      No reviews yet. Be the first to try it!
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
