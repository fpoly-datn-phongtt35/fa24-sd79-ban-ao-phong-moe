import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllProducts = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/product`)
    .then((res) => res.data);
};

export const postProduct = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/product`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};