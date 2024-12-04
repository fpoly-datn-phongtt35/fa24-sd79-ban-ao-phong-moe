// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import axios from "axios";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { toast } from "react-toastify";

export const handleLogoutAPI = async () => {
  await axios.post(
    `${API_ROOT}/auth/remove`,
    {},
    {
      headers: {
        AUTHORIZATION: localStorage.getItem("accessToken"),
      },
    }
  );
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshTokenAPI = async (refreshToken) => {
  return await axios.post(
    `${API_ROOT}/auth/refresh`,
    {},
    {
      headers: {
        AUTHORIZATION_REFRESH_TOKEN: `${refreshToken}`,
      },
    }
  );
};

export const accessUserAPI = async (role) => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/auth/user?role=${role}`)
    .then((res) => {
      if (res?.status === 200) {
        return res.data.data;
      }
    });
};

export const reqPay = async (data, uri) => {
  await authorizedAxiosInstance
    .get(`${API_ROOT}/payment/vn-pay?amount=${data.total}&bankCode=NCB${uri}`)
    .then((res) => {
      if (res.status === 200) {
        window.location.href = res.data.data;
      }
    });
};

export const validInfo = async (email, username) => {
  return await axios
    .get(`${API_ROOT}/auth/valid-info/${email}/${username}`)
    .then((res) => {
      return res.data;
    });
};

export const register = async (data) => {
  return await axios.post(`${API_ROOT}/auth/register`, data);
};

export const sentOtp = async (email) => {
  return await axios
    .post(`${API_ROOT}/auth/sent-otp/${encodeURIComponent(email)}`)
    .then((res) => {
      return res.data;
    });
};

export const verifyOtp = async (data) => {
  return await axios
    .post(`${API_ROOT}/auth/verify-otp`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

export const requestForgotPassword = async (email) => {
  return await axios
    .get(`${API_ROOT}/auth/forgot-password/${encodeURIComponent(email)}`)
    .then((res) => {
      return res.data;
    });
};
export const changePassword = async (data) => {
  return await axios
    .post(`${API_ROOT}/auth/change-password`, data)
    .then((res) => {
      return res.data;
    });
};
