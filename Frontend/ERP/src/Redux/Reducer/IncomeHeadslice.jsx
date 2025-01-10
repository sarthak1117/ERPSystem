import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Endpoint
const BASE_URL = '/api/v1/income/heads';

// Async Thunks
export const fetchIncomeHeads = createAsyncThunk(
  'incomeHead/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data.data; // Adjust based on your API response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createIncomeHead = createAsyncThunk(
  'incomeHead/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateIncomeHead = createAsyncThunk(
  'incomeHead/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteIncomeHead = createAsyncThunk(
  'incomeHead/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const incomeHeadSlice = createSlice({
  name: 'incomeHead',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchIncomeHeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomeHeads.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomeHeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createIncomeHead.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update
      .addCase(updateIncomeHead.fulfilled, (state, action) => {
        const index = state.data.findIndex((head) => head._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })

      // Delete
      .addCase(deleteIncomeHead.fulfilled, (state, action) => {
        state.data = state.data.filter((head) => head._id !== action.payload._id);
      });
  },
});

export const incomeHeadReducer = incomeHeadSlice.reducer;
