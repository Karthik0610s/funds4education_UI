import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardCountsReq } from "../../../api/Scholarship/dashboardCount";
import Swal from "sweetalert2";

const dashboardCountSlice = createSlice({
  name: "dashboardCounts",

  initialState: {
    loading: false,
    error: false,
    sponsorCount: 0,
    studentCount: 0,
    activeScholarshipCount: 0,
  },

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },

    setCounts: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.sponsorCount = payload.sponsorCount ?? 0;
      state.studentCount = payload.studentCount ?? 0;
      state.activeScholarshipCount = payload.activeScholarshipCount ?? 0;
    },

    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { setLoading, setCounts, setError } = dashboardCountSlice.actions;
export default dashboardCountSlice.reducer;


// ✅ Async thunk (same coding style like ScholarhipSlice)
export const fetchDashboardCounts = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await fetchDashboardCountsReq(); // API call

    if (!res.error) {
      dispatch(setCounts(res.data));
    } else {
      dispatch(setError());
     /* Swal.fire({
        icon: "error",
        title: "Error",
        text: res.errorMsg || "Failed to load dashboard counts.",
      });*/
      console.log();

    }
  } catch (err) {
    dispatch(setError());
   /* Swal.fire({
      icon: "error",
      title: "Error",
      text:
        err?.errorMsg ||
        err?.message ||
        "Something went wrong while fetching dashboard counts.",
    });*/
    console.log(err);
  }
};