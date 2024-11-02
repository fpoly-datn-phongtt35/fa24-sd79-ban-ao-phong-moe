// import axios from "axios";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

// const API_URL = "http://localhost:2004/api/v2/promotion"; // Change to your backend URL

export const fetchAllDiscounts = async (page = 0, size = 5) => {
  return await authorizedAxiosInstance
  .get(`${API_ROOT}/promotion`, {params:{page, size}})
  .then((res) => res.data); 
};

export const postDiscount = async (promotionData) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/promotion/store`, promotionData)
    .then((res) => {
      return res.data;
    });
   
};

export const deleteDiscount = async (id) => {
  // return await authorizedAxiosInstance.delete(`${`${API_ROOT}/promotion/delete`}/${id}`);
  return await authorizedAxiosInstance.delete(`${API_ROOT}/promotion/delete/${id}`)
  // .then((res) => toast.success(res.data.message));
};

export const putDiscount = async (id, promotionData) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/promotion/update/${id}`, promotionData);
};

export const detailDiscount = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/promotion/detail/${id}`)
    .then((res) => res.data)
};

export const searchDiscounts = async (keyword, startDate, endDate) => {
  const params = {
    keyword: keyword || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  return await authorizedAxiosInstance.get(`${API_ROOT}/promotion/searchKeywordAndDate`, { params })
    .then((res) => res.data);
};



