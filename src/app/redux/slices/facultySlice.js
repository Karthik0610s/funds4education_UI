import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  insertFacultyUserReq, // POST → signup new user
  updateFacultyUserReq, // PUT/PATCH → update user profile
  fetchFacultyUserProfileReq, // GET → fetch profile details
} from "../../../api/faculty/faculty"; // ✅ adjust path as per your API folder

// Slice
const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    loading: false,
    error: false,
    profile: null, // store logged-in user profile
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    setProfile: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.profile = payload;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { setLoading, setProfile, setError } = facultySlice.actions;
export default facultySlice.reducer;

// ✅ Action to insert (faculty)
// ✅ Action to insert (faculty)
export const insertFacultyNewUser = (data, navigate) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await insertFacultyUserReq(data);

    dispatch(setProfile(res.data)); // store user if API returns it

    /*await Swal.fire({
      text: res.message || "faculty successful!",
      icon: "success",
      confirmButtonText: "OK",
    });*/
  return res.data.id; 
    // ⭐ Navigate AFTER user clicks OK
  //  navigate("/login"); 
  } catch (error) {
    dispatch(setError());

    Swal.fire({
      text: error.message || "faculty failed. Try again!",
      icon: "error",
    });
  }
};



// ✅ Action to update user profile//
export const updateFacultyUserProfile = (data) => async (dispatch) => {
  try {
    debugger;
    dispatch(setLoading());
    await updateFacultyUserReq(data);

    // After update, fetch updated profile
    const res = await fetchFacultyUserProfileReq(data.facultyId); // use userId
    dispatch(setProfile(res.data));

    /*Swal.fire({
      text: "Profile updated successfully!",
      icon: "success",
    });*/
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: "Profile update failed!",
      icon: "error",
    });
    throw error;
  }
};

// ✅ Action to fetch profile after login
export const fetchFacultyUserProfile = (idOrEmail) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchFacultyUserProfileReq(idOrEmail);
    dispatch(setProfile(res.data));
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: "Failed to load profile",
      icon: "error",
    });
  }
};
