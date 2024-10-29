import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

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
