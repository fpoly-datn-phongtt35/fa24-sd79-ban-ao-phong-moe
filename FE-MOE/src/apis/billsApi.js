import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

//them lan 1
export const fetchBill = async (data) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/bill/getBill`, data)
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

export const putCustomer = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/bill/update/${id}`, data);
}

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
  const uri = `/coupon/getAllCouponCustomers/${customerId}`; 
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

export const addPayBillEdit = async (billStoreRequest) => {
  try {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/bill/storePay`, billStoreRequest);
    return res.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Thêm mới hóa đơn không thành công";
    toast.error(errorMessage);
    console.error("Error adding new bill:", error);
    throw error;
  }
};

export const reqPay = async (data, uri) => {
  await authorizedAxiosInstance
    .get(`${API_ROOT}/payment/vn-pay?amount=${data.billRequest.total}&bankCode=NCB${uri}`)
    .then((res) => {
      if (res.status === 200) {
        window.location.href = res.data.data;
      }
    });
};

const handleBanking = async () => {
  const data = JSON.parse(localStorage.getItem("temp_data"));
  let newData = {
    ...data,
    billRequest: {
      ...data.billRequest,
      bankCode: localStorage.getItem("bankCode")
    }
  }

  await addPay(newData).then(() => {
    localStorage.removeItem("temp_data");
    localStorage.removeItem("bankCode");
  });
};

export const handleVerifyBanking = (status, bankCode) => {
  if (status === "00") {
    let data = JSON.parse(localStorage.getItem("temp_data"));
    data.bankCode = bankCode;
    localStorage.setItem("temp_data", JSON.stringify(data));
    handleBanking();
    return true;
  } else if (status === "01") {
    toast.error("Giao dịch chưa hoàn tất");
  } else if (status === "02") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị lỗi");
  } else if (status === "04") {
    localStorage.removeItem("temp_data");
    toast.error(
      "Giao dịch đảo (Khách hàng đã bị trừ  tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)"
    );
  } else if (status === "05") {
    localStorage.removeItem("temp_data");
    toast.error("VNPAY đang xử lý giao dịch này (GD hoàn tiền)");
  } else if (status === "06") {
    localStorage.removeItem("temp_data");
    toast.error("VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)");
  } else if (status === "07") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị nghi ngờ gian lận ");
  } else if (status === "08") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch quá thời gian thanh toán ");
  } else if (status === "09") {
    localStorage.removeItem("temp_data");
    toast.error("GD Hoàn trả bị từ chối ");
  } else if (status === "10") {
    localStorage.removeItem("temp_data");
    toast.error("Đã giao hàng");
  } else if (status === "11") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch bị hủy");
  } else if (status === "20") {
    localStorage.removeItem("temp_data");
    toast.error("Giao dịch đã được thanh quyết toán cho merchant ");
  }
  return false;
};