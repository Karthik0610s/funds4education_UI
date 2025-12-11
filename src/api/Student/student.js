import { publicAxios } from "../config";
import { ApiKey } from "../endpoint";

// ✅ Fetch a student profile by ID
export const getStudentProfile = async (id) => {
  
  try {
    const response = await publicAxios.get(`${ApiKey.Student}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching student profile:", error);
    throw error.response?.data || new Error("Failed to fetch student profile");
  }
};

// ✅ Update student profile (PUT)
export const updateStudentProfile = async (data) => {
  try {
    const response = await publicAxios.put(`${ApiKey.Student}`, data);

    // Axios automatically throws on non-2xx, but we’ll double-check:
    if (response.status === 204) {
      return {}; // No content, successful update
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error updating student profile:", error);
    throw error.response?.data || new Error("Failed to update student profile");
  }
};
