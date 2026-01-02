import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";
export const fetchInstitutionListReq = async (params) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await publicAxios.get(`${ApiKey.CollegeDetails}/filtered?${query}`);

    return {
      error: false,
      page: res.data.page,
      pageSize: res.data.pageSize,
      totalRecords: res.data.totalRecords,
      data: res.data.data || [],
    };
  } catch (err) {
    return {
      error: true,
      data: [],
      page: 1,
      pageSize: 0,
      totalRecords: 0,
      errorMsg: err.response?.data?.message || "Unable to fetch institution list",
    };
  }
};


export const fetchStatesReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.States);
    return { error: false, data: res.data || [] };
  } catch (err) {
    return { error: true, data: [] };
  }
};

// DISTRICTS (BY STATE)
export const fetchDistrictsReq = async (state) => {
  try {
    const res = await publicAxios.get(
      `${ApiKey.Districts}?state=${state}`
    );
    return { error: false, data: res.data || [] };
  } catch {
    return { error: true, data: [] };
  }
};

// LOCATIONS (Rural / Urban)
export const fetchLocationsReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.LocationDetails);
    return { error: false, data: res.data || [] };
  } catch {
    return { error: true, data: [] };
  }
};

// COLLEGE TYPES
export const fetchCollegeTypesReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Collegetype);
    return { error: false, data: res.data || [] };
  } catch {
    return { error: true, data: [] };
  }
};

// MANAGEMENT TYPES
export const fetchManagementsReq = async () => {
  try {
    const res = await publicAxios.get(ApiKey.Managements);
    return { error: false, data: res.data || [] };
  } catch {
    return { error: true, data: [] };
  }
};
