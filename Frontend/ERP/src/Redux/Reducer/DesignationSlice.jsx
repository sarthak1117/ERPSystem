import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = '/api/v1/designation';

// Async actions
export const fetchDesignations = createAsyncThunk('designation/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data; // Assuming the API wraps the data in `data`
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createDesignation = createAsyncThunk('designation/create', async (designation, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, designation);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateDesignation = createAsyncThunk('designation/update', async ({ id, designation }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, designation);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteDesignation = createAsyncThunk('designation/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const designationSlice = createSlice({
  name: 'designation',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle create, update, and delete similarly
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.data.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload._id);
      });
  },
});

export const designationReducer = designationSlice.reducer;
