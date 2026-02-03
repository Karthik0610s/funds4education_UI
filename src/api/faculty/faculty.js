import { publicAxios,authAxios } from "../config";
import { ApiKey } from "../endpoint";
// ✅ Signup (insert new user)//
export const insertFacultyUserReq = async (data) => {
  try {
    
    const res = await publicAxios.post(`${ApiKey.Faculty}`, data);
    return { error: false, data: res.data, message: res.data.message || "Signup successful", errorMsg: "" };
  } catch (err) {
  let errorMsg = "Something went wrong, please try again later";

  if (err.response) {
    const { status, data } = err.response;
    console.error("API Error Response:", data);

    // ✅ SQL duplicate username case (TOP priority)
    if (
      status === 500 &&
      data?.detail?.includes("Username already exists")
    ) {
      errorMsg = "Username already exists. Please choose another one.";
    }
    // ✅ Validation errors
    else if (data?.errors) {
      errorMsg = Object.values(data.errors).flat().join(", ");
    }
    // ✅ Normal API message
    else if (data?.message) {
      errorMsg = data.message;
    }
    // ✅ Fallback response error
    else {
      errorMsg = "Response error";
    }
  } 
  else if (err.request) {
    errorMsg = "Request error (server unreachable)";
  }

  throw new Error(errorMsg);
}
};


// ✅ Update user profile
export const updateFacultyUserReq = async (data) => {
  try {
    
    const res = await publicAxios.put(`${ApiKey.Faculty}`, data); // 🔐 secure with authAxios

    const msg = res.data?.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg || "", errorMsg: "" };
  } catch (err) {
  let errorMsg = "Something went wrong, please try again later";

  if (err.response) {
    const { status, data } = err.response;
    console.error("API Error Response:", data);

    // ✅ SQL duplicate username case (TOP priority)
    if (
      status === 500 &&
      data?.detail?.includes("Username already exists")
    ) {
      errorMsg = "Username already exists. Please choose another one.";
    }
    // ✅ Validation errors
    else if (data?.errors) {
      errorMsg = Object.values(data.errors).flat().join(", ");
    }
    // ✅ Normal API message
    else if (data?.message) {
      errorMsg = data.message;
    }
    // ✅ Fallback response error
    else {
      errorMsg = "Response error";
    }
  } 
  else if (err.request) {
    errorMsg = "Request error (server unreachable)";
  }

  throw new Error(errorMsg);
}
};

// ✅ Fetch user profile (after login or for profile page)
export const fetchFacultyUserProfileReq = async (idOrEmail) => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.Faculty}/${idOrEmail}`);

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