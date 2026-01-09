import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";

//
// ✅ 1️⃣ Fetch scholarships by sponsor userId + role
//
export const fetchScholarshipBySponsorReq = async (userId, role) => {
  try {
    if (!userId || !role) {
      return {
        error: true,
        data: [],
        message: "",
        errorMsg: "Invalid userId or role",
      };
    }

    const url = `${ApiKey.SponsorScholarship}?id=${userId}&role=${role}`;
    const res = await publicAxios.get(url);

    const _data = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    const errorMsg = err.response
      ? err.response.data.detail ||
        err.response.data.message ||
        "Response error"
      : err.request
      ? "Request error"
      : "Something went wrong, please try again later";

    return { error: true, data: [], message: "", errorMsg };
  }
};

//
// ✅ 2️⃣ Add new scholarship
//
export const addScholarshipReq = async (data) => {
  try {
    
    const res = await publicAxios.post(ApiKey.SponsorScholarship, data);
    return { error: false, data: res.data, message: "Added successfully" };
  } catch (err) {
  

  const errorMsg = err.response?.data?.message
    || err.response?.data?.detail
    || (typeof err.response?.data === "string" ? err.response.data : null)
    || err.message
    || "Something went wrong, please try again later";

  return {
    error: true,
    data: [],
    message: errorMsg,  // ✅ show actual message from backend
  };
}
};

//
// ✅ 3️⃣ Update scholarship
//
export const updateScholarshipReq = async (data) => {
  try {
    const res = await publicAxios.put(ApiKey.SponsorScholarship, data);
    return { error: false, data: res.data, message: "Updated successfully" };
  } catch (err) {
  

  const errorMsg = err.response?.data?.message
    || err.response?.data?.detail
    || (typeof err.response?.data === "string" ? err.response.data : null)
    || err.message
    || "Something went wrong, please try again later";

  return {
    error: true,
    data: [],
    message: errorMsg,  // ✅ show actual message from backend
  };
}
};

//
// ✅ 4️⃣ Delete scholarship
//
export const deleteScholarshipReq = async (id, modifiedBy) => {
  try {
    debugger;
    const url = `${ApiKey.SponsorScholarship}/${id}?modifiedBy=${modifiedBy}`;
    const res = await publicAxios.delete(url);

    return {
      error: false,
      data: res.data,
      message: "Deleted successfully"
    };
  } catch (err) {
    console.log("DELETE ERROR:", err.response); // 🔴 keep for debug

    let errorMsg = "Something went wrong, please try again later";

    if (err.response) {
      // 🔥 MOST IMPORTANT FIX
      if (typeof err.response.data === "string") {
        errorMsg = err.response.data;
      } else if (err.response.data?.message) {
        errorMsg = err.response.data.message;
      } else {
        errorMsg = "Response error";
      }
    } else if (err.request) {
      errorMsg = "Request error";
    }

    return {
      error: true,
      data: [],
      message: "",
      errorMsg
    };
  }
};
export const fetchReligionsReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Religion);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    return { error: true, data: [], errorMsg: err.response?.data?.message || "Error fetching religions" };
  }
};
export const fetchCountriesReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Country);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    return { error: true, data: [], errorMsg: err.response?.data?.message || "Error fetching countries" };
  }
};

//
// ✅ State
//
export const fetchStatesReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.State);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    return { error: true, data: [], errorMsg: err.response?.data?.message || "Error fetching states" };
  }
};

//
// ✅ Gender
//
export const fetchGendersReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Gender);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    return { error: true, data: [], errorMsg: err.response?.data?.message || "Error fetching genders" };
  }
};

//
// ✅ Class
//
export const fetchClassesReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Class);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    return { error: true, data: [], errorMsg: err.response?.data?.message || "Error fetching classes" };
  }
};

//
// ✅ Course by class
//
export const fetchCoursesByClassReq = async (classId) => {
  try {
    console.log("Fetching course list for classId:", classId);
    const res = await publicAxios.get(`${ApiKey.CourseByClass}/by-classid?classId=${classId}`);
    console.log("API Response:", res.data);
    return { error: false, data: Array.isArray(res.data) ? res.data : [] };
  } catch (err) {
    console.log("API Error:", err);
    return {
      error: true,
      data: [],
      errorMsg: err.response?.data?.message || "Error fetching courses",
    };
  }
};