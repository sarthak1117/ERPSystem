import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch issued books where Returned is false
export const fetchIssuedBooks = createAsyncThunk(
  'issueBooks/fetchIssuedBooks',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/library/issued-books/returned-false');
      return response.data.data; // assuming the data is in the "data" field
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const importBooks = createAsyncThunk(
    "library/importBooks",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await axios.post("/api/v1/library/importBooks", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || 'Something went wrong';
        return rejectWithValue(message);
      }
    }
  );

const issueBookSlice = createSlice({
  name: 'issueBooks',
  initialState: {
    issuedBooks: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssuedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssuedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.issuedBooks = action.payload;
      })
      .addCase(fetchIssuedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch issued books';
      });
  },
});

export const selectIssuedBooks = (state) => state.issueBooks.issuedBooks;
export const selectLoading = (state) => state.issueBooks.loading;
export const selectError = (state) => state.issueBooks.error;

export default issueBookSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch books
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/books'); // Replace with the correct API endpoint
    return response.data.data; // Assuming the books data is returned under `data`
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectBooks = (state) => state.books.books;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;

export default booksSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const addLibraryCardNumberStudent = createAsyncThunk(
  "library/addLibraryCardNumberStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/library/addLibraryCardNumberStudent", studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addLibraryCardNumberStaff = createAsyncThunk(
  "library/addLibraryCardNumberStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/library/addLibraryCardNumberStaff", staffData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBook = createAsyncThunk(
  "library/addBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/library/addBook", bookData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const importBooks = createAsyncThunk(
  "library/importBooks",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/library/importBooks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const issueBook = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/library/issueBook", issueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const librarySlice = createSlice({
  name: "library",
  initialState: {
    studentLibraryCard: null,
    staffLibraryCard: null,
    book: null,
    importResult: null,
    issuedBook: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Define any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Add Library Card for Student
      .addCase(addLibraryCardNumberStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLibraryCardNumberStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentLibraryCard = action.payload;
      })
      .addCase(addLibraryCardNumberStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Library Card for Staff
      .addCase(addLibraryCardNumberStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLibraryCardNumberStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffLibraryCard = action.payload;
      })
      .addCase(addLibraryCardNumberStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Import Books
      .addCase(importBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.importResult = action.payload;
      })
      .addCase(importBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Issue Book
      .addCase(issueBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.loading = false;
        state.issuedBook = action.payload;
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunks
export const addLibraryCardNumberStudent = createAsyncThunk(
  "library/addLibraryCardNumberStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/library/student", studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addLibraryCardNumberStaff = createAsyncThunk(
  "library/addLibraryCardNumberStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/library/staff", staffData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBook = createAsyncThunk(
  "library/addBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/library/book", bookData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const importBooks = createAsyncThunk(
  "library/importBooks",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/library/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const issueBook = createAsyncThunk(
  "library/issueBook",
  async (issueData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/library/issue", issueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const librarySlice = createSlice({
  name: "library",
  initialState: {
    studentLibraryCard: null,
    staffLibraryCard: null,
    book: null,
    importResult: null,
    issuedBook: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Define any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Add Library Card for Student
      .addCase(addLibraryCardNumberStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLibraryCardNumberStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentLibraryCard = action.payload;
      })
      .addCase(addLibraryCardNumberStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Library Card for Staff
      .addCase(addLibraryCardNumberStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLibraryCardNumberStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffLibraryCard = action.payload;
      })
      .addCase(addLibraryCardNumberStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Import Books
      .addCase(importBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.importResult = action.payload;
      })
      .addCase(importBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Issue Book
      .addCase(issueBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.loading = false;
        state.issuedBook = action.payload;
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default librarySlice.reducer;
