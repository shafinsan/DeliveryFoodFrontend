import { delay, motion, useSpring } from "framer-motion";
import React, { Children, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate=useNavigate()
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setX(document.querySelector("#box").clientWidth);
      setY(document.querySelector("#box").clientHeight);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const parentVarient = {
    hide: {
      opacity: 0,
      y: 50, // Start with 50px down
    },
    show: {
      opacity: 1,
      y: 0, // End at the original position
      transition: {
        staggerChildren: 0.3,
        staggerDirection: 1,
        type: "spring",
        stiffness: 100,
        damping: 25,
      },
    },
  };

  const childVarient = {
    hide: {
      opacity: 0,
      x: -20,
      scale: 0.8, // Start smaller
    },
    show: {
      opacity: 1,
      x: 0,
      scale: 1, // End at normal size
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  };

  const handlClick=()=>{
    navigate("/")
  }
  return (
    <div
      id="box"
      className="relative h-screen flex justify-center items-center"
    >
      <motion.div
        drag
        dragConstraints={{
          left: 0 - (x - 276) / 2,
          right: 0 + (x - 276) / 2,
          top: 0 - (y - 500) / 2,
          bottom: 0 + (y - 276) / 2,
        }}
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{
          duration: 1,
          stiffness: 100,
          type: "spring",
        }}
        className="shadow-2xl absolute w-40 h-40 left-auto top-[20%] md:top-[12%] rounded-full"
      >
        <img
          src="https://media.istockphoto.com/id/1487043735/vector/website-page-not-found-error-404-robot-character-broken-chatbot-mascot-disabled-technical.jpg?s=612x612&w=0&k=20&c=d7Rh_FZ_SckGPhwMQm9NjmINziEYsY6ciGD-X9g5Zn4="
          alt=""
          className="rounded-full pointer-events-none"
        />
      </motion.div>
      <motion.div
        className="flex flex-col justify-center items-center p-4"
        variants={parentVarient}
        initial="hide"
        animate="show"
      >
        <motion.h1
          drag
          dragConstraints={{
            left: 0 - (x - 276) / 2,
            right: 0 + (x - 276) / 2,
            top: 0 - (y - 250) / 2,
            bottom: 0 + (y - 276) / 2,
          }}
          className="text-5xl text-red-500"
          variants={Children}
          initial="hide"
          animate="show"
        >
          401
        </motion.h1>
        <motion.p
          drag
          dragConstraints={{
            left: 0 - (x - 276) / 2,
            right: 0 + (x - 276) / 2,
            top: 0 - (y - 120) / 2,
            bottom: 0 + (y - 276) / 2,
          }}
          variants={childVarient}
          initial="hide"
          animate="show"
        >
          You are not authorized for selection action
        </motion.p>
        <motion.p
          drag
          dragConstraints={{
            left: 0 - (x - 276) / 2,
            right: 0 + (x - 276) / 2,
            top: 0 - (y) / 2,
            bottom: 0 + (y - 276) / 2,
          }}
          className="mt-4"
          variants={childVarient}
          initial="hide"
          animate="show"
        >
          Go to Home <span onClick={handlClick} className="text-blue-600 underline cursor-pointer">Page</span>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Unauthorized;
