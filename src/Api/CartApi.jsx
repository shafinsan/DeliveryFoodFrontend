import axios from "axios";

// লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

// টোকেনটি সরাসরি লোকাল স্টোরেজ থেকে নেওয়ার ফাংশন (যাতে প্রতিবার লেটেস্ট টোকেন পায়)
const getAuthHeader = () => {
    const tokenData = localStorage.getItem("Token");
    if (tokenData) {
        const token = JSON.parse(tokenData).token;
        return { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }
    return {};
};

export const AddToCart = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Cart/addToCart`,
      data,
      { headers: getAuthHeader() } // হেডার এখানে ৩ নম্বর আর্গুমেন্ট হিসেবে যাবে
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const getAllCart = async () => {
  try {
    // লক্ষ্য করুন: axios.post এ ২য় আর্গুমেন্ট হলো data, ৩য় আর্গুমেন্ট হলো config/headers
    const response = await axios.post(
      `${BASE_URL}/Cart/getAllCart`,
      {}, // ২য় আর্গুমেন্ট হিসেবে খালি অবজেক্ট দিন যদি বডিতে কিছু না পাঠান
      { headers: getAuthHeader() } // ৩য় আর্গুমেন্ট হিসেবে হেডার দিন
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};