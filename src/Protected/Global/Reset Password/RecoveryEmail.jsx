import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ResetPassCreate } from "../../../Api/ResetPassApi";


function RecoveryEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      return ResetPassCreate({ email: data.recoveryEmail });
    },
    onSuccess: (response, data) => {
      console.log("Response", response);
      console.log("data",data);
      if (response.status) {
        toast.success(response.data || "OTP sent to your email!");
        navigate(`/Otp?email=${encodeURIComponent(data.recoveryEmail)}`);
      } else {
        toast.error("Failed to send OTP. Try again.");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    },
  });

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit(mutation.mutate)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="recoveryEmail"
            >
              Recovery Email
            </label>
            <input
              type="email"
              id="recoveryEmail"
              className={`input input-bordered w-full ${
                errors.recoveryEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your recovery email"
              {...register("recoveryEmail", {
                required: "Recovery email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.recoveryEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recoveryEmail.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2 flex justify-center items-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default RecoveryEmail;
