import axios from "axios";
import { toast } from "react-toastify";
import { handleLogoutAPI, refreshTokenAPI } from "~/apis";

let authorizedAxiosInstance = axios.create();

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    const access_token = localStorage.getItem("accessToken");
    // if (access_token) {
    //   console.log(config);
      
    //   config.headers.Authorization = `Bearer ${access_token}`;
    // }

    config.headers.Authorization = !config._retry && access_token ? `Bearer ${access_token}` : config.headers.Authorization;

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log(error);

    if (error?.response?.status === 401) {
      handleLogoutAPI().then(() => {
        location.href = "/login";
      });
    }

    const originalRequest = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      return refreshTokenAPI(refreshToken)
        .then((res) => {

          const access_token = res.data.data.accessToken
          
          localStorage.setItem("accessToken", access_token);
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${access_token}`;

          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

          return authorizedAxiosInstance(originalRequest);
        })
        .catch((_error) => {
          console.log(_error);
          
          handleLogoutAPI().then(() => {
            location.href = "/login";
          });

          return Promise.reject(_error);
        });
    }

    if (error?.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
