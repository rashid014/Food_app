// authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
