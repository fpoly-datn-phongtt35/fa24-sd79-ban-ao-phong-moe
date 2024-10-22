import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";

export const fetchAllProducts = async (
  pageNo,
  pageSize,
  keyword,
  status,
  category,
  brand,
  material,
  origin
) => {
  let uri = "/client?";
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
  if (category) {
    queryParams.push(`category=${category}`);
  }
  if (brand) {
    queryParams.push(`brand=${brand}`);
  }
  if (material) {
    queryParams.push(`material=${material}`);
  }
  if (origin) {
    queryParams.push(`origin=${origin}`);
  }

  uri += queryParams.join("&");

  return await authorizedAxiosInstance
    .get(`${API_ROOT}${uri}`)
    .then((res) => res.data);
};
