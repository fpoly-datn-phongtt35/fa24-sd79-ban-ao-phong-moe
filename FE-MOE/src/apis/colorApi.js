import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllColors = async (keyword) => {
  return await authorizedAxiosInstance
    .get(
      `${API_ROOT}/color${keyword !== "" ? "?keyword=" + keyword.trim() : ""}`
    )
    .then((res) => res.data);
};

export const postColor = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/color`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const putColor = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/color/edit/${id}`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const deleteColor = async (id) => {
  await authorizedAxiosInstance
    .patch(`${API_ROOT}/color/is-delete/${id}`)
    .then((res) => toast.success(res.data.message));
};
