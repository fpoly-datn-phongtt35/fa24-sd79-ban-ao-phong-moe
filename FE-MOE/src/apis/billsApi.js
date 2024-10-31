import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";
export const fetchAllBillProducts = async (
  pageNo,
  pageSize,
  name,
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
  if (name) {
    queryParams.push(`name=${name}`);
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
//them lan 1
export const fetchBill = async (data) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getBill`,data)
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
      toast.success(res.data.message);
      return res.data.data; 
    })
    .catch((error) => {
      toast.error("Xóa phiếu giảm giá khỏi đơn hàng không thành công");
    });
};
