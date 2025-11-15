import { publicAxios } from "../config";
import { ApiKey } from "../endpoint"; // make sure ApiKey has SponsorLogin endpoint

export const sponsorLoginReq = async (credentials) => {
  try {
    // call sponsor login endpoint
    const res = await publicAxios.post(`${ApiKey.SponsorLogin}`, credentials);

    const msg = res.data?.message || "Login successful";
    const _data = res.data;

    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";

    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
