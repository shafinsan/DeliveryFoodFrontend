import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

// ডায়নামিক হেডার ফাংশন
const getAuthHeaders = () => {
  const tokenData = localStorage.getItem("Token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ১. এডমিন দ্বারা সব অর্ডার দেখা
export const getAllOrderByAdminAPi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/GetAllOrder`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ২. সিঙ্গেল অর্ডার ডিটেইলস
export const getSingleOrderAPi = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/GetSingleOrder/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৩. অর্ডার ডিটেইলস আপডেট
export const UpdateOrderDetailsAPi = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}/Order/UpdateDetails`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৪. বর্তমান ইউজারের অর্ডার লিস্ট
export const getCurrentUserOrderAPi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/GetCurrentUserOrder`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৫. ডেলিভারি ইউজারের অর্ডার লিস্ট
export const getDeliveryUserOrderAPi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Order/GetDeliverOrder`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৬. স্ট্রাইপ চেকআউট সেশন তৈরি (বডি খালি রাখা হয়েছে)
export const CheckOutApi = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/create-checkout-session/${id}`,
      {}, // ২য় আর্গুমেন্ট (Data) খালি রাখা হয়েছে
      { headers: getAuthHeaders() } // ৩য় আর্গুমেন্ট (Config)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৭. পেমেন্ট কনফার্ম করা
export const ConfirmPaymentApi = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/confirm-payment`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৮. এডমিন দ্বারা স্ট্যাটাস আপডেট
export const UpdateStatusByAdminApi = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/UpdateStatusByAdmin/${id}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ৯. এমপ্লয়ি দ্বারা স্ট্যাটাস আপডেট
export const UpdateStatusByEmployeeApi = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/UpdateStatusByEmployee/${id}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ১০. রিফান্ড করা
export const RefundedApi = async (id) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/Order/Refund/${id}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};

// ১১. অর্ডার ডিলিট করা
export const DeleteOrderApi = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Order/delete/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Server Error");
  }
};
