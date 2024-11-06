// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";

export const fetchAllProducts = async (pageNo) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client?page=${pageNo}`)
    .then((res) => res.data);
};

export const fetchBestSellingProducts = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/best-selling-products`)
    .then((res) => res.data);
};

export const fetchCategories = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/category`)
    .then((res) => res.data);
};

export const fetchProduct = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/${id}`)
    .then((res) => res.data);
};

export const storeCart = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/client/add-to-cart`, data)
    .then((res) => res.data);
};

export const buyNow = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/client/buy`, data)
    .then((res) => res.data)
    .catch();
};

export const fetchCarts = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/cart`)
    .then((res) => res.data);
};

export const deleteItemCart = async (id) => {
  return await authorizedAxiosInstance
    .delete(
      `${API_ROOT}/client/delete-cart/${id}/${localStorage.getItem("username")}`
    )
    .then((res) => res.data);
};

export const updateCart = async (data) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/client/update-cart`, data)
    .then((res) => res.data);
};

export const getUserAddressCart = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/user-address?id=${localStorage.getItem("userId")}`)
    .then((res) => res.data);
};

export const createOrder = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/client/order`, data)
    .then((res) => res.data);
};

export const fetchAllVouchers = async (id, keword) => {
  return await authorizedAxiosInstance
    .get(
      `${API_ROOT}/client/vouchers/${id}?pageNo=1&pageSize=100${
        keword ? `&keyword=${keword}` : ""
      }`
    )
    .then((res) => res.data?.data?.content);
};