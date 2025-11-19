import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewScholarshipApplicationReq,
  deleteScholarshipApplicationReq,
  fetchScholarshipApplicationListReq,
  fetchScholarshipApplicationListbyStudentReq,
  updateScholarshipApplicationReq,
} from "../../../api/scholarshipapplication/scholarshipapplication";

const scholarshipApplicationSlice = createSlice({
  name: "scholarshipApplicationList",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addData: (state, { payload }) => {
      debugger;
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const { setLoading, addData, setError } = scholarshipApplicationSlice.actions;

// ✅ export only the reducer
export default scholarshipApplicationSlice.reducer;

// Action to add a new scholarshipApplication
export const addNewScholarshipApplication = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
  const res=  await addNewScholarshipApplicationReq(data); // Call API to add a scholarshipApplication

    // Fetch updated list of scholarshipApplications after adding a new one
    await dispatch(fetchScholarshipApplicationList());

    // Optionally show success notification
    /*Swal.fire({
      text: "ScholarshipApplication added successfully!",
      icon: "success",
    });*/
    return res.data;
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Throw the error to be handled elsewhere
  }
};

// Action to update a scholarshipApplication
export const updateScholarshipApplication = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateScholarshipApplicationReq(data); // Call API to update scholarshipApplication

    // Fetch updated list of scholarshipApplications after updating
    await dispatch(fetchScholarshipApplicationList());

   /* Swal.fire({
      text: "ScholarshipApplication updated successfully!",
      icon: "success",
    });*/
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Handle or throw the error to be handled elsewhere
  }
};

// Action to delete a scholarshipApplication
export const deleteScholarshipApplication = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteScholarshipApplicationReq(data); // Call API to delete a scholarshipApplication

    // Fetch updated list of scholarshipApplications after deleting
    await dispatch(fetchScholarshipApplicationList());

    Swal.fire({
      text: "ScholarshipApplication deleted successfully!",
      icon: "success",
    });
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Handle or throw the error to be handled elsewhere
  }
};

// Action to fetch the scholarshipApplication list
export const fetchScholarshipApplicationList = (studentId) => async (dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchScholarshipApplicationListReq(studentId); // Fetch scholarshipApplication list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load scholarshipApplications",
      icon: "error",
    });
  }
};
export const fetchScholarshipApplicationListbyStudent = (studentId) => async (dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchScholarshipApplicationListbyStudentReq(studentId); // Fetch scholarshipApplication list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load scholarshipApplications",
      icon: "error",
    });
  }
};
