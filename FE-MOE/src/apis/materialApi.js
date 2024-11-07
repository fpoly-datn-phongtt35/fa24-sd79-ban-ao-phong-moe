// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllMaterials = async (keyword) => {
  return await authorizedAxiosInstance
    .get(
      `${API_ROOT}/material${
        keyword !== "" ? "?keyword=" + keyword.trim() : ""
      }`
    )
    .then((res) => res.data);
};

export const postMaterial = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/material`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const putMaterial = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/material/edit/${id}`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const deleteMaterial = async (id) => {
  await authorizedAxiosInstance
    .patch(`${API_ROOT}/material/is-delete/${id}`)
    .then((res) => toast.success(res.data.message));
};

