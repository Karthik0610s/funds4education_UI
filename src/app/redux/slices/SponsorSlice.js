import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
    addNewSponsorReq,
    deleteSponsorReq,
    fetchSponsorListReq,
    updateSponsorReq,
    fetchSponsorByIdReq
} from "../../../api/Sponsorsignup/Sponsorsignup";

const sponsorSlice = createSlice({
    name: "sponsorList",
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

export const { setLoading, addData, setError } = sponsorSlice.actions;

// ✅ export only the reducer
export default sponsorSlice.reducer;

// Action to add a new sponsor
export const addNewSponsor = async (data, dispatch) => {
    try {
        
        dispatch(setLoading()); // Set loading before making the API request
        const res = await addNewSponsorReq(data); // Call API to add a sponsor

        // Fetch updated list of sponsors after adding a new one
        await dispatch(fetchSponsorList());

        // Optionally show success notification
       /* Swal.fire({
          text: "Sponsor added successfully!",
          icon: "success",
        });*/
        return res.data;
    } catch (error) {
  dispatch(setError());

  Swal.fire({
    text: error.message || "Error! Try Again!",
    icon: "error",
  });

  // Optional: rethrow if needed elsewhere
 // throw error;
}
};

// Action to update a sponsor
export const updateSponsor = async (data, dispatch) => {
    try {
        
        dispatch(setLoading()); // Set loading before making the API request
     const res=   await updateSponsorReq(data); // Call API to update sponsor

        // Fetch updated list of sponsors after updating
        await dispatch(fetchSponsorList());

        /* Swal.fire({
           text: "Sponsor updated successfully!",
           icon: "success",
         });*/
         return res.data;
    } catch (error) {
        dispatch(setError()); // Handle error if API fails
        Swal.fire({
            text: "Error! Try Again!",
            icon: "error",
        });
        throw error; // Handle or throw the error to be handled elsewhere
    }
};

// Action to delete a sponsor
export const deleteSponsor = async (data, dispatch) => {
    try {
        dispatch(setLoading()); // Set loading before making the API request
        await deleteSponsorReq(data); // Call API to delete a sponsor

        // Fetch updated list of sponsors after deleting
        await dispatch(fetchSponsorList());

        Swal.fire({
            text: "Sponsor deleted successfully!",
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

// Action to fetch the sponsor list
export const fetchSponsorList = () => async (dispatch) => {
    try {
        dispatch(setLoading()); // Set loading before making the API request
        const res = await fetchSponsorListReq(); // Fetch sponsor list from API
        dispatch(addData(res.data)); // Dispatch the data to Redux state
    } catch (error) {
        dispatch(setError()); // Handle error if API fails
        Swal.fire({
            text: "Failed to load sponsors",
            icon: "error",
        });
    }
};
export const fetchSponsorById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading());
        const res = await fetchSponsorByIdReq(id);
        dispatch(addData([res.data])); // store as array in Redux (or use a separate 'currentSponsor' state)
        return res.data;
    } catch (error) {
        dispatch(setError());
        throw error;
    }
};