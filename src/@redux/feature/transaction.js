import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletTransactionDetails: [],
  virtualTransactionDetails: {
    data: [],
  },
  recentWalletTransactionDetails: [],
  recentVirtualTransactionDetails: [],
  pending: false,

  recCountryList: [],
  recCurrencyList: [],
  formState: {},
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      return { ...state, ...action.payload };
    },
    setRecCountryList: (state, action) => {
      state.recCountryList = action.payload;
    },
    setRecCurrencyList: (state, action) => {
      state.recCurrencyList = action.payload;
    },
    setFormState: (state, action) => {
      state.formState = { ...state.formState, ...action.payload };
    },
    resetFormState: (state) => {
      state.formState = {}; // Reset to an empty object
    },
    resetLists: (state) => {
      state.recCountryList = [];
      state.recCurrencyList = []; // Reset to an empty object
    },
    resetTransaction: (state) => {
      return initialState;
    },
  },
});

export const {
  setTransaction,
  resetTransaction,
  setRecCountryList,
  setRecCurrencyList,
  setFormState,
  resetFormState,
  resetLists,
} = transactionSlice.actions;

export default transactionSlice.reducer;
