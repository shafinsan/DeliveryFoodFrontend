import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

// ডায়নামিক হেডার ফাংশন (টোকেন লেটেস্ট রাখার জন্য)
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

export const AllProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Food/GetAll`);
    return response?.data;
  } catch (error) {
    // Axios এ এরর রেসপন্স error.response এ থাকে
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const CreateFoodProduct = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/Food/Create`, data, {
      headers: getAuthHeaders(true), // ইমেজ আপলোডের জন্য multipart জরুরি
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const UpdateFoodProduct = async (data, id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Food/UpdateById/${id}`,
      data,
      {
        headers: getAuthHeaders(true), // আপডেট করার সময়ও ইমেজ থাকতে পারে
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const DeleteFoodProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Food/DeleteById/${id}`, {
      headers: getAuthHeaders(), // ডিলিট এর জন্য JSON হেডারই যথেষ্ট
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};
