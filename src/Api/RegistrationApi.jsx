import axios from "axios";
export const Reg = async (data) => {
  try {
    
    const response = await axios.post(`https://localhost:7163/api/Registration/Registration`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : "Server Error"
    );
  }
};
