
import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";

//
// ✅ 1️⃣ Fetch scholarships by user ID + role
//
export const fetchScholarshipListReq = async (UserId, role) => {
  try {
   
    if (!UserId || !role) {
      return {
        error: true,
        data: [],
        message: "",
        errorMsg: "Invalid UserId or role",
      };
    }

    const url = `${ApiKey.Scholarship}?id=${UserId}&role=${role}`;
    const res = await publicAxios.get(url);

    const _data = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let errorMsg;
    if (err.response)
      errorMsg =
        err.response.data.detail ||
        err.response.data.message ||
        "Response error";
    else if (err.request) errorMsg = "Request error";
    else
      errorMsg =
        err.errorMsg || "Something went wrong, please try again later";

    return { error: true, data: [], message: "", errorMsg };
  }
};

//
// ✅ 2️⃣ Fetch scholarships by status ("live" / "upcoming")
//
export const fetchScholarshipByStatusReq = async (filters = {}) => {
  try {
    
       const { statusType, filterType } = filters;
    if (!statusType) {
      return { error: true, data: [], message: "", errorMsg: "Invalid StatusType" };
    }

    // ✅ Build params object with correct backend names
    const params = {};
    params.StatusType = statusType;
    params.filterType=filterType;// 🔹 Note: capital S to match backend
      const studentId = localStorage.getItem("userId");
    if (studentId) params.StudentId = studentId;
    const role = localStorage.getItem("roleName");
    if (role) params.Role = role

if (filters.classId?.length) params.Class_ID = filters.classId.join(',');

if (filters.countryId?.length) params.Country_ID = filters.countryId.join(',');
if (filters.courseId?.length) params.Course_ID = filters.courseId.join(',');
if (filters.stateId?.length) params.State_ID = filters.stateId.join(',');
if (filters.religionId?.length) params.Religion_ID = filters.religionId.join(',');
if (filters.genderId?.length) params.Gender_ID = filters.genderId.join(',');



    const url = `${ApiKey.Scholarship}/status`;
    const res = await publicAxios.get(url, { params });

    // Handle API data shape
    const _data = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let errorMsg;
    if (err.response)
      errorMsg = err.response.data?.detail || err.response.data?.message || "Response error";
    else if (err.request) errorMsg = "Request error";
    else errorMsg = err.message || "Something went wrong";

    return { error: true, data: [], message: "", errorMsg };
  }
};

//
// ✅ 3️⃣ Fetch single scholarship by ID
//
export const fetchScholarshipByIdReq = async (id) => {
  try {
    if (!id) {
      return {
        error: true,
        data: [],
        message: "",
        errorMsg: "Invalid Scholarship ID",
      };
    }

    const url = `${ApiKey.Scholarship}/${id}`;
    const res = await publicAxios.get(url);

    const _data = res.data?.data || res.data || {};

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let errorMsg;
    if (err.response)
      errorMsg =
        err.response.data.detail ||
        err.response.data.message ||
        "Response error";
    else if (err.request) errorMsg = "Request error";
    else
      errorMsg =
        err.errorMsg || "Something went wrong, please try again later";

    return { error: true, data: [], message: "", errorMsg };
  }
};

//
// ✅ 4️⃣ Fetch featured scholarships
//
export const fetchFeaturedScholarshipsReq = async () => {
  try {
    const url = `${ApiKey.Scholarship}/featured`;
    const res = await publicAxios.get(url);

    // ✅ Always ensure an array response
    const _data = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let errorMsg;
    if (err.response)
      errorMsg =
        err.response.data.detail ||
        err.response.data.message ||
        "Response error";
    else if (err.request) errorMsg = "Request error";
    else
      errorMsg =
        err.errorMsg || "Something went wrong, please try again later";

    return { error: true, data: [], message: "", errorMsg };
  }
};

export const fetchDropdownDataReq = async () => {
  try {
    
    const [countryRes, stateRes, genderRes, religionRes,classRes,courseRes] = await Promise.all([
      publicAxios.get(ApiKey.Country),
      publicAxios.get(ApiKey.State),
      publicAxios.get(ApiKey.Gender),
      publicAxios.get(ApiKey.Religion),
      publicAxios.get(ApiKey.Class),
      publicAxios.get(ApiKey.GroupCourse),
    ]);

    const countries = Array.isArray(countryRes.data)
      ? countryRes.data
      : countryRes.data?.data || [];

    const states = Array.isArray(stateRes.data)
      ? stateRes.data
      : stateRes.data?.data || [];

    const genders = Array.isArray(genderRes.data)
      ? genderRes.data
      : genderRes.data?.data || [];

    const religions = Array.isArray(religionRes.data)
      ? religionRes.data
      : religionRes.data?.data || [];
    const classList=Array.isArray(classRes.data)
      ? classRes.data
      : classRes.data?.data || [];

       const courses=Array.isArray(courseRes.data)
      ? courseRes.data
      : courseRes.data?.data || [];
      

    return {
      error: false,
      data: { countries, states, genders, religions,classList ,courses},
      message: "",
      errorMsg: "",
    };
  } catch (err) {
    let errorMsg;
    if (err.response)
      errorMsg =
        err.response.data.detail ||
        err.response.data.message ||
        "Response error";
    else if (err.request) errorMsg = "Request error";
    else errorMsg = err.errorMsg || "Something went wrong while fetching dropdown data";

    return { error: true, data: { countries: [], states: [], genders: [], religions: [] ,classList:[],courses:[]}, message: "", errorMsg };
  }
};
export const fetchApplicationsBySponsorReq = async (sponsorId, status = "") => {
  try {
    if (!sponsorId) {
      return {
        error: true,
        data: [],
        message: "",
        errorMsg: "Invalid sponsorId",
      };
    }

    const url = `${ApiKey.ScholarshipApplicationsBySponsor}/${sponsorId}${
      status ? `?status=${status}` : ""
    }`;

    const res = await publicAxios.get(url);

    const _data = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    // 🎯 If API says "no data" or returns 404 → treat it as success with empty array
    const status = err.response?.status;

    if (status === 404) {
      return { error: false, data: [], message: "", errorMsg: "" };
    }

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
// ✅ 5️⃣ Update Application Status (Approve / Reject)

export const updateApplicationStatusReq = async (
  applicationId,
  status,
  modifiedBy,
  fundAmount
) => {
  try {
    if (!applicationId || !status) {
      return {
        error: true,
        data: [],
        message: "",
        errorMsg: "Invalid ApplicationId or Status",
      };
    }

    // ✅ Backend endpoint for updating application status
   const url = `${ApiKey.ApplicationStatus}/Update?applicationId=${applicationId}&status=${status}&modifiedBy=${modifiedBy}&fundAmount=${fundAmount ?? 0}`;
    const res = await publicAxios.put(url);

    const _data = res.data?.data || res.data || {};

    return {
      error: false,
      data: _data,
      message: "Application status updated successfully",
      errorMsg: "",
    };
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
