import axios from "axios";
const BASE_URL = "/api";
export const Reg = async (data) => {
  try {
    
    const response = await axios.post(`${BASE_URL}/Registration/Registration`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Server Error"
    );
  }
};
