// studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for uploading student details
export const uploadStudentDetails = createAsyncThunk(
  'student/uploadStudentDetails',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/students', studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for importing students from CSV
export const importStudentsFromCSV = createAsyncThunk(
  'student/importStudentsFromCSV',
  async (csvFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const response = await axios.post('/api/v1/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadStudentDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadStudentDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students.push(action.payload);
      })
      .addCase(uploadStudentDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(importStudentsFromCSV.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(importStudentsFromCSV.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(importStudentsFromCSV.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
