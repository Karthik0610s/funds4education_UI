import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  fetchScholarshipListReq,
  fetchScholarshipByStatusReq,
  fetchScholarshipByIdReq,
  fetchFeaturedScholarshipsReq,
  fetchCoursesByClassIdReq,
  fetchDropdownDataReq, // ✅ added import
  //fetchScholarshipByStatusReq,   // ✅ existing API (live/upcoming)
  //fetchScholarshipByIdReq,        // ✅ existing API (by ID)
  //fetchFeaturedScholarshipsReq, 
  fetchApplicationsBySponsorReq,
  updateApplicationStatusReq   // ✅ NEW API for featured
} from "../../../api/Scholarship/Scholarship";

const scholarshipSlice = createSlice({
  name: "scholarship",
  initialState: {
  loading: false,
  error: false,
  courses: [],
  courseLoading: false,
  data: {
    live: [],
    upcoming: [],
    featured: [],
    applications: [],
  },
  dropdownData: {
    countries: [],
    states: [],
    genders: [],
    religions: [],
    classList: [],
  },
  selectedScholarship: null,
},

  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = false;
    },
    /*addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;

      // ✅ Merge live/upcoming with existing featured
      state.data = {
        ...state.data,
        live: Array.isArray(payload.live) ? payload.live : state.data.live,
        upcoming: Array.isArray(payload.upcoming)
          ? payload.upcoming
          : state.data.upcoming,
      };*/
    addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;

      // Preserve all existing arrays while only replacing live/upcoming
      if (payload.live) state.data.live = payload.live;
      if (payload.upcoming) state.data.upcoming = payload.upcoming;
    },

    addFeatured: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data.featured = Array.isArray(payload) ? payload : [];
    },
    addSponsorScholarship: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data.sponsor = Array.isArray(payload) ? payload : [];
    },
    setDropdownData: (state, { payload }) => {   // ✅ added reducer
      state.loading = false;
      state.error = false;
      state.dropdownData = payload;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
    setSelectedScholarship: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.selectedScholarship = payload;
    },
    clearSelectedScholarship: (state) => {
      state.selectedScholarship = null;
    },
    setApplications: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data.applications = Array.isArray(payload) ? payload : [];
    },setCourses: (state, { payload }) => {
  state.courseLoading = false;
  state.courses = Array.isArray(payload) ? payload : [];
},
setCourseLoading: (state) => {
  state.courseLoading = true;
},
clearCourses: (state) => {
  state.courses = [];
},
    updateApplicationStatusInState: (state, { payload }) => {
      const { applicationId, status, modifiedBy } = payload;

      const index = state.data.applications.findIndex(
        (app) => app.applicationId === applicationId
      );

      if (index !== -1) {
        state.data.applications[index] = {
          ...state.data.applications[index],
          status,
          modifiedBy,
        };
      }
    },
  },
});
export const {
  setLoading,
  addData,
  addFeatured,
  addSponsorScholarship,
  setDropdownData,
  setError,
  setSelectedScholarship,
  clearSelectedScholarship,
  setApplications,
  updateApplicationStatusInState,
  setCourses,          // 👈 ADD
  setCourseLoading,    // 👈 ADD
  clearCourses,        // 👈 ADD
} = scholarshipSlice.actions;


export default scholarshipSlice.reducer;

//
// ✅ Fetch both “live” and “upcoming” scholarships
//
export const fetchScholarshipList =
  (filters = { statusType: "live" }) =>
    async (dispatch, getState) => {
      try {
        
        dispatch(setLoading());

        const currentData =
          getState().scholarship?.data || { live: [], upcoming: [], featured: [] };

        // 🟩 Case 1: If "both" is requested (fetch parallel)
        if (filters.statusType === "both") {
          const [liveRes, upcomingRes] = await Promise.all([
            fetchScholarshipByStatusReq({ ...filters, statusType: "live" }),
            fetchScholarshipByStatusReq({ ...filters, statusType: "upcoming" }),
          ]);

          const liveList = !liveRes.error ? liveRes.data : [];
          const upcomingList = !upcomingRes.error ? upcomingRes.data : [];

          dispatch(addData({ live: liveList, upcoming: upcomingList }));
          return;
        }

        // 🟦 Case 2: Normal single-status call
        const res = await fetchScholarshipByStatusReq(filters);
        
        const list = !res.error && Array.isArray(res.data) ? res.data : [];

        if (filters.statusType === "live") {
          
          dispatch(addData({ live: list, upcoming: currentData.upcoming }));
        } else if (filters.statusType === "upcoming") {
          dispatch(addData({ live: currentData.live, upcoming: list }));
        } else {
          // fallback — treat as live
          dispatch(addData({ live: list, upcoming: currentData.upcoming }));
        }
      } catch (error) {
        dispatch(setError());
        console.log(error);
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: error?.message || "Something went wrong while fetching scholarships.",
        // });
      }
    };

