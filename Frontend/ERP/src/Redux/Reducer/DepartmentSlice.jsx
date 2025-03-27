import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = '/api/v1/department';

// Async actions
export const fetchDepartments = createAsyncThunk('department/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data; // Assuming the API wraps the data in `data`
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createDepartment = createAsyncThunk('department/create', async (department, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, department);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateDepartment = createAsyncThunk('department/update', async ({ id, department }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, department);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteDepartment = createAsyncThunk('department/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle create, update, and delete similarly
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload._id);
      });
  },
});

export const departmentReducer =  departmentSlice.reducer;
