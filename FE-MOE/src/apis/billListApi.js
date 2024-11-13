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

export const getBillEdit = async (id) => {
    return await authorizedAxiosInstance
      .get(`${API_ROOT}/bill/billEdit/${id}`)
      .then((res) => res.data)
  };