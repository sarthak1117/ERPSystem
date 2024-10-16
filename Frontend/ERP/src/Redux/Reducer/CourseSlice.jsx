import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to add a course
export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/academics/addCourse", courseData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch courses
export const fetchCourses = createAsyncThunk(
  "modifiedCourses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/academics/course");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to fetch batches by course
export const fetchBatchesByCourse = createAsyncThunk(
  "courses/fetchBatchesByCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/academics/course/${courseId}/batches`);
      return response.data.data; // Assuming the batches are under `data.data`
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue({ message: "No batches available" });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    addCourseLoading: false,
    addCourseError: null,
    addCourseSuccess: false,
    data: [],
    modifiedCourse: [],
    batchesByCourse: [],
    fetchCoursesLoading: false,
    fetchCoursesError: null,
    fetchBatchesLoading: false,
    fetchBatchesError: null,
  },
  reducers: {
    resetCourseState: (state) => {
      state.addCourseLoading = false;
      state.addCourseError = null;
      state.addCourseSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addCourse
      .addCase(addCourse.pending, (state) => {
        state.addCourseLoading = true;
        state.addCourseError = null;
        state.addCourseSuccess = false;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.addCourseLoading = false;
        state.addCourseSuccess = true;
        state.data.push(action.payload); // Ensure immutability by pushing the new course
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.addCourseLoading = false;
        state.addCourseError = action.payload || "Something went wrong";
      })

      // Handle fetchCourses
      .addCase(fetchCourses.pending, (state) => {
        state.fetchCoursesLoading = true;
        state.fetchCoursesError = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.fetchCoursesLoading = false;
        state.modifiedCourse = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.fetchCoursesLoading = false;
        state.fetchCoursesError = action.payload || "Failed to fetch courses";
      })

      // Handle fetchBatchesByCourse
      .addCase(fetchBatchesByCourse.pending, (state) => {
        state.fetchBatchesLoading = true;
        state.fetchBatchesError = null;
      })
      .addCase(fetchBatchesByCourse.fulfilled, (state, action) => {
        state.fetchBatchesLoading = false;
        state.batchesByCourse = action.payload;
      })
      .addCase(fetchBatchesByCourse.rejected, (state, action) => {
        state.fetchBatchesLoading = false;
        state.batchesByCourse = [];
        state.fetchBatchesError = action.payload || "Failed to fetch batches";
      });
  },
});

export const { resetCourseState } = courseSlice.actions;
export default courseSlice.reducer;
