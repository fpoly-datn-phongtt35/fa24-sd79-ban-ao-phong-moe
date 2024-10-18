import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllBrands = async (keyword) => {
  return await authorizedAxiosInstance
    .get(
      `${API_ROOT}/brand${keyword !== "" ? "?keyword=" + keyword.trim() : ""}`
    )
    .then((res) => res.data);
};

export const postBrand = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/brand`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const putBrand = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/brand/edit/${id}`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const deleteBrand = async (id) => {
  await authorizedAxiosInstance
    .patch(`${API_ROOT}/brand/is-delete/${id}`)
    .then((res) => toast.success(res.data.message));
};
