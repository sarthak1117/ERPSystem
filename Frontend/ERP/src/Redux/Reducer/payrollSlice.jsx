import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createPayroll = createAsyncThunk(
    'payroll/create',
    async (payload, { rejectWithValue }) => {
        try {
            console.log('Payload before sending:', payload);
            const response = await axios.post('/api/v1/payroll/createpayroll', payload);
            console.log('Response data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error response:', error.response);
            return rejectWithValue(error.response?.data || { message: 'An error occurred' });
        }
    }
);

export const fetchPayroll = createAsyncThunk(
    'payroll/fetchPayroll',
    async ({ month, year }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/payroll/getPayroll?month=${month}&year=${year}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'An error occurred' });
        }
    }
);

export const fetchPayrollByStaff = createAsyncThunk(
    'payroll/fetchPayrollByStaff',
    async ({ month, year, staffId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/payroll/getPayrollByStaff?month=${month}&year=${year}&staffId=${staffId}`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'An error occurred' });
        }
    }
);

const payrollSlice = createSlice({
    name: 'payroll',
    initialState: {
        payroll: null,
        payrolls: [],
        payrollByStaff: [],
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
            })
            .addCase(fetchPayroll.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayroll.fulfilled, (state, action) => {
                state.loading = false;
                state.payrolls = action.payload;
            })
            .addCase(fetchPayroll.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPayrollByStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayrollByStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.payrollByStaff = action.payload;
            })
            .addCase(fetchPayrollByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default payrollSlice.reducer;
