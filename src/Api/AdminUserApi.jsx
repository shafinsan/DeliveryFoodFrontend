import axios from "axios";

// আপনার লাইভ সার্ভার ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

const MyToken = localStorage.getItem("Token")
  ? JSON.parse(localStorage.getItem("Token")).token
  : null;

// একটি Axios Instance তৈরি করা যাতে বারবার URL লিখতে না হয়
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${MyToken}`,
    "Content-Type": "application/json",
  },
});

export const getAllUserAdmin = async () => {
  try {
    const response = await apiClient.get("/User/getAll");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const getAllRole = async () => {
  try {
    const response = await apiClient.get("/User/getAllRoles");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const UserUpdateRole = async (data) => {
  try {
    const response = await apiClient.put("/User/updateRole", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const LockedUser = async (data) => {
  try {
    const response = await apiClient.put("/User/lockProfile", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

export const UnlockedUser = async (data) => {
  try {
    const response = await apiClient.put("/User/unlockProfile", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};