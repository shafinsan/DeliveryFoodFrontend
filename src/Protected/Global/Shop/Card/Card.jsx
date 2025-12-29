import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCartArrowDown } from "react-icons/fa";
// Stores
import { productStore } from "../../../../Store/ProductStore";
import { CartStore } from "../../../../Store/CartStore";

// Base URL - ideally move this to a config file or env variable
const IMAGE_BASE_URL = "http://ejfoodieordernow.runasp.net/";
const PLACEHOLDER_IMAGE =
  "https://t3.ftcdn.net/jpg/00/69/85/64/360_F_69856461_O8p56mlDwWo0mXFswcYbGbP7Ihlbimiw.jpg";

function Card({ data }) {
  // Destructure from data to keep things DRY
  const { id, name, description, price, imagePath } = data;

  const navigate = useNavigate();

  // Zustand States
  const { product, addProduct } = productStore((state) => state);
  const { addToCart } = CartStore((state) => state);

  const isActive = product.some((p) => p?.id === id);

  const toggleWishlist = (e) => {
    e.stopPropagation(); // Prevents triggering parent clicks if any
    addProduct(data);
  };

  const handleDetails = () => {
    navigate("/Details", { state: { id } });
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    addToCart(data);
  };

  return (
    <div className="card bg-base-100 sm:w-36 md:w-40 lg:w-50 shadow-sm overflow-hidden">
      <figure className="h-32 w-full">
        <img
          src={imagePath ? `/external-assets/${imagePath}` : PLACEHOLDER_IMAGE}
          alt={name}
          className="object-cover w-full h-full"
        />
      </figure>

      <div className="relative flex flex-col p-2">
        {/* Action Icons */}
        <div className="px-2 absolute w-full -top-7 left-0 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="text-white drop-shadow-md text-lg"
            onClick={handleCartClick}
          >
            <FaCartArrowDown />
          </motion.button>

          <motion.button
            onClick={toggleWishlist}
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.2 }}
            className="text-white drop-shadow-md text-lg"
          >
            <FaHeart color={isActive ? "red" : "white"} />
          </motion.button>
        </div>

        {/* Title */}
        <h1 className="font-bold text-center text-xs md:text-sm truncate">
          {name}
        </h1>

        {/* Description */}
        <div
          className="font-mono text-[11px] md:text-[13px] text-gray-600 h-10 overflow-hidden mt-1"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 40) + "..." }}
        />

        {/* Footer */}
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-primary text-xs md:text-sm">${price}</p>
          <button
            onClick={handleDetails}
            className="btn btn-xs btn-warning text-white capitalize"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
