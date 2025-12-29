import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

// ডায়নামিক হেডার ফাংশন (যাতে টোকেন সবসময় লেটেস্ট থাকে)
const getAuthHeaders = () => {
  const tokenData = localStorage.getItem("Token");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getNotificationAPi = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Notifiacation/GetAllNNotification`, // আপনার কন্ট্রোলারের বানান অনুযায়ী
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    // এপিআই থেকে আসা নির্দিষ্ট এরর মেসেজ দেখানোর জন্য
    const errorMessage = error.response?.data?.message || "Server Error";
    throw new Error(errorMessage);
  }
};