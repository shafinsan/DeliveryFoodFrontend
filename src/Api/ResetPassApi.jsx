import axios from "axios";

// MonsterASP লাইভ সার্ভার বেস ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

// ১. পাসওয়ার্ড রিসেট রিকোয়েস্ট তৈরি করা (ইমেইল পাঠানো)
export const ResetPassCreate = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/Reset/create`, data);
    return response.data;
  } catch (error) {
    // সার্ভার থেকে আসা সঠিক এরর মেসেজ দেখানোর জন্য
    const errorMessage = error.response?.data?.message || "Server Error";
    throw new Error(errorMessage);
  }
};

// ২. নতুন পাসওয়ার্ড সেট করা
export const NewPassApi = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/Reset/resetPass`, data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Server Error";
    throw new Error(errorMessage);
  }
};
