import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { loging } from "../Api/LoggingApi";
import { toast } from "react-toastify";
import { TokenDeconder } from "../UtilityFolder/TokenDecoder";


function Logging() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [currentData, setCurrentData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    setCurrentData({
      email: watch("email"),
      password: watch("password"),
    });
  }, [watch("email"), watch("password")]);
  const MyLogging = useMutation({
    mutationFn: (data) => loging(data),
    onSuccess: (data) => {
      if (data?.status) {
        toast.success("Logging successful!");
        const tokenData = data?.data ? data.data : null;
        const expiresIn = Date.now() + 60 * 60 * 1000;
        localStorage.setItem(
          "Token",
          JSON.stringify({ token: tokenData, exp: expiresIn })
        );
        reset();
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500); 
      } else {
        toast.error(data?.data || "Inavalid User");
      }
    },
    onError: () => {
      toast.error(`Error: ${error.message}`);
    },
  });
  const submit = () => {
    MyLogging.mutate(currentData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit(submit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`input input-bordered w-full ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`input input-bordered w-full ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="checkbox mr-2 text-green-500" />
              <span className="text-sm">Remember me</span>
            </label>
            <NavLink
              to="/RecoveryEmail"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </NavLink>
          </div>
          <button type="submit" className="btn btn-primary w-full mb-4">
            Sign In
          </button>
        </form>
        <div className="divider">OR</div>
        <div className="flex justify-center space-x-4 mt-4">
          <button className="btn btn-outline btn-circle text-blue-600">
            <FaFacebookF size={20} />
          </button>
          <button className="btn btn-outline btn-circle text-red-500">
            <FaGoogle size={20} />
          </button>
          <button className="btn btn-outline btn-circle text-blue-400">
            <FaTwitter size={20} />
          </button>
        </div>
        <p className="text-sm text-center mt-4">
          Don’t have an account?
          <NavLink to="/Resgister" className="text-blue-600 hover:underline">
            Sign Up
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

export default Logging;
