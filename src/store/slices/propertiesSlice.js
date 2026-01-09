import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  loading: false,
  error: null,
  selectedProperty: null,
};

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Action to trigger saga
    fetchPropertiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Success action dispatched by saga
    fetchPropertiesSuccess: (state, action) => {
      state.loading = false;
      state.properties = action.payload;
      state.error = null;
    },
    // Failure action dispatched by saga
    fetchPropertiesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setProperties: (state, action) => {
      state.properties = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    // Action to trigger saga for creating property
    createPropertyStart: (state) => {
      // Saga will handle the API call
    },
    // Action to trigger saga for updating property
    updatePropertyStart: (state, action) => {
      // Saga will handle the API call
    },
    // Action to trigger saga for deleting property
    deletePropertyStart: (state, action) => {
      // Saga will handle the API call
    },
    // Called after successful API creation/update
    addProperty: (state, action) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index === -1) {
        state.properties.push(action.payload);
      } else {
        state.properties[index] = action.payload;
      }
    },
    // Called after successful API update
    updateProperty: (state, action) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    },
    // Called after successful API delete
    deleteProperty: (state, action) => {
      state.properties = state.properties.filter(p => p.id !== action.payload);
    },
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
  },
});

export const {
  fetchPropertiesStart,
  fetchPropertiesSuccess,
  fetchPropertiesFailure,
  createPropertyStart,
  updatePropertyStart,
  deletePropertyStart,
  setProperties,
  setLoading,
  setError,
  setSelectedProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  clearSelectedProperty,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;
