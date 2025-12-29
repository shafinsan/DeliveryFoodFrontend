import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "/api";

// ডায়নামিক হেডার ফাংশন (টোকেন সবসময় আপডেট রাখার জন্য)
const getAuthHeaders = (isMultipart = false) => {
  const tokenData = localStorage.getItem("Token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// ১. ইউজারের প্রোফাইল তথ্য আনা
export const ProfileApi = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Profile/GetProfile`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    // Axios এ এরর রেসপন্স error.response এ থাকে
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ২. প্রোফাইল আপডেট করা (ইমেজ সহ)
export const UpdateProfileApi = async (data) => {
  try {
    const res = await axios.put(`${BASE_URL}/Profile/UpdateProfile`, data, {
      headers: getAuthHeaders(true), // প্রোফাইল পিকচারের জন্য multipart জরুরি
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};