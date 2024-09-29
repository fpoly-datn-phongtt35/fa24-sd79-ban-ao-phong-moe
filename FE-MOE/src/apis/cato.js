import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllCategories = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/categories`)
    .then((res) => res.data);
};

export const postCategory = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/categories`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const deleteCategory = async (id) => {
  await authorizedAxiosInstance
    .patch(`${API_ROOT}/categories/is-delete/${id}`)
    .then((res) => toast.success(res.data.message));
};
