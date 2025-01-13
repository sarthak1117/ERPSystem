import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // local storage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import {  thunk } from 'redux-thunk';

// Import your reducers
// import userReducer from './reducers/UserSlice';
// import courseReducer from './reducers/CourseSlice';
// import batchReducer from './reducers/BatchSlice';
// import studentReducer from './reducers/StudentSlice';
// import courseBatchReducer from './reducers/CourseBatchSlice';
import authReducer from './Reducer/AuthenticationSlice'
import { incomeHeadReducer } from './Reducer/IncomeHeadslice';
import { incomeReducer } from './Reducer/IncomeSlice';
import {Designation} from '../pages/DepartmentAndDesignation/Designation';
import {Department} from '../pages/DepartmentAndDesignation/Department';

// // Combine reducers
const rootReducer = combineReducers({
  // user: userReducer,
  // courses: courseReducer,
  // batches: batchReducer,
  // studentData: studentReducer,
  // courseBatch: courseBatchReducer,
    auth: authReducer,
    incomeHead: incomeHeadReducer,
    income: incomeReducer,
    department: DeparmentReducer,
    designation: DesignationReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // List of reducers to persist (optional)
};

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk), // Adding thunk middleware if you need async logic
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
