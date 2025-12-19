import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  fetchScholarshipBySponsorReq,
  addScholarshipReq,
  updateScholarshipReq,
  deleteScholarshipReq,
  fetchReligionsReq,
  fetchCountriesReq,
  fetchStatesReq,
  fetchGendersReq,
  fetchClassesReq,
  fetchCoursesByClassReq,
} from "../../../api/Scholarship/SponsorScholarship";


const sponsorScholarshipSlice = createSlice({
  name: "sponsorScholarship",
  initialState: {
    loading: false,
    error: false,
    data: [],
   religions: [],
    countries: [],
    states: [],
    genders: [],
    classes: [],
    courses: [],
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
    setData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = Array.isArray(payload) ? payload : [];
    },
     setReligions: (state, { payload }) => {
      state.religions = Array.isArray(payload) ? payload : [];
    },
    setCountries: (state, { payload }) => {
      state.countries = Array.isArray(payload) ? payload : [];
    },
    setStates: (state, { payload }) => {
      state.states = Array.isArray(payload) ? payload : [];
    },
    setGenders: (state, { payload }) => {
      state.genders = Array.isArray(payload) ? payload : [];
    },
    setClasses: (state, { payload }) => {
      state.classes = Array.isArray(payload) ? payload : [];
    },
    setCourses: (state, { payload }) => {
      state.courses = Array.isArray(payload) ? payload : [];
    },
  },
});

export const { setLoading, setError, setData,setReligions,
  setCountries,
  setStates,
  setGenders,
  setClasses,
  setCourses } =
  sponsorScholarshipSlice.actions;

export default sponsorScholarshipSlice.reducer;

//
// 📘 Fetch scholarships for sponsor
//
export const fetchScholarshipBySponsor = (userId, role) => async (dispatch) => {
  try {
    

    const res = await fetchScholarshipBySponsorReq(userId, role); // Call API

    dispatch(setData(res.data)); // Dispatch the data
  } catch (error) {
    dispatch(setError()); // Dispatch error action
    Swal.fire({
      text: "Failed to load sponsor scholarships",
      icon: "error",
    });
  }
};
//
// 📘 Add new scholarship
//
export const addNewScholarship = async (formData, dispatch) => {
  try {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("roleName");

    const res = await addScholarshipReq(formData);

    // 🟠 Handle backend duplicate or validation error
    if (res.error) {
      Swal.fire({
        text: res.message || "Something went wrong.",
        icon: "warning",
      });
      return { success: false, data: null, message: res.message };
    }

    // 🟢 Success case
    await dispatch(fetchScholarshipBySponsor(userId, role));

    return { success: true, data: res.data };
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    return { success: false, data: null, message: error.message };
  }
};


// ✅ Update scholarship
//
export const updateScholarship = async (formData, dispatch) => {
  try {

   const res= await updateScholarshipReq(formData); // Call API to update scholarship

    // Fetch updated scholarship list after updating
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("roleName");
     // 🟠 Handle backend duplicate or validation error
    if (res.error) {
      Swal.fire({
        text: res.message || "Something went wrong.",
        icon: "warning",
      });
      return { success: false, data: null, message: res.message };
    }
    await dispatch(fetchScholarshipBySponsor(userId, role));

    /*Swal.fire({
      text: "Scholarship updated successfully!",
      icon: "success",
    });*/
    return { success: true, data: res.data };
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Re-throw error if needed elsewhere
  }
};

//
// ✅ Delete scholarship
//
export const deleteScholarship = (id, modifiedBy) => async (dispatch) => {
  try {
   
debugger;
    const response = await deleteScholarshipReq(id, modifiedBy);

    if (response.error) {
      dispatch(setError());
      return Swal.fire("Error", response.errorMsg, "error");
    }

    Swal.fire("Success", "Scholarship deleted successfully!", "success");

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("roleName");

    await dispatch(fetchScholarshipBySponsor(userId, role));
  } catch (err) {
    dispatch(setError());
    Swal.fire("Error", "Error deleting scholarship.", "error");
  }
};
export const fetchReligions = () => async (dispatch) => {
  try {
    
    const res = await fetchReligionsReq();
    dispatch(setReligions(res.data));
  } catch (err) {
    dispatch(setError());
  }
};

export const fetchCountries = () => async (dispatch) => {
  try {
    
    const res = await fetchCountriesReq();
    dispatch(setCountries(res.data));
  } catch (err) {
    dispatch(setError());
  }
};

export const fetchStates = () => async (dispatch) => {
  try {
    
    const res = await fetchStatesReq();
    dispatch(setStates(res.data));
  } catch (err) {
    dispatch(setError());
  }
};

export const fetchGenders = () => async (dispatch) => {
  try {
    
    const res = await fetchGendersReq();
    dispatch(setGenders(res.data));
  } catch (err) {
    dispatch(setError());
  }
};

// ================= Class & Course =================
export const fetchClasses = () => async (dispatch) => {
  try {
    
    const res = await fetchClassesReq();
    dispatch(setClasses(res.data));
  } catch (err) {
    dispatch(setError());
  }
};

// fetch courses by selected class
export const fetchCoursesByClass = (className) => async (dispatch) => {
  try {
    
    const res = await fetchCoursesByClassReq(className);
    dispatch(setCourses(res.data));
  } catch (err) {
    dispatch(setError());
  }
};