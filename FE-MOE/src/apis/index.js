import axios from "axios";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

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
