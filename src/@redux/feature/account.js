import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountDetails: [],
  virtualAccountDetails: [],
  accountStatement: [],
  cards: [],
  contacts: [],
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.accountDetails = action.payload;
    },

    setAccountStatement: (state, action) => {
      state.accountStatement = action.payload;
    },

    setCards: (state, action) => {
      state.cards = action.payload;
    },

    setVirtualAccountDetails: (state, action) => {
      state.virtualAccountDetails = action.payload;
    },

    setContacts: (state, action) => {
      state.contacts = action.payload;
    },

    resetAccountStates: () => initialState,
  },
});

export const {
  setAccount,
  resetAccount,
  setAccountStatement,
  setCards,
  resetAccountStates,
  setVirtualAccountDetails,
  setContacts,
} = accountSlice.actions;

export default accountSlice.reducer;
