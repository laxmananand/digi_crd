import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countryList: [],
  nationalityList: [],
  mobileCountryCodeList: [],
  feeDetails: [],
  activeTab: "Dashboard",
  globalLoading: false,
  dnsDetails: null,
  headers: null,
  program: null,
  isExpanded: true,
};

export const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setCountryList: (state, action) => {
      state.countryList = action.payload;
    },

    setNationalityList: (state, action) => {
      state.nationalityList = action.payload;
    },

    setMobileCountryCodeList: (state, action) => {
      state.mobileCountryCodeList = action.payload;
    },

    setFeeDetails: (state, action) => {
      state.feeDetails = action.payload;
    },
    resetUtilityStates: () => initialState,

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    setDnsDetails: (state, action) => {
      state.dnsDetails = action.payload;
    },

    setHeaders: (state, action) => {
      state.headers = action.payload;
    },
    setProgram: (state, action) => {
      state.program = action.payload;
    },
    setExpanded: (state, action) => {
      state.isExpanded = action.payload;
    },
  },
});

export const {
  setFeeDetails,
  resetUtilityStates,
  setCountryList,
  setNationalityList,
  setMobileCountryCodeList,
  setActiveTab,
  setGlobalLoading,
  setDnsDetails,
  setHeaders,
  setProgram,
  setExpanded,
} = utilitySlice.actions;

export default utilitySlice.reducer;
