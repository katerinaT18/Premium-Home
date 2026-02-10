import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // light, dark
  language: 'sq', // en, sq (Albanian is default)
  isMenuOpen: false,
  isSearchModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu: (state) => {
      state.isMenuOpen = false;
    },
    toggleSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    closeSearchModal: (state) => {
      state.isSearchModalOpen = false;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleMenu,
  closeMenu,
  toggleSearchModal,
  closeSearchModal,
} = uiSlice.actions;

export default uiSlice.reducer;
