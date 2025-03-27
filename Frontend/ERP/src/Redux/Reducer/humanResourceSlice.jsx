import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for adding new staff with file uploads
export const submitStaffDetails = createAsyncThunk(
  "humanResource/submitStaffDetails",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/staff/newStaff", staffData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // Success response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Create slice
const humanResourceSlice = createSlice({
  name: "humanResource",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitStaffDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitStaffDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitStaffDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const humanResourceReducer = humanResourceSlice.reducer;
