import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";
import { fetchAllCountry } from "./countryApi";
import { fetchAllCategories } from "./categoriesApi";
import { fetchAllBrands } from "./brandsApi";
import { fetchAllMaterials } from "./materialApi";
import { fetchAllColors } from "./colorApi";
import { fetchAllSizes } from "./sizesApi";

export const fetchAllProducts = async (pageNo, keyword, status) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/product?pageNo=${pageNo}&keyword=${keyword}&status=${status}`)
    .then((res) => res.data);
};

export const postProduct = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/product`, data)
    .then((res) => {
      return res.data.data;
    });
};

export const postProductImage = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/product/upload`, data)
    .then((res) => {
      return res.data.data;
    });
};

export const attributeProducts = async () => {
  return {
    origin: await fetchAllCountry(),
    brands: await fetchAllBrands().then(res => res.data),
    categories: await fetchAllCategories().then(res => res.data),
    materials: await fetchAllMaterials().then(res => res.data),
    colors: await fetchAllColors().then(res => res.data),
    sizes: await fetchAllSizes().then(res => res.data)
  };
};
