import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoint";

export const fetchSponsorListReq = async () => {
    try {
        
        const res = await publicAxios.get(`${ApiKey.Sponsor}`);

        const _data = res.data;
        return { error: false, data: _data, message: "", errorMsg: "" };
    } catch (err) {
        let error;
        if (err.response) error = err.response.data.message || "Response error";
        else if (err.request) error = "Request error";
        else error = "Something went wrong please try again later";
        throw { error: true, data: "", message: "", errorMsg: error };
    }
};
export const fetchSponsorByIdReq = async (id) => {
    try {
        
        console.log("Fetching sponsor ID:", id);
        console.log("URL:", `${ApiKey.Sponsor}/${id}`);
        const res = await publicAxios.get(`${ApiKey.Sponsor}/${id}`);

        const _data = res.data;
        return { error: false, data: _data, message: "", errorMsg: "" };
    } catch (err) {
        let error;
        if (err.response) error = err.response.data.message || "Response error";
        else if (err.request) error = "Request error";
        else error = "Something went wrong please try again later";
        throw { error: true, data: "", message: "", errorMsg: error };
    }
};
export const addNewSponsorReq = async (data) => {
    try {
        
        const res = await publicAxios.post(`${ApiKey.Sponsor}`, data);

        const msg = res.data.message;
        const _data = res.data;
        return { error: false, data: _data, message: msg, errorMsg: "" };
    }catch (err) {
      debugger;
  let errorMsg = "Something went wrong, please try again later";

  if (err.response) {
    const { status, data } = err.response;
 //   console.error("API Error Response:", data);

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
export const updateSponsorReq = async (data) => {
    try {
        const res = await publicAxios.put(`${ApiKey.Sponsor}`, data);

        const msg = res.data.message;
        const _data = res.data;
        return { error: false, data: _data, message: msg, errorMsg: "" };
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

export const deleteSponsorReq = async (actionId) => {
    try {
        const res = await publicAxios.delete(`${ApiKey.Sponsor}/${actionId}`);

        const msg = res.data?.message;
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
