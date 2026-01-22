import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  fetchInstitutionListReq,
  fetchCollegeTypesReq,
  fetchDistrictsReq,
  fetchLocationsReq,
  fetchManagementsReq,
  fetchCollegeReq,
  fetchStatesReq
} from "../../../api/InstitutionSignup/Institutionlist";

const institutionListSlice = createSlice({
  name: "institutionList",

  initialState: {
    loading: false,
    error: false,
    institutions: [],
    totalCount: 0,
    states: [],
    districts: [],
    locations: [],
    collegeTypes: [],
    managements: [],
  },

  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = false;
    },

    setInstitutions(state, action) {
      const payload = action.payload;
      state.loading = false;
      state.error = false;
      state.institutions = payload.data || [];
      state.totalCount = payload.totalRecords || 0;
    },

    setError(state) {
      state.loading = false;
      state.error = true;
    },

    setStates(state, action) { state.states = action.payload || []; },
    setDistricts(state, action) { state.districts = action.payload || []; },
    setLocations(state, action) { state.locations = action.payload || []; },
    setCollegeTypes(state, action) { state.collegeTypes = action.payload || []; },
    setCollege(state, action) { state.college = action.payload || []; },
    setManagements(state, action) { state.managements = action.payload || []; },
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
  setCollege,
  setManagements,
} = institutionListSlice.actions;

export default institutionListSlice.reducer;

/* ===== THUNKS ===== */

export const fetchInstitutionList = (params) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchInstitutionListReq(params);

    if (!res.error) {
      dispatch(setInstitutions(res));
    } else {
      dispatch(setError());
     /* Swal.fire("Error", res.errorMsg, "error");*/
    }
  } catch {
    dispatch(setError());
   /* Swal.fire("Error", "Something went wrong.", "error"); */
  }
};

export const fetchStates = () => async (dispatch) => {
  const res = await fetchStatesReq();
  if (!res.error) dispatch(setStates(res.data));
};

export const fetchDistricts = (stateId) => async (dispatch) => {
  const res = await fetchDistrictsReq(stateId);
  if (!res.error) dispatch(setDistricts(res.data));
};

export const fetchLocations = () => async (dispatch) => {
  const res = await fetchLocationsReq();
  if (!res.error) dispatch(setLocations(res.data));
};

export const fetchCollegeTypes = () => async (dispatch) => {
  const res = await fetchCollegeTypesReq();
  if (!res.error) dispatch(setCollegeTypes(res.data));
};
export const fetchCollege = () => async (dispatch) => {
  const res = await fetchCollegeReq();
  if (!res.error) dispatch(setCollege(res.data));
};

export const fetchManagements = () => async (dispatch) => {
  const res = await fetchManagementsReq();
  if (!res.error) dispatch(setManagements(res.data));
};
