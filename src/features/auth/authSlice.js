import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsync = createAsyncThunk("auth/signin", async payload => {
  const response = await axios.post(`/auth/signin`, payload);
  return response.data;
});

export const logoutAsync = createAsyncThunk("auth/signout", async payload => {
  const response = await axios.post(`/auth/signout`, payload);
  return response.data;
});

export const checkAuthStatusAsync = createAsyncThunk("auth/status", async () => {
  const response = await axios.get(`/auth/status`);
  return response.data;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    error: null,
    isAuthenticated: false,
    currentUser: null,
    loginModalShowing: false,
    activeAuthForm: "signIn", // or "resetPassword", "signUp"
    redirectOnCloseTo: null
  },
  reducers: {
    clearErrors: state => {
      state.error = null;
    },
    setLoginModalState: (state, action) => {
      if (undefined !== action.payload.loginModalShowing) {
        state.loginModalShowing = action.payload.loginModalShowing;
      }
      if (action.payload.activeAuthForm) {
        state.activeAuthForm = action.payload.activeAuthForm;
      }
      if (action.payload.redirectOnCloseTo) {
        state.redirectOnCloseTo = action.payload.redirectOnCloseTo;
      } else {
        state.redirectOnCloseTo = null;
      }
    }
  },
  extraReducers: {
    [loginAsync.pending]: state => {
      state.loading = true;
    },
    [loginAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      if (!action.payload.id) {
        state.error = "Wrong username or password";
      } else {
        state.error = null;
        state.currentUser = action.payload;
      }
    },
    [loginAsync.rejected]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = "Invalid credentials";
    },
    [logoutAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    [checkAuthStatusAsync.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.currentUser = action.payload.currentUser;
    }
  }
});
export const { clearErrors, setLoginModalState } = authSlice.actions;
export default authSlice.reducer;
