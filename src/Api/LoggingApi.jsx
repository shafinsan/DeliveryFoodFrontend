import axios from "axios";

// আপনার লাইভ এপিআই ইউআরএল
const BASE_URL = "http://ejfoodieordernow.runasp.net/api";

export const loging = async (data) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/SignIn/Loggin`, 
      data
    );
    return res.data;
  } catch (error) {
    // Axios এ এরর ডাটা সাধারণত error.response এর ভেতর থাকে
    // নিচের মতো করে লিখলে সার্ভার থেকে আসা সঠিক এরর মেসেজটি দেখতে পাবেন
    const errorMessage = error.response?.data?.message || "Server Error";
    throw new Error(errorMessage);
  }
};