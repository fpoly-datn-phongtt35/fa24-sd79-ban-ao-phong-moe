import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const getAllEmployee = async (page = 0, size = 5) => { // Mặc định trang 0 và 5 phần tử mỗi trang
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/employee`, {
      params: { page, size },
    })
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
      return res.data.data;
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
    // console.log('Employee data from API:', res.data);
    return res.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw error;
  }
};
// api.js hoặc file tương tự
export const searchNameAndPhone = async (keyword, phone_number) => {
  try {
    const params = {};

    if (!keyword && !phone_number) {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/employee`);
      return res; // Đảm bảo trả về toàn bộ phản hồi
    }

    if (keyword) {
      params.keyword = keyword;
    }

    if (phone_number) {
      params.phone_number = phone_number;
    }

    const res = await authorizedAxiosInstance.get(`${API_ROOT}/employee/searchNameAndPhone`, {
      params: params
    });

    return res; // Đảm bảo trả về toàn bộ phản hồi
  } catch (err) {
    console.error("Error searching employee:", err);
    toast.error("Failed to search employee");
    throw err; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
};
export const postEmployeeImage = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/employee/upload`, data)
    .then((res) => {
      return res.data.data
    });
};
export const setLocked = async (id, isLocked) => {
  return await authorizedAxiosInstance.patch(
    `${API_ROOT}/employee/change-isLocked/${id}/${isLocked}`
  );
};