import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";


// ডায়নামিক হেডার ফাংশন (যাতে প্রতিবার লেটেস্ট টোকেন পায়)
const getAuthHeaders = () => {
  const tokenData = localStorage.getItem("Token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// --- Food Services ---

export const FoodCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/FoodCategory/GetAll`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const Food = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Food/GetAll`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const SingleFood = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Food/GetById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// --- Comment Services ---

export const getAllComment = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Comment/GetAll`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const getUserComment = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Comment/Get/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const addComment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/Comment/Add`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const UpdateComment = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/Comment/Update/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Comment/Delete/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};