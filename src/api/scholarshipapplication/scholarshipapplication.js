import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoint";

export const fetchScholarshipApplicationListReq = async () => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.ScholarshipApplication}`);

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
export const fetchScholarshipApplicationListbyStudentReq
 = async (studentId) => {
  try {
    
    const res = await publicAxios.get(`${ApiKey.ScholarshipApplication}/byStudent/${studentId}`);

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
export const fetchScholarshipApplicationByIdReq = async (id) => {
    try {
      
      const res = await publicAxios.get(`${ApiKey.ScholarshipApplication}/${id}`);
  
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
export const addNewScholarshipApplicationReq = async (data) => {
  try {
    
    const res = await publicAxios.post(`${ApiKey.ScholarshipApplication}`, data);

    const msg = res.data.message;
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
export const updateScholarshipApplicationReq = async (data) => {
  try {
    const res = await publicAxios.put(`${ApiKey.ScholarshipApplication}`, data);

    const msg = res.data.message;
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

export const deleteScholarshipApplicationReq = async (actionId) => {
  try {
    const res = await publicAxios.delete(`${ApiKey.ScholarshipApplication}/${actionId}`);

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
export const uploadFormFilesReq = async (formData) => {
  try {
    
    const res = await publicAxios.post(`${ApiKey.uploadScholarshipFiles}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { error: false, data: res.data, message: res.data.message || "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const sendScholarshipEmailReq = async (applicationId) => {
  try {
    
    const res = await publicAxios.post(
      `${ApiKey.SendMail}/${applicationId}`
    );

    return {
      error: false,
      data: res.data,
      message: res.data.message || "Email sent successfully!",
      errorMsg: "",
    };
  } catch (err) {
    let error;

    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong, please try again later";

    throw {
      error: true,
      data: "",
      message: "",
      errorMsg: error,
    };
  }
};

export const uploadVideoReq = async (formData) => {
  try {
    debugger;
     const res = await publicAxios.post(ApiKey.uploadVideoContent,formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return {
      success: true,
      data: res.data,
      message: res.data?.Message || "Video uploaded successfully",
    };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data?.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong";

    throw {
      success: false,
      errorMsg: error,
    };
  }
};