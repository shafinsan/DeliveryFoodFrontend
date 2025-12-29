import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTrashAlt,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";

// APIs & Utilities
import { deleteCategory, getSingleCategory } from "../../../Api/CategoryApi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

function DeleteCategory() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 1. Data Fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getSingleCategory", state?.id],
    queryFn: () => getSingleCategory(state?.id),
    enabled: !!state?.id,
  });

  // 2. Deletion Mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: () => deleteCategory(state?.id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      navigate("/CategoryDashbord");
    },
    onError: () => {
      toast.error("Could not delete category. It might have linked products.");
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lodding />
      </div>
    );
  if (isError || !state?.id) return <Error />;

  const handleDelete = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start md:items-center"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-red-100/50 overflow-hidden border border-red-50">
        {/* Warning Header */}
        <div className="bg-red-50 p-6 flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
            <FaExclamationTriangle size={30} />
          </div>
          <div>
            <h1 className="text-xl font-black text-red-600 tracking-tight">
              Confirm Deletion
            </h1>
            <p className="text-sm text-red-400 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-slate-600 text-center text-sm md:text-base px-2">
              Are you sure you want to delete{" "}
              <span className="font-black text-slate-900">"{data?.name}"</span>?
              All associated data for this category will be permanently removed.
            </p>

            {/* Preview Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <img
                src={
                  data?.imagePath
                    ? `http://ejfoodieordernow.runasp.net/${data?.imagePath}`
                    : "https://via.placeholder.com/150"
                }
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover border border-white shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-800">{data?.name}</h4>
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">
                  Category ID: #{state?.id.slice(0, 8)}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <form
            onSubmit={handleDelete}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="order-2 sm:order-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={14} /> Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="order-1 sm:order-2 py-4 px-6 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <FaTrashAlt /> Delete Now
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default DeleteCategory;
