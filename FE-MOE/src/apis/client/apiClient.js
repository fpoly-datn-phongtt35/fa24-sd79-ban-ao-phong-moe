// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

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
export const fetchBrands = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/brand`)
    .then((res) => res.data);
};
export const fetchMaterials = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/material`)
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
        keword ? `&keyword=${encodeURIComponent(keword)}` : ""
      }`
    )
    .then((res) => res.data?.data?.content);
};

export const getOrders = async (pageNo, pageSize, keyword, status) => {
  let uri = "client/order?";
  let queryParams = [];

  if (pageNo !== null && pageNo !== undefined) {
    queryParams.push(`pageNo=${pageNo}`);
  }
  if (pageSize !== null && pageSize !== undefined) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (keyword) {
    queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
  }
  if (status !== null && status !== undefined) {
    queryParams.push(`status=${status}`);
  }
  queryParams.push(`userId=${localStorage.getItem("userId")}`);
  uri += queryParams.join("&");

  return await authorizedAxiosInstance
    .get(`${API_ROOT}/${uri}`)
    .then((res) => res.data);
};

export const cancelInvoice = async (id, message) => {
  return await authorizedAxiosInstance
    .patch(`${API_ROOT}/client/cancel-order/${id}/${message}`)
    .then((res) => toast.success(res.data.message));
};

export const billStatus = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/client/status.php`)
    .then((res) => res.data);
};

export const getProductsFilter = async (data) => {
  let uri = "/client/filters?";
  let queryParams = [];

  if (data.pageNo !== null && data.pageNo !== undefined) {
    queryParams.push(`pageNo=${data.pageNo}`);
  }

  if (data.pageSize !== null && data.pageSize !== undefined) {
    queryParams.push(`pageSize=${data.pageSize}`);
  }

  if (data.keyword) {
    queryParams.push(
      `keyword=${encodeURIComponent(data.keyword)}`
    );
  }

  if (data.categoryIds && data.categoryIds.length > 0) {
    queryParams.push(`categoryIds=${data.categoryIds.join(",")}`);
  }

  if (data.brandIds && data.brandIds.length > 0) {
    queryParams.push(`brandIds=${data.brandIds.join(",")}`);
  }

  if (data.materialIds && data.materialIds.length > 0) {
    queryParams.push(`materialIds=${data.materialIds.join(",")}`);
  }

  if (data.minPrice !== null && data.minPrice !== undefined) {
    queryParams.push(`minPrice=${data.minPrice}`);
  }

  if (data.maxPrice !== null && data.maxPrice !== undefined) {
    queryParams.push(`maxPrice=${data.maxPrice}`);
  }

  if (data.sortBy) {
    queryParams.push(`sortBy=${data.sortBy}`);
  }

  uri += queryParams.join("&");

  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}`)
    .then((res) => res.data);
};

export const SearchBase = async (keyword) => {
  return await authorizedAxiosInstance
    .get(
      `${API_ROOT}/client/search-base?keyword=${encodeURIComponent(keyword)}`
    )
    .then((res) => res.data);
};
