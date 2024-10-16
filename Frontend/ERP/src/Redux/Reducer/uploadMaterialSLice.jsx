import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadMaterial = createAsyncThunk(
  'upload/uploadMaterial',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: {
    [uploadMaterial.pending]: (state) => {
      state.loading = true;
    },
    [uploadMaterial.fulfilled]: (state) => {
      state.loading = false;
      state.success = true;
    },
    [uploadMaterial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { resetUploadState } = uploadSlice.actions;

export default uploadSlice.reducer;
