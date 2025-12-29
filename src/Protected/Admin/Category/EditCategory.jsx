import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSave,
  FaSpinner,
} from "react-icons/fa";

// APIs & Utilities
import { getSingleCategory, updateCtegory } from "../../../Api/CategoryApi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

function EditCategory() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // 1. Fetch Existing Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getCategory", state?.id],
    queryFn: () => getSingleCategory(state?.id),
    enabled: !!state?.id,
  });

  // 2. Sync Form with Data
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
      });
    }
  }, [data, reset]);

  // 3. Update Mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ["UpdateCategory"],
    mutationFn: (formData) => updateCtegory(formData, state?.id),
    onSuccess: (res) => {
      if (res?.status === 200 || res?.status === 204) {
        toast.success("Category updated successfully!");
        navigate("/CategoryDashbord");
      }
    },
    onError: () => toast.error("Failed to update category"),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      // Cleanup previous objectURL to prevent memory leaks
      return () => preview && URL.revokeObjectURL(preview);
    }
  };

  const onSubmit = (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    if (selectedFile) {
      dataToSend.append("imageFile", selectedFile);
    }
    mutate(dataToSend);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lodding />
      </div>
    );
  if (isError || !state?.id) return <Error />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center items-start"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Edit Category
          </h1>
          <div className="w-8" />
        </div>

        <form
          className="p-6 md:p-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50/50 outline-none transition-all ${
                errors.name
                  ? "border-red-400 ring-2 ring-red-50"
                  : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              }`}
              {...register("name", {
                required: "Category name is required",
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Category Branding
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="w-full h-56 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:bg-slate-100">
                <img
                  src={
                    preview ||
                    (data?.imagePath
                      ? `http://ejfoodieordernow.runasp.net/${data.imagePath}`
                      : "https://via.placeholder.com/400")
                  }
                  alt="Category"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                  <div className="bg-white/90 p-3 rounded-2xl shadow-xl flex items-center gap-2">
                    <FaCloudUploadAlt className="text-blue-600" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Change Photo
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider mt-2">
              Leave blank to keep existing image
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditCategory;
