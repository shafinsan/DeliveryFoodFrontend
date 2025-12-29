import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoArrowBackSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { ProfileApi, UpdateProfileApi } from "../../../Api/Profile";
import { toast } from "react-toastify";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";
function Profile() {
  const queryClient = useQueryClient();
  const [image, setImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const {
    data: myData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => ProfileApi(),
    staleTime: 10000,
  });
  const mutation = useMutation({
    mutationFn: (value) => UpdateProfileApi(value),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"]);
      if (data.status) {
        toast.success("Profile Updated Successfully");
      } else {
        toast.error("Server Error");
      }
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm();
  const naviagate = useNavigate();

  //data enroling
  if (isLoading) {
    return (
      <>
        <Lodding />
      </>
    );
  }
  if (isError) {
    return (
      <>
        <Error />
      </>
    );
  }
  const path = myData?.data?.profilePic || null;

  const handleImage = (e) => {
    var file = e.target.files[0];
    setImageFile(e.target.files[0]);
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (data) => {
    let formData = new FormData();
    formData.append("email", data?.email);
    formData.append("firstName", data?.firstName);
    formData.append("lastName", data?.lastName);
    formData.append("address", data?.presentAddress);
    formData.append("location", data?.presentAddress);
    formData.append("recoveryEmail", data?.recoveryEmail);
    formData.append("gender", data?.gender);
    formData.append("phone", data?.contactNumber);
    formData.append("image", imageFile ? imageFile : "");
    mutation.mutate(formData);
    setEdit(false);
  };
  if (path) {
    localStorage.setItem("profile", `/external-assets/${path}`);
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 m-8 relative"
      >
        <div className="flex justify-center items-center flex-col space-y-3 text font text-center mb-6">
          <div className="flex justify-center items-center w-40 h-40 mt-2 rounded shadow-2xl">
            {image || path !== null ? (
              image !== null ? (
                <>
                  <img
                    src={image}
                    alt="profile"
                    className="w-full h-full bg-white rounded bg-cover object-cover"
                  />
                </>
              ) : (
                <>
                  <img
                    src={`/external-assets/${path}`}
                    alt="profile"
                    className="w-full h-full bg-white rounded bg-cover object-cover"
                  />
                </>
              )
            ) : (
              <img
                src="https://static.vecteezy.com/system/resources/previews/020/911/747/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                alt="profile"
                className="bg-white rounded"
              />
            )}
          </div>
          {edit && (
            <input
              type="file"
              className="file-input file-input-bordered max-w-60 "
              onChange={handleImage}
            />
          )}
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              defaultValue={myData?.data?.firstName}
              {...register("firstName", { required: "First Name is Required" })}
              readOnly={!edit}
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
              defaultValue={myData?.data?.lastName}
              {...register("lastName", { required: "Last Name is Required" })}
              readOnly={!edit}
            />
             {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
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
              defaultValue={myData?.data?.email}
              readOnly={!edit}
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
              defaultValue={myData?.data?.recoveryEmail}
              readOnly={!edit}
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
              defaultValue={myData?.data?.location}
              readOnly={!edit}
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
              defaultValue={myData?.data?.phone}
              readOnly={!edit}
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
              defaultValue={myData?.data?.gender}
              readOnly={!edit}
            >
              <option defaultChecked disabled>
                Selected
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div
            onClick={() => {
              if (edit) {
                handleSubmit(handleFormSubmit)(); // Submit the form if in edit mode
              } else {
                setEdit(true); // Set edit mode to true when clicked to enable editing
              }
            }}
            className={`btn ${
              edit ? "bg-yellow-600 text-white" : "btn-primary"
            } w-full mb-4`}
          >
            {edit ? <div>Save</div> : <div>Update</div>}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;
