import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const getAllEmployee = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/employee`)
    .then((res) => res.data);
};

export const getAllPositions = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/employee/positions`)
    .then((res) => res.data);
};


export const postEmployee = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/employee`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const putEmployee = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/employee/${id}`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const deleteEmployee = async (id) => {
  await authorizedAxiosInstance
    .delete(`${API_ROOT}/employee/${id}`)
    .then((res) => toast.success(res.data.message));
};

export const getEmployee = async (id) => {
  try {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/employee/${id}`);
      return res.data; // Trả về dữ liệu từ API
  } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
  }
};


