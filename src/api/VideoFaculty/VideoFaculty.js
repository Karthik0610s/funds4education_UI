import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";

/* ================= FETCH ALL VIDEOS ================= */
export const fetchAllVideoContentReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.VideoContent); 
    // ex: /api/video-content

    return {
      error: false,
      data: res.data,
      message: "",
      errorMsg: "",
    };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";

    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

/* ================= UPLOAD VIDEO ================= */
export const uploadVideoReq = async (formData) => {
  try {
    const res = await publicAxios.post(
      ApiKey.uploadVideoContent,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return {
      error: false,
      data: res.data,
      message: res.data?.Message || "Video uploaded successfully",
      errorMsg: "",
    };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data?.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong";

    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
/* ================= DELETE VIDEO ================= */
export const deleteVideoContentReq = async (id) => {
  try {
    const res = await publicAxios.delete(
      `${ApiKey.DeleteVideoContent}/${id}`
    );

    return {
      error: false,
      data: res.data,
      message: res.data?.message || "Video deleted successfully",
      errorMsg: "",
    };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data?.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong";

    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
