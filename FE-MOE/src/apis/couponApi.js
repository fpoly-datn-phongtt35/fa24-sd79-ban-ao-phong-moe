import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllCoupon = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/coupon`)
    .then((res) => res.data)
};


export const postCoupon = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/coupon/store`, data)
    .then((res) => {
      toast.success(res.data.message);
    })
};

export const detailCoupon = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/coupon/detail/${id}`)
    .then((res) => res.data)
};

export const updateCoupon = async (id, data) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/coupon/update/${id}`, data)
    .then((res) => { 
      toast.success(res.data.message);
    })
};

export const deleteCoupon = async (id) => {
  return await authorizedAxiosInstance
    .delete(`${API_ROOT}/coupon/delete/${id}`)
    .then((res) => {
      toast.success(res.data.message);
    })
};

export const searchKeywordAndDate = async (keyword, startDate, endDate) => {
  try {
    const params = {};

    if (!keyword && !startDate && !endDate) {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/coupon`); 
      return res.data;
    }

    if (keyword) {
      params.keyword = keyword;
    }

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    const res = await authorizedAxiosInstance.get(`${API_ROOT}/coupon/searchKeywordAndDate`, {
      params: params
    });

    return res.data;
  } catch (err) {
    console.error("Error searching coupons:", err);
    toast.error("Failed to search coupons.");
  }
};



