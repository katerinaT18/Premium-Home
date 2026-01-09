import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import propertiesReducer from './slices/propertiesSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import rootSaga from './sagas/rootSaga';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    filters: filtersReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
    }).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);
