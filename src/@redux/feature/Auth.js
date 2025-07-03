import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  baseurl: process.env.VITE_apiurl,
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  userDetails: null,
  kycDetails: null,
  type: "individual",
  loginEmail: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setOnboarded: (state, action) => {
      state.isOnboarded = action.payload;
    },

    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },

    setKycDetails: (state, action) => {
      state.kycDetails = action.payload;
    },

    setType: (state, action) => {
      state.type = action.payload;
    },

    setLoginEmail: (state, action) => {
      state.loginEmail = action.payload;
    },

    resetAuthStates: () => initialState,
  },
});

export const {
  setUser,
  setAuthenticated,
  setOnboarded,
  setUserDetails,
  setKycDetails,
  resetAuthStates,
  setType,
  setLoginEmail,
} = authSlice.actions;

export default authSlice.reducer;
