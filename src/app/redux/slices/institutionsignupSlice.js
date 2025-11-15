import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewInstitutionSignupReq,
  deleteInstitutionSignupReq,
  fetchInstitutionSignupListReq,
  updateInstitutionSignupReq,
} from "../../../api/InstitutionSignup/InstitutionSignup";

const InstitutionSignupSlice = createSlice({
  name: "InstitutionSignupList",
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

export const { setLoading, addData, setError } = InstitutionSignupSlice.actions;

// ✅ export only the reducer
export default InstitutionSignupSlice.reducer;

// Action to add a new InstitutionSignup
export const addNewInstitutionSignup = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
  const res=  await addNewInstitutionSignupReq(data); // Call API to add a InstitutionSignup

    // Fetch updated list of InstitutionSignups after adding a new one
    await dispatch(fetchInstitutionSignupList());

    // Optionally show success notification
    /*Swal.fire({
      text: "InstitutionSignup added successfully!",
      icon: "success",
    });*/
    return res;
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Throw the error to be handled elsewhere
  }
};

// Action to update a InstitutionSignup
export const updateInstitutionSignup = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateInstitutionSignupReq(data); // Call API to update InstitutionSignup

    // Fetch updated list of InstitutionSignups after updating
    await dispatch(fetchInstitutionSignupList());

   /* Swal.fire({
      text: "InstitutionSignup updated successfully!",
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

// Action to delete a InstitutionSignup
export const deleteInstitutionSignup = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteInstitutionSignupReq(data); // Call API to delete a InstitutionSignup

    // Fetch updated list of InstitutionSignups after deleting
    await dispatch(fetchInstitutionSignupList());

    Swal.fire({
      text: "InstitutionSignup deleted successfully!",
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

// Action to fetch the InstitutionSignup list
export const fetchInstitutionSignupList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchInstitutionSignupListReq(); // Fetch InstitutionSignup list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load InstitutionSignups",
      icon: "error",
    });
  }
};
