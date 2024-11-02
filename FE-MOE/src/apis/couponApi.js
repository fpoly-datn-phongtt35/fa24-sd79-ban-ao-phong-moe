import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllCoupon = async (
  pageNo,
  keyword,
  startDate,
  endDate,
  discountType,
  type,
  status,
  pageSize,
  sort,
  direction
) => {
  let uri = "/coupon?";
  let queryParams = [];

  if (pageNo !== null && pageNo !== undefined) {
    queryParams.push(`pageNo=${pageNo}`);
  }
  if (keyword) {
    queryParams.push(`keyword=${keyword}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (discountType) {
    queryParams.push(`discountType=${discountType}`);
  }
  if (type) {
    queryParams.push(`type=${type}`);
  }
  if (status !== null && status !== undefined) {
    queryParams.push(`status=${status}`);
  }
  if (pageSize !== undefined && pageSize !== null) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (sort) {
    queryParams.push(`sort=${sort}`);
  }
  if (direction) {
    queryParams.push(`direction=${direction}`);
  }

  uri += queryParams.join("&");

  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}`)
    .then((res) => res.data);
};

export const postCoupon = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/coupon/store`, data)
    .then((res) => {
      toast.success(res.data.message);
      return res.data.data;
    })
};

export const postCouponImage = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/coupon/upload`, data)
    .then((res) => {
      return res.data.data;
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
      return res.data.data;
    })
};

export const deleteCoupon = async (id) => {
  return await authorizedAxiosInstance
    .delete(`${API_ROOT}/coupon/delete/${id}`)
    .then((res) => {
      toast.success(res.data.message);
    })
};

export const deleteCouponImage = async (id) => {
  return await authorizedAxiosInstance
    .delete(`${API_ROOT}/coupon/delete/images/${id}`)
};

export const sendCouponEmail = async (couponId, customerId) => {
  const url = `${API_ROOT}/coupon/send/email?couponId=${couponId}&customerId=${customerId}`;
  const response = await authorizedAxiosInstance.post(url);
  return response.data;
};

