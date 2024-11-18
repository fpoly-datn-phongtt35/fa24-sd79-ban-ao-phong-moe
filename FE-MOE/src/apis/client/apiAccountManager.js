import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";



export const fetchAccountInfoById = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/accountManager/detailAccount/${id}`)
    .then((res) => res.data);
};

export const fetchAddressInfoById = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/accountManager/detailAddress/${id}`)
    .then((res) => res.data);
};

export const putAccountInfo = async (data, id) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/accountManager/updateAccount/${id}`, data);
};

export const putAddressInfo = async (data, id) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/accountManager/updateAddress/${id}`, data);
};

export const putPassword = async (data, id) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/accountManager/updatePassWord/${id}`, data);
};

export const postcustomerImage = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/accountManager/upload`, data)
    .then((res) => {
      return res.data.data
    });
};

  