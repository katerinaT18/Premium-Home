import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      // Store auth in localStorage with token
      localStorage.setItem('adminAuth', JSON.stringify({
        isAuthenticated: true,
        user: action.payload,
        token: action.payload.token,
      }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('adminAuth');
    },
    checkAuth: (state) => {
      const storedAuth = localStorage.getItem('adminAuth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          if (authData.isAuthenticated && authData.user && authData.token) {
            // Set auth state (token will be verified by saga)
            state.isAuthenticated = true;
            state.user = authData.user;
          } else {
            state.isAuthenticated = false;
            state.user = null;
          }
        } catch (error) {
          localStorage.removeItem('adminAuth');
          state.isAuthenticated = false;
          state.user = null;
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
      }
    },
    setAuthVerified: (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('adminAuth');
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  checkAuth,
  setAuthVerified,
} = authSlice.actions;

export default authSlice.reducer;
