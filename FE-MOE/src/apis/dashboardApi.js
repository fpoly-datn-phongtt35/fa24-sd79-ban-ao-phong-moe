import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

export const statisticData = async () => {
  return await authorizedAxiosInstance
    .get(`${API_ROOT}/statistic`)
    .then((res) => {
      return res.data.data;
    });
};
