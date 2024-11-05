import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

//them lan 1
export const fetchBill = async (data) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getBill`,data)
    .then((res) => res.data);  
};

export const fetchBillDetailById = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getBillDetail/${id}`)
    .then((res) => res.data);  
};

export const postBill = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/storeBill`, data)
    .then((res) => {
      toast.success(res.data.message);
      return res.data.data;
    })
};

export const deleteBill = async (id) => {
  return await authorizedAxiosInstance
    .delete(`${API_ROOT}/bill/deleteBill/${id}`)
};

//them lan 2
export const fetchAllBillProducts = async (
  pageNo,
  pageSize,
  keyword,
  size,
  color,
  brand
) => {
  let uri = "/product/product-details?";
  let queryParams = [];

  if (pageNo !== null && pageNo !== undefined) {
    queryParams.push(`pageNo=${pageNo}`);
  }
  if (pageSize !== null && pageSize !== undefined) {
    queryParams.push(`pageSize=${pageSize}`);
  }
  if (keyword) {
    queryParams.push(`keyword=${keyword}`);
  }
  if (size) {
    queryParams.push(`size=${size}`);
  }
  if (color) {
    queryParams.push(`color=${color}`);
  }
  if (brand) {
    queryParams.push(`brand=${brand}`);
  }

  uri += queryParams.join("&");

  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}`)
    .then((res) => res.data);
};

export const fetchProduct = async (billId) => { 
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getProduct/${billId}`) 
    .then((res) => res.data);
};

export const postProduct = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/storeProduct`, data)
    .then((res) => {
      return res.data.data;
    })
};

export const deleteProduct = async (id) => {
  return await authorizedAxiosInstance
    .delete(`${API_ROOT}/bill/deleteProduct/${id}`)
};

//them lan 3
export const fetchCustomer = async (billId) => { 
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getCustomer/${billId}`) 
    .then((res) => res.data);
};

export const postCustomer = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/storeCustomer`, null, {
      params: { billId: data.bill, customerId: data.customer }
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      toast.error("Thêm khách hàng vào đơn hàng không thành công");
    });
};

export const deleteCustomer = async (billId) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/deleteCustomer`, null, {
      params: { billId }
    })
    .then((res) => {
      return res.data.data; 
    })
    .catch((error) => {
      toast.error("Xóa khách hàng khỏi đơn hàng không thành công");
    });
};

//them lan 4
export const fetchAllCouponCustomer = async (
  customerId,
  pageNo = 1, 
  keyword = '', 
  pageSize = 5 
) => {
  const uri = `/coupon/getAllCouponCustomers/${customerId}`; // Include customerId in the URL path
  const params = new URLSearchParams();

  if (pageNo !== null && pageNo >= 1) { 
    params.append('pageNo', pageNo);
  }
  if (keyword) {
    params.append('keyword', keyword);
  }
  if (pageSize !== undefined && pageSize !== null) {
    params.append('pageSize', pageSize);
  }

 
  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}?${params.toString()}`) 
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching coupon data:", error);
      throw error;
    });
};

export const fetchCoupon = async (billId) => { 
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getCoupon/${billId}`) 
    .then((res) => res.data);
};

export const postCoupon = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/storeCoupon`, null, {
      params: { billId: data.bill, couponId: data.coupon }
    })
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      toast.error("Áp dụng phiếu giảm giá không thành công");
    });
};

export const deleteCoupon = async (billId) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/bill/deleteCoupon`, null, {
      params: { billId }
    })
    .then((res) => {  
      return res.data.data; 
    })
    .catch((error) => {
      toast.error("Xóa phiếu giảm giá khỏi đơn hàng không thành công");
    });
};

//them lan 5
export const addPay = async (billStoreRequest) => {
  try {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/bill/storePay`, billStoreRequest);
    toast.success("Thêm mới hóa đơn thành công");
    return res.data.data; 
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Thêm mới hóa đơn không thành công";
    toast.error(errorMessage);
    console.error("Error adding new bill:", error);
    throw error;
  }
};

export const reqPay = async (data) => {
  try {
      const response = await authorizedAxiosInstance.get(
          `${API_ROOT}/payment/vn-pay?amount=${data.total}&bankCode=NCB`
      );

      if (response.status === 200) {
          window.location.href = response.data.data; 
      }
  } catch (error) {
      console.error("Failed to redirect to VNPay:", error);
      toast.error("Có lỗi xảy ra khi chuyển hướng sang VNPay.");
  }
};
