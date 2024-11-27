import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";
import axios from "axios";
import authorizedAxiosInstance from "~/utils/authorizedAxios";

export const postSupportRequest = async (data) => {
  try {
    const response = await axios.post(`${API_ROOT}/client/support/create`, data);
    toast.success("Gửi thành công");
    return response.data;
  } catch (error) {
    toast.error("Gửi thất bại, vui lòng thử lại");
    throw error;
  }
};
export const getAllSupport = async () => {
  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/client/support/getAll`);
    // toast.success("Lấy thông tin thành công");
    return response.data;
  } catch (error) {
    toast.error("Lấy thông tin thất bại, vui lòng thử lại");
    throw error;
  }
};

