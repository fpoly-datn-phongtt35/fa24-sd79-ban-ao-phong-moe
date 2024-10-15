import { API_ROOT } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { toast } from "react-toastify";
import { fetchAllCountry } from "./countryApi";
import { fetchAllCategories } from "./categoriesApi";
import { fetchAllBrands } from "./brandsApi";
import { fetchAllMaterials } from "./materialApi";
import { fetchAllColors } from "./colorApi";
import { fetchAllSizes } from "./sizesApi";

export const fetchAllProducts = async (
  pageNo,
  keyword,
  status,
  category,
  brand,
  material,
  origin
) => {
  let uri = "/product?";
  let queryParams = [];

  if (pageNo !== null && pageNo !== undefined) {
    queryParams.push(`pageNo=${pageNo}`);
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

export const fetchProduct = async (id) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/product/${id}`)
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

export const moveToBin = async (id) => {
  return await authorizedAxiosInstance
    .patch(`${API_ROOT}/product/move-to-bin/${id}`)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const changeStatus = async (id, status) => {
  return await authorizedAxiosInstance.patch(
    `${API_ROOT}/product/change-status/${id}/${status}`
  );
};

export const attributeProducts = async () => {
  return {
    origin: await fetchAllCountry(),
    brands: await fetchAllBrands().then((res) => res.data),
    categories: await fetchAllCategories().then((res) => res.data),
    materials: await fetchAllMaterials().then((res) => res.data),
    colors: await fetchAllColors().then((res) => res.data),
    sizes: await fetchAllSizes().then((res) => res.data),
  };
};

export const updateProduct = async (data, id) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/product/update-product/${id}`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const changeStatusProductDetail = async (id, status) => {
  return await authorizedAxiosInstance.patch(
    `${API_ROOT}/product/change-status/product-detail/${id}/${status}`
  );
};

export const updateProductDetailAttribute = async (data) => {
  return await authorizedAxiosInstance
    .put(`${API_ROOT}/product/update-product-details/attribute`, data)
    .then((res) => {
      toast.success(res.data.message);
    });
};

export const storeProductDetailAttribute = async (data) => {
  return await authorizedAxiosInstance
    .post(`${API_ROOT}/product/store-product-detail/attribute`, data)
    .then((res) => {
      toast.success(res?.data?.message);
    });
};
