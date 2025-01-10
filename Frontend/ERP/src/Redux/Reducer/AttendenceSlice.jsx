// src/redux/thunks/attendanceThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/attendance', attendanceData);
      return response.data; // Ensure this returns the correct response from the backend
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
      loading: false,
      error: null,
      success: false,
      data: null,
    },
    reducers: {
      resetAttendanceState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
        state.data = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(markAttendance.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(markAttendance.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.data = action.payload; // Make sure action.payload has the correct data
        })
        .addCase(markAttendance.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { resetAttendanceState } = attendanceSlice.actions;
  export default attendanceSlice.reducer;