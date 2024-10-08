import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";

export const fetchAllCoupon = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/coupon`)
    .then((res) => res.data)
};


export const postCoupon = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/coupon/store`, data)
    .then((res) => {
      toast.success(res.data.message);
    })
};

export const detailCoupon = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/coupon/detail/${id}`)
    .then((res) => res.data)
};

export const updateCoupon = async (id, data) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/coupon/update/${id}`, data)
    .then((res) => { 
      toast.success(res.data.message);
    })
};

export const deleteCoupon = async (id) => {
  return await authorizedAxiosInstances
    .delete(`${API_ROOT}/coupon/delete/${id}`)
    .then((res) => {
      toast.success(res.data.message);
    })
};

// export const searchKeywordAndDate = async (keyword, startDate, endDate, discountType, type, status) => {
//   try {
//     const params = {};

//     if (!keyword && !startDate && !endDate && !discountType && !type && !status) {
//       const res = await authorizedAxiosInstance.get(`${API_ROOT}/coupon`); 
//       return res.data;
//     }

//     if (keyword) {
//       params.keyword = keyword;
//     }

//     if (startDate) {
//       params.startDate = startDate;
//     }

//     if (endDate) {
//       params.endDate = endDate;
//     }

//     if (discountType) {
//       params.discountType = discountType;
//     }

//     if (type) {
//       params.type = type;
//     }

//     if (status) {
//       params.status = status;
//     }

//     const res = await authorizedAxiosInstance.get(`${API_ROOT}/coupon/searchKeywordAndDate`, {
//       params: params
//     });

//     return res.data;
//   } catch (err) {
//     console.log("Searching with params:", params);
//     toast.error("Failed to search coupons.");
//   }
// };

export const searchKeywordAndDate = async (keyword, startDate, endDate, discountType, type, status, page, size, sort, direction) => {
  try {
      const params = {};

      if (keyword) params.keyword = keyword;

      // Logic to handle startDate and endDate
      if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          
          if (start > end) {
              console.error("Start date cannot be after end date.");
              toast.error("Start date cannot be after end date.");
              return null;
          } else {
              params.startDate = startDate;
              params.endDate = endDate;
          }
      } else {
          if (startDate) params.startDate = startDate;
          if (endDate) params.endDate = endDate;
      }

      if (discountType) params.discountType = discountType;
      if (type) params.type = type;
      if (status) params.status = status;

      // Pagination logic
      if (page !== undefined) params.page = page - 1; // Spring Data JPA uses 0-based index for pages
      if (size !== undefined) params.size = size;

      // Sorting logic
      if (sort && direction) {
          params.sort = sort;
          params.direction = direction;
      }

      const res = await authorizedAxiosInstance.get(`${API_ROOT}/coupon/searchKeywordAndDate`, { params });
      return res.data;
  } catch (err) {
      console.error("Failed to search coupons.", err);
      toast.error("Failed to search coupons.");
      return null;
  }
};










