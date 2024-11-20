import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

//ham lay thong tin du lieu tu bang hoa don 
export const getBillList = async (pageNo, pageSize, keyword, status) => {
    let uri = "bill/billList?";
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
    if (status !== null && status !== undefined) {
        queryParams.push(`status=${status}`);
    }
    uri += queryParams.join("&");

    return await authorizedAxiosInstance
        .get(`${API_ROOT}/${uri}`)
        .then((res) => res.data);
};

//lay du lieu hien thi len theo id hoa don
export const getBillEdit = async (id) => {
    return await authorizedAxiosInstance
        .get(`${API_ROOT}/bill/billEdit/${id}`)
        .then((res) => res.data)
};

//lay phieu giam gia tot nhat
export const fetchAllCouponCustomerGood = async (
    customerId,
    pageNo = 1,
    keyword = '',
    pageSize = 5,
    subtotal = null,
) => {
    const uri = `/coupon/getAllCouponCustomerGood/${customerId}`;
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
    if (subtotal !== null) {
        params.append('subtotal', subtotal);
    }

    return await authorizedAxiosInstance
        .get(`${API_ROOT}${uri}?${params.toString()}`)
        .then((res) => res.data)
        .catch((error) => {
            console.error("Error fetching coupon data:", error);
            throw error;
        });
};

export const getAllStatuses = async () => {
    try {
        const response = await authorizedAxiosInstance.get(`${API_ROOT}/bill/status`);
        return response.data;
    } catch (error) {
        console.error("Error fetching statuses:", error);
        throw error;
    }
};

export const addBillStatusDetail = async (requestData) => {
    const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/bill/addBillStatusDetail`,
        requestData
    );

    if (response.data) {
        return response.data;
    }
};

export const addBillStatusDetailV2 = async (requestData) => {
    const response = await authorizedAxiosInstance.post(
        `${API_ROOT}/bill/addBillStatusDetailV2`,
        requestData
    );

    if (response.data) {
        return response.data;
    }
};

export const getBillStatusDetailsByBillId = async (id) => {
    try {
        const response = await authorizedAxiosInstance.get(`${API_ROOT}/bill/billStatusDetails/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching bill status details:", error);
        toast.error("Failed to fetch bill status details.");
        throw error;
    }
};

export const deleteBillList = async (id) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/bill/deleteBillList/${id}`);
    toast.success(response.data.message);
    return response.data;
};

export const getPreviousBillStatusId = async (billId, page = 0, size = 1) => {
    try {
        const { data } = await authorizedAxiosInstance.get(
            `${API_ROOT}/bill/previousStatus/${billId}`,
            { params: { page, size } } 
        );

        return data;
    } catch (error) {
        console.error("Error fetching previous bill status:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch the previous bill status.";
        toast.error(errorMessage);
        throw error;
    }
};

