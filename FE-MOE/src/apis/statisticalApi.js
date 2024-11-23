import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

const BASE_URL = `${API_ROOT}/statistical`;

// Helper function for handling API requests
const fetchData = async (endpoint, params, errorMessage) => {
  try {
    const response = await authorizedAxiosInstance.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    toast.error(errorMessage || "Đã xảy ra lỗi. Vui lòng thử lại.");
    throw error.response?.data || error.message || "Unknown error";
  }
};

const statisticalAPI = {
  // Fetch total revenue
  getTotalRevenue: (filter) => {
    return fetchData(
      `${BASE_URL}/revenue`,
      filter,
      "Không thể lấy tổng doanh thu. Vui lòng thử lại."
    );
  },

  // Fetch total number of bills
  getTotalBills: (filter) => {
    return fetchData(
      `${BASE_URL}/bills`,
      filter,
      "Không thể lấy số lượng hóa đơn. Vui lòng thử lại."
    );
  },

  // Fetch total shipping cost
  getTotalShippingCost: (filter) => {
    return fetchData(
      `${BASE_URL}/shipping-cost`,
      filter,
      "Không thể lấy tổng phí vận chuyển. Vui lòng thử lại."
    );
  },

  // Fetch total number of products sold
  getTotalProductsSold: (filter) => {
    return fetchData(
      `${BASE_URL}/products-sold`,
      filter,
      "Không thể lấy tổng số sản phẩm đã bán. Vui lòng thử lại."
    );
  },

  // Fetch total discount amount
  getTotalDiscountAmount: (filter) => {
    return fetchData(
      `${BASE_URL}/discount-amount`,
      filter,
      "Không thể lấy tổng số tiền giảm giá. Vui lòng thử lại."
    );
  },

  // Fetch total product amount
  getTotalProductAmount: (filter) => {
    return fetchData(
      `${BASE_URL}/product-amount`,
      filter,
      "Không thể lấy tổng số tiền sản phẩm. Vui lòng thử lại."
    );
  },

  // Fetch summary statistics
  getSummaryStatistics: (filter) => {
    return fetchData(
      `${BASE_URL}/summary`,
      filter,
      "Không thể lấy dữ liệu thống kê tổng hợp. Vui lòng thử lại."
    );
  },

  // Fetch top-selling products
  getTopSellingProducts: (filter, limit) => {
    const params = { ...filter, limit };
    return fetchData(
      `${BASE_URL}/top-selling-products`,
      params,
      "Không thể lấy danh sách sản phẩm bán chạy. Vui lòng thử lại."
    );
  },

  getCustomerRegistrations: (filter) => {
    return fetchData(
      `${BASE_URL}/total-bill-status`,
      filter,
      "Không thể lấy trạng thái hóa đơn. Vui lòng thử lại"
    );
  },

  // Fetch customer registrations
  getCustomerRegistrations: (filter) => {
    return fetchData(
      `${BASE_URL}/customer-registrations`,
      filter,
      "Không thể lấy số lượng khách hàng đăng ký. Vui lòng thử lại."
    );
  },
};

export default statisticalAPI;
