import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { NewPassApi } from "../../../Api/ResetPassApi";
function NewPass() {
  const MyToken = localStorage.getItem("Token")
    ? JSON.parse(localStorage.getItem("Token")).token
    : null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, otp } = location.state || {};

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (!email || !otp) throw new Error("Invalid request. Try again.");
      return await NewPassApi({
        email,
        opt: otp,
        password: data.newPassword,
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully!");
      if (MyToken) {
        localStorage.removeItem("Token");
        localStorage.removeItem("Role");
        localStorage.removeItem("Id");
        localStorage.removeItem("Email");
        localStorage.removeItem("profile");
        setTimeout(() => {
          window.location.reload();
        });
      }
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Server Error, Try Again Later");
      navigate("/RecoveryEmail");
    },
  });

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Set New Password
        </h2>
        <form onSubmit={handleSubmit(mutation.mutate)}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className={`input input-bordered w-full ${
                errors.newPassword ? "border-red-500" : ""
              }`}
              placeholder="Enter your new password"
              {...register("newPassword", {
                required: "New password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must include an uppercase letter, lowercase letter, number, and symbol.",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default NewPass;
