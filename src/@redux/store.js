import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import { thunk } from "redux-thunk";

import authReducer from "./feature/Auth";
import utilityReducer from "./feature/Utility";
import accountReducer from "./feature/account";
import transactionReducer from "./feature/transaction";
import onboardingReducer from "./feature/Onboarding";
import recipientReducer from "./feature/recipient";
import quoteReducer from "./feature/quotes";
import feesReducer from "./feature/Fees";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  onboarding: onboardingReducer,
  utility: utilityReducer,
  account: accountReducer,
  recipient: recipientReducer,
  transaction: transactionReducer,
  quotes: quoteReducer,
  fee: feesReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage: storageSession,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
