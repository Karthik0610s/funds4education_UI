import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoint";

// ✅ Signup (insert new user)//
export const insertUserReq = async (data) => {
  try {
    const res = await publicAxios.post(`${ApiKey.signup}`, data);
    return { error: false, data: res.data, message: res.data.message || "Signup successful", errorMsg: "" };
  } catch (err) {
    let errorMsg;
    if (err.response) {
      console.error("API Error Response:", err.response.data);

      if (err.response.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join(", ");
      } else {
        errorMsg = err.response.data?.message || "Response error";
      }
    } else if (err.request) {
      errorMsg = "Request error (server unreachable)";
    } else {
      errorMsg = "Something went wrong, please try again later";
    }
    throw new Error(errorMsg);
  }
};


// ✅ Update user profile
export const updateUserReq = async (data) => {
  try {
    const res = await authAxios.put(`${ApiKey.signup}`, data); // 🔐 secure with authAxios

    const msg = res.data?.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg || "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong, please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

// ✅ Fetch user profile (after login or for profile page)
export const fetchUserProfileReq = async (idOrEmail) => {
  try {
    const res = await authAxios.get(`${ApiKey.signup}/${idOrEmail}`);

    const _data = res.data;
    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong, please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
