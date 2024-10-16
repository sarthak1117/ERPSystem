// paymentSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPaymentStatus = createAsyncThunk(
    'payments/fetchPaymentStatus',
    async ({ staffId, month, year }, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/api/payments`, {
          params: { staffId, month, year },
        });
        return response.data;
      } catch (error) {
        // Handle errors from the server or network
        return rejectWithValue(error.response?.data || 'Failed to fetch payment status');
      }
    }
  );

  export const proceedToPayment = createAsyncThunk(
    'payments/proceedToPayment',
    async (paymentData, { rejectWithValue }) => {
      try {
        console.log(paymentData)
        const response = await axios.post('/api/v1/payroll/proceedToPayment', paymentData, {
          headers: {
            'Content-Type': 'application/json',
            // Include your authentication headers if needed
            // 'Authorization': Bearer ${token}
          }
        });
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );

const initialState = {
  payments: [],
  loading: false,
  error: null,
  payment: null,
    status: 'idle',
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(proceedToPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(proceedToPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payment = action.payload;
      })
      .addCase(proceedToPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

53



  // src/features/payments/paymentsSlice.js



const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    payment: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Define your synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(proceedToPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(proceedToPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payment = action.payload;
      })
      .addCase(proceedToPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default paymentsSlice.reducer;
