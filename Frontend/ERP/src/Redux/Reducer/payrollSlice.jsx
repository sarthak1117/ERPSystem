import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const createPayroll = createAsyncThunk(
    'payroll/create',
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axios.post('/api/payroll', payload);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue({ message: 'An error occurred' });
        }
      }
    }
  );





const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    payroll: null,
    staffDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Add any synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.payroll = action.payload.payroll;
        state.staffDetails = action.payload.staffDetails;
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export default payrollSlice.reducer;
