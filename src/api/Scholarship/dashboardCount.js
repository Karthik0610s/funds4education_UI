import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";


export const fetchDashboardCountsReq = async () => {
  try {
    const url = `${ApiKey.DashboardCount}/counts`;
    const res = await publicAxios.get(url);

    return {
      error: false,
      data: res.data?.data || res.data || {},
      errorMsg: "",
    };
  } catch (err) {
    return {
      error: true,
      data: {},
      errorMsg:
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to fetch dashboard counts",
    };
  }
};