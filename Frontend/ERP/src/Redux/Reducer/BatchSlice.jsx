import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addBatch = createAsyncThunk('batches/addBatch', async (batchData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/v1/academics/addBatch', batchData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message);
  }
});

const batchSlice = createSlice({
  name: 'batches',
  initialState: {
    addBatchLoading: false,
    addBatchError: null,
    addBatchSuccess: false,
    data: [],
  },
  reducers: {
    resetBatchState: (state) => {
      state.addBatchLoading = false;
      state.addBatchError = null;
      state.addBatchSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBatch.pending, (state) => {
        state.addBatchLoading = true;
        state.addBatchError = null;
        state.addBatchSuccess = false;
      })
      .addCase(addBatch.fulfilled, (state, action) => {
        state.addBatchLoading = false;
        state.addBatchSuccess = true;
        state.data.push(action.payload);
      })
      .addCase(addBatch.rejected, (state, action) => {
        state.addBatchLoading = false;
        state.addBatchError = action.payload || 'Something went wrong';
      });
  }
});

export const { resetBatchState } = batchSlice.actions;
export default batchSlice.reducer;
