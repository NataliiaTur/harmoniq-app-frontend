import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, logoutThunk, refreshThunk, registerThunk } from './authOperations';

const initialState = {
  user: null,
  refreshToken: null,
  accessToken: null,
  isLoggedIn: false,
  isRefreshing: false,
  isError: false,
  isPending: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.refreshToken = null;
      state.accessToken = null;
      state.isLoggedIn = false;
      state.isRefreshing = false;
      state.isError = false;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        const { accessToken, refreshToken, ...userData } = action.payload;

        state.user = userData;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        state.isPending = false;
      })
      .addCase(registerThunk.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      .addCase(loginThunk.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        // ⭐ ВИПРАВТЕ: не зберігайте весь payload в user
        const { accessToken, refreshToken, ...userData } = action.payload;
        
        state.user = userData;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        state.isPending = false;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      .addCase(logoutThunk.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.refreshToken = null;
        state.accessToken = null;
        state.isLoggedIn = false;
        state.isPending = false;
        state.isError = false;
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      .addCase(refreshThunk.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.accessToken = action.payload.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshThunk.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        state.user = null;
        state.refreshToken = null;
        state.accessToken = null;
      });
  },
});

export const authReducer = slice.reducer;
