import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

// export const fetchAllCustomer = async () => {
//   return await authorizedAxiosInstance
//     .get(`${API_ROOT}/customer`)
//     .then((res) => res.data);
// };
export const fetchAllCustomer = async (page = 0, size = 5) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/customer`, { params: { page, size } })
    .then((res) => res.data);
};

export const fetchCustomerById = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/customer/detail/${id}`)
    .then((res) => res.data);
};


export const postCustomer = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/customer/store`, data)
    .then((res) => {
      return res.data.data;
    });
};
export const deleteCustomer = async (id) => {
  await authorizedAxiosInstance
    .delete(`${API_ROOT}/customer/delete/${id}`)
    .then((res) => toast.success(res.data.message));
};
export const putCustomer = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/customer/update/${id}`, data);
}

export const postcustomerImage = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/customer/upload`, data)
    .then((res) => {
      return res.data.data
    });
};
export const setLocked = async (id, isLocked) => {
  return await authorizedAxiosInstance.patch(
    `${API_ROOT}/customer/change-isLocked/${id}/${isLocked}`
  );
};
export const searchKeywordAndDate = async (keyword, gender, birth) => {
  try {
    const params = {};

    // Only fetch all customers if no filters are applied
    if (!keyword && !gender && !birth) {
      const res = await authorizedAxiosInstance.get(`${API_ROOT}/customer`);
      return res.data;
    }

    // Add query parameters if they are provided
    if (keyword) {
      params.keyword = keyword;
    }

    if (gender) {
      params.genderStr = gender; // Use genderStr as expected by the backend
    }

    if (birth) {
      params.dateOfBirth = birth; // Assuming birth is in YYYY-MM-DD format
    }

    const res = await authorizedAxiosInstance.get(`${API_ROOT}/customer/search`, {
      params: params
    });

    return res.data;
  } catch (err) {
    console.error("Error searching customers:", err);
    toast.error("Failed to search customers.");
  }
};
