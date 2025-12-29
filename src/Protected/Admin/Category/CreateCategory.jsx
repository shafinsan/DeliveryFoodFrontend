import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { createCtegory } from "../../../Api/CategoryApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaArrowLeft, FaSpinner } from "react-icons/fa";

function CreateCategory() {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch for file changes to handle preview logic professionally
  const selectedFile = watch("imageFile");

  useEffect(() => {
    if (selectedFile && selectedFile.length > 0) {
      const file = selectedFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Clean up memory to prevent leaks
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["CreateCategory"],
    mutationFn: (formData) => createCtegory(formData),
    onSuccess: (res) => {
      if (res?.status === 201 || res?.status === 200) {
        toast.success("Category created successfully!");
        reset();
        navigate("/CategoryDashbord");
      } else {
        toast.error("Failed to create category. Please try again.");
      }
    },
    onError: () => {
      toast.error("A server error occurred.");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.imageFile[0]) {
      formData.append("imageFile", data.imageFile[0]);
    }
    mutate(formData);
  };

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
            New Category
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <form
          className="p-6 md:p-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Category Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Italian Pizza"
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50/50 outline-none transition-all ${
                errors.name
                  ? "border-red-400 ring-2 ring-red-50"
                  : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              }`}
              {...register("name", {
                required: "Please enter a category name",
                maxLength: { value: 50, message: "Name is too long" },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Professional Image Upload Zone */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Upload Branding
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                {...register("imageFile", { required: "An image is required" })}
              />
              <div
                className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                  preview
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-slate-200 bg-slate-50 group-hover:bg-slate-100"
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500 font-medium">
                      Click or drag image here
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-black mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
            {errors.imageFile && (
              <p className="text-red-500 text-xs font-bold ml-1">
                {errors.imageFile.message}
              </p>
            )}
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
                  <FaSpinner className="animate-spin" /> Processing...
                </>
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default CreateCategory;
