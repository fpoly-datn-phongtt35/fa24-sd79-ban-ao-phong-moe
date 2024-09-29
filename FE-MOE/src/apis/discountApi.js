import axios from "axios";

const API_URL = "http://localhost:2004/api/v2/promotion"; // Change to your backend URL

export const fetchAllDiscounts = async () => {
  return await axios.get(API_URL);
};

export const postDiscount = async (data) => {
  return await axios.post(API_URL, data);
};

export const deleteDiscount = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
