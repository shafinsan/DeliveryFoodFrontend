import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBackSharp } from "react-icons/io5";
import { Form, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Reg } from "../Api/RegistrationApi";

function Registration() {
  //gender use state
  const { state } = useLocation();
  const mycheck=state?.value || false
  console.log(mycheck);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  //use react query
  const MyPost = useMutation({
    mutationFn: (data) => Reg(data),
    onSuccess: (data) => {
      if (data?.status) {
        toast.success("Registration successful!");
        reset();
        navigate("/Loggin");
      } else {
        toast.warning(data?.data || "Something went wrong!");
      }
    },
    onError: () => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const gender = watch("gender");
  const submit = (data) => {
    var formData = new FormData();
    formData.append("email", data.email);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("address", data.presentAddress);
    formData.append("location", data.contactNumber);
    formData.append("recoveryEmail", data.recoveryEmail);
    formData.append("gender", data.gender);
    formData.append("phone", data.contactNumber);
    formData.append("password", data.password);
    MyPost.mutate(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 m-8 relative"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {mycheck ? (
          <>
            {" "}
            <NavLink to="/AllUser">
              <IoArrowBackSharp
                className="border-2 absolute top-10 w-10 h-10 p-2 z-40 rounded-full shadow-xl animate-bounce"
                size={30}
              />
            </NavLink>
          </>
        ) : (
          <>
            {" "}
            <NavLink to="/Loggin">
              <IoArrowBackSharp
                className="border-2 absolute top-10 w-10 h-10 p-2 z-40 rounded-full shadow-xl animate-bounce"
                size={30}
              />
            </NavLink>
          </>
        )}

        <form onSubmit={handleSubmit(submit)}>
          {/* First Name */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="input input-bordered w-full"
              placeholder="Enter your first name"
              {...register("firstName",{required:"First Name is Required"})}
              
            />
             {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="input input-bordered w-full"
              placeholder="Enter your last name"
              {...register("lastName",{required:"Last Name is Required"})}
            />
             {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Recovery Email */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="recoveryEmail"
            >
              Recovery Email
            </label>
            <input
              type="email"
              id="recoveryEmail"
              className="input input-bordered w-full"
              placeholder="Enter your recovery email"
              {...register("recoveryEmail")}
            />
          </div>

          {/* Present Address */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="presentAddress"
            >
              Present Address
            </label>
            <input
              type="text"
              id="presentAddress"
              className="input input-bordered w-full"
              placeholder="Enter your address"
              {...register("presentAddress")}
            />
          </div>

          {/* Contact Number */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="contactNumber"
            >
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              className="input input-bordered w-full"
              placeholder="Enter your contact number"
              {...register("contactNumber")}
            />
          </div>

          {/*Gender*/}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="Gender">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full input input-bordered"
            >
              <option defaultChecked disabled>
                Selected
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`input input-bordered w-full ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
            />
            {confirmPassword && confirmPassword !== password && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mb-4"
            disabled={password === confirmPassword ? false : true}
          >
            Register
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Registration;
