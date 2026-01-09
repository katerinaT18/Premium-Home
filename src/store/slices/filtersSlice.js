import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  propertyType: 'all', // all, apartment, villa, office, land
  transactionType: 'all', // all, sale, rent
  city: 'all',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'all',
  apartmentType: 'all', // all, 1+1, 2+1, 3+1
  sortBy: 'newest', // newest, price-low, price-high
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    setTransactionType: (state, action) => {
      state.transactionType = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setBedrooms: (state, action) => {
      state.bedrooms = action.payload;
    },
    setApartmentType: (state, action) => {
      state.apartmentType = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setPropertyType,
  setTransactionType,
  setCity,
  setMinPrice,
  setMaxPrice,
  setBedrooms,
  setApartmentType,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
