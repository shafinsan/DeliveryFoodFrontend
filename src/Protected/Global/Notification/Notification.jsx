import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotificationAPi } from "../../../Api/NotificationApi";
import Lodding from "../../../UtilityFolder/Lodding";
import Error from "../../../UtilityFolder/Error";
function Notification() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllNotification"],
    queryFn: getNotificationAPi,
  });

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
console.log("Notification",data?.data)
  const notifications = [
    { message: "Please Fill your First Name" },
    { message: "Please Fill your Last Name" },
    { message: "Please Confirm Your Order" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      {notifications.map((item, index) => (
        <motion.div
          key={index}
          className="card w-full md:w-3/4 lg:w-1/2 bg-base-100 shadow-lg border border-gray-300 p-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
        >
          <h1 className="text-lg font-semibold text-primary">
            eliasjabershafin100@gmail.com
          </h1>
          <p className="text-gray-500">
            Role: <span className="font-medium text-secondary">Admin</span>
          </p>
          <motion.details
            className="mt-2 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <summary className="cursor-pointer text-accent font-medium">
              View Message
            </summary>
            <p className="text-gray-600 mt-1">{item.message}</p>
          </motion.details>
        </motion.div>
      ))}
    </div>
  );
}

export default Notification;
