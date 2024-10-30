// src/apis/addressApi.js
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";

// Lấy danh sách các tỉnh
export const getAllProvinces = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/address/provinces`)
    .then((res) => res.data);
};

// Lấy danh sách các quận theo tỉnh
export const getDistrictsByProvinceId = async (provinceId) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/address/districts/${provinceId}`)
    .then((res) => res.data);
};

// Lấy danh sách các xã/phường theo quận
export const getWardsByDistrictId = async (districtId) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/address/wards/${districtId}`)
    .then((res) => res.data);
};
