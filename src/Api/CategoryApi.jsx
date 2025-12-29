import axios from "axios";

// MonsterASP লাইভ সার্ভার ইউআরএল
const BASE_URL = "/api";

// ডায়নামিক হেডার ফাংশন যাতে টোকেন সবসময় লেটেস্ট থাকে
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

export const getAllCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/FoodCategory/GetAll`, {
      headers: getAuthHeaders(),
    });
    return response?.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const createCtegory = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/FoodCategory/Create`, data, {
      headers: getAuthHeaders(true), // ইমেজ থাকলে multipart/form-data ব্যবহার হবে
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const getSingleCategory = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/FoodCategory/GetById/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const updateCtegory = async (data, id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/FoodCategory/UpdateById/${id}`,
      data,
      {
        headers: getAuthHeaders(true), // আপডেটের সময়ও ইমেজ থাকতে পারে
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/FoodCategory/DeleteById/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};