// import axios from "axios";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

// const API_URL = "http://localhost:2004/api/v2/promotion"; // Change to your backend URL

export const fetchAllDiscounts = async () => {
  return await authorizedAxiosInstance
  .get(`${API_ROOT}/promotion`)
  .then((res) => res.data);
};

export const postDiscount = async (promotionData) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/promotion/store`, promotionData);
   
};

export const deleteDiscount = async (id) => {
  // return await authorizedAxiosInstance.delete(`${`${API_ROOT}/promotion/delete`}/${id}`);
  return await authorizedAxiosInstance.delete(`${API_ROOT}/promotion/delete/${id}`);
};

export const putDiscount = async (id, promotionData) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/promotion/update/${id}`, promotionData);
};

export const detailDiscount = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/promotion/detail/${id}`)
    .then((res) => res.data)
};

