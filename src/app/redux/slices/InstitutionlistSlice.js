import { createSlice } from "@reduxjs/toolkit";
import { fetchInstitutionListReq ,
         fetchCollegeTypesReq,
         fetchDistrictsReq,
         fetchLocationsReq,
         fetchManagementsReq,
         fetchStatesReq

} from "../../../api/InstitutionSignup/Institutionlist";
import Swal from "sweetalert2";

const institutionListSlice = createSlice({
  name: "institutionList",

  initialState: {
    loading: false,
    error: false,
    institutions: [],
     states: [],
  districts: [],
  locations: [],
  collegeTypes: [],
  managements: [],
  },

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },

    setInstitutions: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.institutions = payload || [];
    },

    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
    setStates: (state, { payload }) => {
  state.states = payload || [];
},
setDistricts: (state, { payload }) => {
  state.districts = payload || [];
},
setLocations: (state, { payload }) => {
  state.locations = payload || [];
},
setCollegeTypes: (state, { payload }) => {
  state.collegeTypes = payload || [];
},
setManagements: (state, { payload }) => {
  state.managements = payload || [];
},

  },
});

export const {
  setLoading,
  setInstitutions,
  setError,
  setStates,
  setDistricts,
  setLocations,
  setCollegeTypes,
  setManagements,
} = institutionListSlice.actions;

export default institutionListSlice.reducer;
export const fetchInstitutionList = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await fetchInstitutionListReq(); // API call

    if (!res.error) {
      dispatch(setInstitutions(res.data));
    } else {
      dispatch(setError());

      // Optional alert
      /*
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.errorMsg || "Failed to load institution list.",
      });
      */
      console.log(res.errorMsg);
    }
  } catch (err) {
    dispatch(setError());

    /*
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.errorMsg ||
        err?.message ||
        "Something went wrong while fetching institution list.",
    });
    */
    console.log(err);
  }
};
export const fetchStates = () => async (dispatch) => {
  try {
    const res = await fetchStatesReq();
    if (!res.error) {
      dispatch(setStates(res.data));
    } else {
      Swal.fire("Error", "Failed to load states", "error");
    }
  } catch {
    Swal.fire("Error", "Failed to load states", "error");
  }
};

/* ================= DISTRICTS ================= */
export const fetchDistricts = (stateId) => async (dispatch) => {
  try {
    const res = await fetchDistrictsReq(stateId);
    if (!res.error) {
      dispatch(setDistricts(res.data));
    } else {
      Swal.fire("Error", "Failed to load districts", "error");
    }
  } catch {
    Swal.fire("Error", "Failed to load districts", "error");
  }
};

/* ================= LOCATIONS ================= */
export const fetchLocations = () => async (dispatch) => {
  try {
    const res = await fetchLocationsReq();
    if (!res.error) {
      dispatch(setLocations(res.data));
    } else {
      Swal.fire("Error", "Failed to load locations", "error");
    }
  } catch {
    Swal.fire("Error", "Failed to load locations", "error");
  }
};

/* ================= COLLEGE TYPES ================= */
export const fetchCollegeTypes = () => async (dispatch) => {
  try {
    const res = await fetchCollegeTypesReq();
    if (!res.error) {
      dispatch(setCollegeTypes(res.data));
    } else {
      Swal.fire("Error", "Failed to load college types", "error");
    }
  } catch {
    Swal.fire("Error", "Failed to load college types", "error");
  }
};

/* ================= MANAGEMENTS ================= */
export const fetchManagements = () => async (dispatch) => {
  try {
    const res = await fetchManagementsReq();
    if (!res.error) {
      dispatch(setManagements(res.data));
    } else {
      Swal.fire("Error", "Failed to load managements", "error");
    }
  } catch {
    Swal.fire("Error", "Failed to load managements", "error");
  }
};