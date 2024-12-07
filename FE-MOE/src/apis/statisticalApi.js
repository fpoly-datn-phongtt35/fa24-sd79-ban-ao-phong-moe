import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

export const getBillsWithFilters = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/bills`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching bills");
        throw error; 
    }
};

export const getTotalRevenue = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/revenue`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching total revenue");
        throw error; 
    }
};

export const getMinInvoice = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/min-invoice`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching minimum invoice");
        throw error; 
    }
};

export const getMaxInvoice = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/max-invoice`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching maximum invoice");
        throw error; 
    }
};

export const getAvgInvoice = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/avg-invoice`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching average invoice");
        throw error; 
    }
};

export const getTotalBills = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/total-bills`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching total number of bills");
        throw error; 
    }
};

export const getSuccessfulBills = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/successful-bills`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching successful bills");
        throw error; 
    }
};

// Fetch total failed bills
export const getFailedBills = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/failed-bills`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching failed bills");
        throw error; 
    }
};

// Fetch total unpaid bills
export const getUnpaidBills = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/unpaid-bills`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching unpaid bills");
        throw error; 
    }
};

// Fetch top selling products
export const getTopSellingProducts = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/top-selling-products`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching top selling products");
        throw error; 
    }
};

// Fetch top customers
export const getTopCustomers = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/top-customers`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching top customers");
        throw error; 
    }
};

// Fetch top coupons
export const getTopCoupons = async (filter) => {
    try {
        const response = await authorizedAxiosInstance.post(`${API_ROOT}/statisticalV2/top-coupons`, filter);
        return response.data; 
    } catch (error) {
        toast.error("Error fetching top coupons");
        throw error; 
    }
};