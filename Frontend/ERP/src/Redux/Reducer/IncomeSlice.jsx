import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Endpoint
const BASE_URL = '/api/v1/income';

// Async Thunks
export const fetchIncomes = createAsyncThunk(
  'income/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createIncome = createAsyncThunk(
    'income/create',
    async (data, { rejectWithValue }) => {
      try {
        const formData = new FormData();
        
        // Append each field to FormData
        for (const key in data) {
          if (data[key] instanceof FileList) {
            // Handle multiple files (FileList)
            Array.from(data[key]).forEach((file) => {
              formData.append(key, file);
            });
          } else {
            formData.append(key, data[key]);
          }
        }
  
        const response = await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );

export const updateIncome = createAsyncThunk(
  'income/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/delete',
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
const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createIncome.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // Update
      .addCase(updateIncome.fulfilled, (state, action) => {
        const index = state.data.findIndex((income) => income._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })

      // Delete
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.data = state.data.filter((income) => income._id !== action.payload._id);
      });
  },
});

export const incomeReducer = incomeSlice.reducer;

