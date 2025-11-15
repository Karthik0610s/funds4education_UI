import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  insertUserReq, // POST → signup new user
  updateUserReq, // PUT/PATCH → update user profile
  fetchUserProfileReq, // GET → fetch profile details
} from "../../../api/Signup/signup"; // ✅ adjust path as per your API folder

// Slice
const signupSlice = createSlice({
  name: "signup",
  initialState: {
    loading: false,
    error: false,
    user: null, // store logged-in user profile
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    setUser: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.user = payload;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { setLoading, setUser, setError } = signupSlice.actions;
export default signupSlice.reducer;

// ✅ Action to insert (signup)
export const insertNewUser = (data) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await insertUserReq(data);

    dispatch(setUser(res.data)); // store user if API returns it

    Swal.fire({
      text: res.message || "Signup successful!",
      icon: "success",
   
    });
    
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: error.message || "Signup failed. Try again!",
      icon: "error",
    });
  }
};


// ✅ Action to update user profile//
export const updateUserProfile = (data) => async (dispatch) => {
  try {
    dispatch(setLoading());
    await updateUserReq(data);

    // After update, fetch updated profile
    const res = await fetchUserProfileReq(data.id); // use userId
    dispatch(setUser(res.data));

    Swal.fire({
      text: "Profile updated successfully!",
      icon: "success",
    });
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
export const fetchUserProfile = (idOrEmail) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchUserProfileReq(idOrEmail);
    dispatch(setUser(res.data));
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: "Failed to load profile",
      icon: "error",
    });
  }
};
