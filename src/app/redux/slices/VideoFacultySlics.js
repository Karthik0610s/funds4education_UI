import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  fetchAllVideoContentReq,
  uploadVideoReq,
  deleteVideoContentReq,
  fetchFacultyUserProfileReq,
  insertFacultyUserReq,
  updateFacultyUserReq
} from "../../../api/VideoFaculty/VideoFaculty";

const videoContentSlice = createSlice({
  name: "videoContent",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addVideos: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const { setLoading, addVideos, setError } =
  videoContentSlice.actions;

export default videoContentSlice.reducer;
export const fetchAllVideoContent = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await fetchAllVideoContentReq();
    dispatch(addVideos(res.data));
  } catch (error) {
    dispatch(setError());
    console.log(error);
  }
};
export const uploadVideoContent = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await uploadVideoReq(formData);

    // 🔄 Refresh video list after upload
    await dispatch(fetchAllVideoContent());

    Swal.fire({
      text: res.message || "Video uploaded successfully!",
      icon: "success",
    });

    return res.data;
  } catch (error) {
    dispatch(setError());
    Swal.fire({
      text: error.errorMsg || "Upload failed",
      icon: "error",
    });
    throw error;
  }
};
export const deleteFacultyVideo = (videoId, dispatch) => async (dispatch) => {
  try {
    dispatch(setLoading());
    await deleteVideoContentReq(videoId); // API delete call

    // Fetch updated list after deletion
    await dispatch(fetchAllVideoContent());

    Swal.fire("Deleted!", "Video has been deleted.", "success");
  } catch (error) {
    dispatch(setError());
    Swal.fire("Error!", "Could not delete video. Try again.", "error");
    throw error;
  }
};