//
// ✅ Fetch featured scholarships (green tag + right sidebar)
//
export const fetchFeaturedScholarships = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await fetchFeaturedScholarshipsReq();

    if (!res.error && Array.isArray(res.data)) {
      dispatch(addFeatured(res.data));
    } else {
      dispatch(setError());
      console.log(res.errorMsg);
      // Swal.fire({
      //   icon: "info",
      //   title: "No Featured Scholarships",
      //   text: res.errorMsg || "No featured scholarships found.",
      //   timer: 1800,
      // });
    }
  } catch (error) {
    dispatch(setError());
    console.log(error);
    // Swal.fire({
    //   icon: "error",
    //   title: "Error",
    //   text:
    //     error?.errorMsg ||
    //     error?.message ||
    //     "Something went wrong while fetching featured scholarships.",
    // });
  }
};

//
// ✅ Fetch single scholarship by ID
//
export const fetchScholarshipById = (id) => async (dispatch) => {
  try {
    if (!id) {
      Swal.fire({
        icon: "warning",
        title: "Missing ID",
        text: "Scholarship ID is required to fetch details.",
      });
      return;
    }

    dispatch(setLoading());
    const res = await fetchScholarshipByIdReq(id);

    if (!res.error) {
      dispatch(setSelectedScholarship(res.data));
    } else {
      dispatch(setError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.errorMsg || "Failed to load scholarship details.",
      });
    }
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.errorMsg ||
        error?.message ||
        "Something went wrong while fetching scholarship details.",
    });
  }
};
//
// ✅ Fetch applications by sponsor
//
export const fetchApplicationsBySponsor =
  (sponsorId, status = "") =>
    async (dispatch) => {
      try {
        if (!sponsorId) {
          Swal.fire({
            icon: "warning",
            title: "Missing Sponsor ID",
            text: "Sponsor ID is required to fetch applications.",
          });
          return;
        }
        dispatch(setLoading());

        const res = await fetchApplicationsBySponsorReq(sponsorId, status);

        if (!res.error) {
          dispatch(setApplications(res.data));
        } else {
          dispatch(setError());
          Swal.fire({
            icon: "error",
            title: "Error Loading Applications",
            text: res.errorMsg || "Unable to fetch student applications at this time.",
          });
        }
      } catch (error) {
        dispatch(setError());
        Swal.fire({
          icon: "error",
          title: "Error Fetching Applications",
          text:
            error?.errorMsg ||
            error?.message ||
            "Something went wrong while fetching student applications.",
        });
      }
    };

//
// ✅ 4️⃣ Fetch dropdown data
//
export const fetchDropdownData = () => async (dispatch) => {
  try {
    
    dispatch(setLoading());
    const res = await fetchDropdownDataReq();

    if (!res.error) {
      const { countries, states, genders, religions, classList, courses } = res.data;

      // Normalize data (handles both API naming differences)
      const normalized = {
        countries: countries.map((c) => ({
          id: c.id ?? c.country_ID,
          name: c.country_Name ?? c.name,
        })),
        states: states.map((s) => ({
          id: s.id ?? s.state_ID,
          name: s.state_Name ?? s.name,
        })),
        genders: genders.map((g) => ({
          id: g.gender_ID ?? g.id,
          name: g.gender_Name ?? g.name,
        })),
        religions: religions.map((r) => ({
          id: r.id ?? r.religion_ID,
          name: r.religion_Name ?? r.name,
        })),
        classList: classList.map((cl) => ({
          id: cl.id ?? cl.classId,
          name: cl.className ?? cl.name,
        })),
          courses: [], // EMPTY INITIALLY
      };

      dispatch(setDropdownData(normalized));
      return { error: false, data: normalized };
    } else {
      dispatch(setError());
      return res;
    }
  } catch (error) {
    dispatch(setError());
    return { error: true, data: {}, errorMsg: error.message };
  }
};

export const fetchCoursesByClassId =
  (classId) =>
  async (dispatch) => {
    try {
      if (!classId) {
        dispatch(clearCourses());
        return;
      }

      dispatch(setCourseLoading());

      const courses = await fetchCoursesByClassIdReq(classId);

      dispatch(setCourses(courses));
    } catch (error) {
      dispatch(clearCourses());
      console.error("Failed to fetch courses", error);
    }
  };


export const updateApplicationStatus =
  (applicationId, status, modifiedBy , fundAmount) =>
    async (dispatch) => {
      try {
        dispatch(setLoading());
        const res = await updateApplicationStatusReq(
          applicationId,
          status,
          modifiedBy,
          fundAmount
        );

        if (!res.error) {
          dispatch(
            updateApplicationStatusInState({
              applicationId,
              status,
              modifiedBy,
              fundAmount,
            })
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Status updated successfully",
            timer: 1500,
          });
        } else {
          dispatch(setError());
          Swal.fire({
            icon: "error",
            title: "Error",
            text: res.errorMsg,
          });
        }
      } catch (err) {
        dispatch(setError());
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "Failed to update application status",
        });
      }
    };
