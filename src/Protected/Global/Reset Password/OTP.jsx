import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

function OTP() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");
  const submit = async (data) => {
    navigate("/newPass", {
      state: {
        email: email,
        otp: data.otp,
      },
    });
  };

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
        <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="otp">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              className={`input input-bordered w-full ${
                errors.otp ? "border-red-500" : ""
              }`}
              placeholder="Enter your OTP"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/, // Ensure OTP is 6 digits
                  message: "OTP must be a 6-digit number",
                },
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Verify OTP
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default OTP;
