import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Icons
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaUtensils,
  FaClock,
  FaTag,
  FaSpinner,
} from "react-icons/fa";

// APIs & Utilities
import { getAllCategory } from "../../../Api/CategoryApi";
import { CreateFoodProduct } from "../../../Api/ProductAPi";
import Lodding from "../../../UtilityFolder/Lodding";

function CreateProduct() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { Description: "" },
  });

  const descriptionContent = watch("Description");

  const { mutate, isPending } = useMutation({
    mutationKey: ["CreateProduct"],
    mutationFn: CreateFoodProduct,
    onSuccess: (res) => {
      if (res?.status === 201 || res?.status === 200) {
        toast.success("Dish added to the menu!");
        reset();
        navigate("/ProductDashbord");
      }
    },
    onError: () => toast.error("Check your connection or data format."),
  });

  // Handle Image Preview with Cleanup
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview); // Memory cleanup
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Price", data.Price);
    formData.append("Description", data.Description);
    formData.append("CookingTime", data.CookingTime);
    formData.append("formFile", data.File[0]);
    formData.append("FoodCategoryID", data.FoodCategoryID);
    mutate(formData);
  };

  if (catLoading) return <Lodding />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center"
    >
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Area */}
        <div className="p-6 md:p-8 bg-white border-b border-slate-50 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Add New Dish
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Kitchen Dashboard
            </p>
          </div>
          <div className="w-10" /> {/* Balance spacer */}
        </div>

        <form
          className="p-6 md:p-10 space-y-8"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Media & Visuals */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaCloudUploadAlt className="text-blue-500" /> Dish Image
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    {...register("File", { required: "Image is essential" })}
                    onChange={handleImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div
                    className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                      imagePreview
                        ? "border-transparent"
                        : "border-slate-200 bg-slate-50 group-hover:bg-slate-100"
                    }`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-[22px]"
                      />
                    ) : (
                      <div className="text-center">
                        <FaCloudUploadAlt className="text-4xl text-slate-300 mx-auto mb-2" />
                        <span className="text-sm text-slate-400 font-medium">
                          Upload dish photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {errors.File && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.File.message}
                  </p>
                )}
              </div>

              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaTag className="text-blue-500" /> Category
                </label>
                <select
                  className="select select-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:outline-blue-500"
                  {...register("FoodCategoryID", {
                    required: "Select a category",
                    valueAsNumber: true,
                  })}
                >
                  <option value="">Choose category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.FoodCategoryID && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.FoodCategoryID.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Information & Pricing */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2">
                  Dish Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grilled Salmon Pasta"
                  className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:outline-blue-500"
                  {...register("Name", { required: "Name is required" })}
                />
                {errors.Name && (
                  <p className="text-red-500 text-xs mt-2 font-bold">
                    {errors.Name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200"
                    {...register("Price", {
                      required: "Required",
                      min: 0.1,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="form-control">
                  <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-slate-400" /> Time (min)
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200"
                    {...register("CookingTime", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUtensils className="text-slate-400" /> Description
                </label>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <ReactQuill
                    theme="snow"
                    value={descriptionContent}
                    onChange={(content) => setValue("Description", content)}
                    placeholder="Tell customers about the ingredients and taste..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" /> Processing Kitchen
                  Data...
                </>
              ) : (
                "Publish Dish to Menu"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default CreateProduct;
