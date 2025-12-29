import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTrashAlt,
  FaArrowLeft,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

// APIs & Utilities
import { SingleFood } from "../../../Api/FoodApi";
import { DeleteFoodProduct } from "../../../Api/ProductAPi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

function DeleteProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.id;

  // 1. Fetch Product Details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getSingleProduct", productId],
    queryFn: () => SingleFood(productId),
    enabled: !!productId,
  });

  // 2. Delete Mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteproduct"],
    mutationFn: () => DeleteFoodProduct(productId),
    onSuccess: () => {
      toast.success("Dish removed from menu");
      navigate("/ProductDashbord");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Lodding />
      </div>
    );
  if (isError || !productId) return <Error />;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start md:items-center"
    >
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-red-100/50 overflow-hidden border border-red-50">
        {/* Warning Banner */}
        <div className="bg-red-50 p-6 flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
            <FaExclamationTriangle size={28} />
          </div>
          <h1 className="text-xl font-black text-red-600 tracking-tight uppercase">
            Confirm Deletion
          </h1>
          <p className="text-sm text-red-400 font-bold">
            This action is permanent and cannot be undone.
          </p>
        </div>

        <form className="p-6 md:p-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Dish Preview
              </label>
              <img
                src={
                  data?.imagePath
                    ? `http://ejfoodieordernow.runasp.net/${data?.imagePath}`
                    : "https://via.placeholder.com/300"
                }
                alt="Preview"
                className="w-full h-48 object-cover rounded-3xl border border-slate-100 shadow-inner"
              />
            </div>

            {/* Core Info */}
            <div className="space-y-4">
              <div className="form-control">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Product Name
                </label>
                <p className="text-lg font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {data?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Price
                  </label>
                  <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    ${data?.price}
                  </p>
                </div>
                <div className="form-control">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Time
                  </label>
                  <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {data?.cookingTime}m
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Description Snapshot
            </label>
            <div
              className="text-sm text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 h-24 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={14} /> Keep Product
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-xl shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <FaTrashAlt /> Delete Forever
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default DeleteProduct;
