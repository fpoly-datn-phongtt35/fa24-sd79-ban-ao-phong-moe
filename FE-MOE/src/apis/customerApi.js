import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllCustomer = async () => {
    return await authorizedAxiosInstance
      .get(`${API_ROOT}/customer`)
      .then((res) => res.data);
  };
  
  export const postCustomer = async (data) => {
    return await authorizedAxiosInstance
      .post(`${API_ROOT}/customer/store`, data)
      .then((res) => {
        toast.success(res.data.message);
      });
  };
  export const deleteCustomer = async (id) => {
    await authorizedAxiosInstance
      .delete(`${API_ROOT}/customer/${id}`)
      .then((res) => toast.success(res.data.message));
  };
  export const putCustomer = async (data, id) => {
    return await authorizedAxiosInstance
      .put(`${API_ROOT}/customer/update/${id}`, data)
      .then((res) => {
        toast.success(res.data.message);
      });
  };