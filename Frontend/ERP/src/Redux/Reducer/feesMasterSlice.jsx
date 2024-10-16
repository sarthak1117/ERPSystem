import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a FeesMaster
export const createFeesMaster = createAsyncThunk(
    'feesMaster/createFeesMaster',
    async (feesMasterData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/feesMaster', feesMasterData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for fetching FeesMasters (you can add more thunks for other operations)
export const fetchFeesMasters = createAsyncThunk(
    'feesMaster/fetchFeesMasters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/feesMaster');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
  feesTypes: [],
  loading: false,
  error: null,
  success: false,
};

// Create async thunks for fetching and adding fees types
export const fetchFeesTypes = createAsyncThunk(
  'feesTypes/fetchFeesTypes',
  async () => {
    const response = await axios.get('/api/fees-types');
    return response.data.data;
  }
);

export const addFeesType = createAsyncThunk(
  'feesTypes/addFeesType',
  async (feesTypeData) => {
    const response = await axios.post('/api/fees-types', feesTypeData);
    return response.data.data;
  }
);

// Create the slice
const feesTypesSlice = createSlice({
  name: 'feesTypes',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeesTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.feesTypes = action.payload;
      })
      .addCase(fetchFeesTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addFeesType.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(addFeesType.fulfilled, (state, action) => {
        state.loading = false;
        state.feesTypes.push(action.payload);
        state.success = true;
      })
      .addCase(addFeesType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetSuccess } = feesTypesSlice.actions;
export default feesTypesSlice.reducer;


const feesMasterSlice = createSlice({
    name: 'feesMaster',
    initialState: {
        feesMasters: [],
        loading: false,
        error: null,
    },
    reducers: {
        // You can define more synchronous actions here if needed
    },
    extraReducers: (builder) => {
        // Handle createFeesMaster lifecycle
        builder
            .addCase(createFeesMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFeesMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.feesMasters.push(action.payload);
            })
            .addCase(createFeesMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle fetchFeesMasters lifecycle
        builder
            .addCase(fetchFeesMasters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeesMasters.fulfilled, (state, action) => {
                state.loading = false;
                state.feesMasters = action.payload;
            })
            .addCase(fetchFeesMasters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions if you have defined any
// export const { someAction } = feesMasterSlice.actions;

export default feesMasterSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    feeDetails: [],
    feesTypes: [],
    feesGroups: [],
    feesMasters: [],
    loading: false,
    error: null
};

// Fetch fee details for a student
export const fetchStudentFeeDetails = createAsyncThunk(
    'fees/fetchStudentFeeDetails',
    async (studentId) => {
        const response = await axios.get(`/api/fees/student/${studentId}`);
        return response.data.data;
    }
);

// Create a fee payment
export const createFeePayment = createAsyncThunk(
    'fees/createFeePayment',
    async (feeData) => {
        const response = await axios.post('/api/fees/createFeePayment', feeData);
        return response.data.data;
    }
);

// Update a fee payment
export const updateFeePayment = createAsyncThunk(
    'fees/updateFeePayment',
    async ({ feeId, paymentData }) => {
        const response = await axios.put(`/api/fees/updateFeePayment/${feeId}`, paymentData);
        return response.data.data;
    }
);

// Create a fees type
export const createFeesType = createAsyncThunk(
    'fees/createFeesType',
    async (feesTypeData) => {
        const response = await axios.post('/api/fees/createFeesType', feesTypeData);
        return response.data.data;
    }
);

// Create a fees group
export const createFeesGroup = createAsyncThunk(
    'fees/createFeesGroup',
    async (feesGroupData) => {
        const response = await axios.post('/api/fees/createFeesGroup', feesGroupData);
        return response.data.data;
    }
);

// Create a fees master
export const createFeesMaster = createAsyncThunk(
    'fees/createFeesMaster',
    async (feesMasterData) => {
        const response = await axios.post('/api/fees/createFeesMaster', feesMasterData);
        return response.data.data;
    }
);

const feeSlice = createSlice({
    name: 'fees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentFeeDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentFeeDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.feeDetails = action.payload;
                state.error = null;
            })
            .addCase(fetchStudentFeeDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createFeePayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFeePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.feeDetails.push(action.payload);
                state.error = null;
            })
            .addCase(createFeePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateFeePayment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateFeePayment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.feeDetails.findIndex(fee => fee._id === action.payload._id);
                if (index !== -1) {
                    state.feeDetails[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateFeePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createFeesType.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFeesType.fulfilled, (state, action) => {
                state.loading = false;
                state.feesTypes.push(action.payload);
                state.error = null;
            })
            .addCase(createFeesType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createFeesGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFeesGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.feesGroups.push(action.payload);
                state.error = null;
            })
            .addCase(createFeesGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createFeesMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(createFeesMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.feesMasters.push(action.payload);
                state.error = null;
            })
            .addCase(createFeesMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default feeSlice.reducer;

