import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Icons
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaSave,
  FaSpinner,
  FaUtensils,
  FaClock,
  FaTag,
} from "react-icons/fa";

// APIs & Utilities
import { SingleFood } from "../../../Api/FoodApi";
import { getAllCategory } from "../../../Api/CategoryApi";
import { UpdateFoodProduct } from "../../../Api/ProductAPi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";

function UpdateProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.id;
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const descriptionWatch = watch("Description");

  // 1. Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["getAllCategory"],
    queryFn: getAllCategory,
  });

  // 2. Fetch Single Product Data
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getSingleProduct", productId],
    queryFn: () => SingleFood(productId),
    enabled: !!productId,
  });

  // 3. Update Mutation
  const { mutate, isPending } = useMutation({
    mutationKey: ["updateproduct"],
    mutationFn: (formData) => UpdateFoodProduct(formData, productId),
    onSuccess: (res) => {
      if (res?.status === 204 || res?.status === 200) {
        toast.success("Dish updated successfully!");
        navigate("/ProductDashbord");
      }
    },
    onError: () => toast.error("Failed to update product details."),
  });

  // Sync Data with Form when fetched
  useEffect(() => {
    if (productData) {
      reset({
        Name: productData.name,
        Price: productData.price,
        CookingTime: productData.cookingTime,
        FoodCategoryID: productData.foodCategoryID,
        Description: productData.description,
      });
    }
  }, [productData, reset]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Lodding />
      </div>
    );
  if (isError || !productId) return <Error />;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (formData) => {
    const dataToSend = new FormData();
    dataToSend.append("Name", formData.Name);
    dataToSend.append("Price", formData.Price);
    dataToSend.append("Description", formData.Description);
    dataToSend.append("CookingTime", formData.CookingTime);
    dataToSend.append("FoodCategoryID", formData.FoodCategoryID);

    if (formData.File?.[0]) {
      dataToSend.append("formFile", formData.File[0]);
    }

    mutate(dataToSend);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center"
    >
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all"
          >
            <FaArrowLeft />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Update Dish
            </h1>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
              Editing Mode
            </p>
          </div>
          <div className="w-10" />
        </div>

        <form
          className="p-6 md:p-10 space-y-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Media & Details */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaCloudUploadAlt className="text-blue-500" /> Visual Branding
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    {...register("File")}
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="w-full h-64 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:bg-slate-100">
                    <img
                      src={
                        imagePreview ||
                        (productData?.imagePath
                          ? `/external-assets/${productData.imagePath}`
                          : "https://via.placeholder.com/400")
                      }
                      alt="Product"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                      <div className="bg-white/90 p-3 rounded-2xl shadow-xl flex items-center gap-2">
                        <FaCloudUploadAlt className="text-blue-600" />
                        <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                          Update Image
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaTag className="text-blue-500" /> Dish Category
                </label>
                <select
                  className="select select-bordered w-full rounded-2xl bg-slate-50 border-slate-200 focus:outline-blue-500"
                  {...register("FoodCategoryID")}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: Info & Pricing */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  Dish Name
                </label>
                <input
                  type="text"
                  placeholder="Enter dish name"
                  className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200"
                  {...register("Name", { required: "Dish name is mandatory" })}
                />
                {errors.Name && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
                    {errors.Name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="text-sm font-bold text-slate-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200"
                    {...register("Price", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className="form-control">
                  <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaClock className="text-slate-400" /> Prep Time
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200"
                    {...register("CookingTime", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUtensils className="text-slate-400" /> Ingredients &
                  Details
                </label>
                <div className="rounded-[1.5rem] overflow-hidden border border-slate-200">
                  <ReactQuill
                    theme="snow"
                    value={descriptionWatch}
                    onChange={(content) => setValue("Description", content)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
            >
              Cancel Changes
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin text-xl" /> SYNCING DATA...
                </>
              ) : (
                <>
                  <FaSave /> COMMIT UPDATES
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default UpdateProduct;
