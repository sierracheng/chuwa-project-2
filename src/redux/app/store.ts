import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authenticateReducer from "../features/authenticate/authenticateSlice";

// TODO: Combine reducers here:
const rootReducer = combineReducers({
  authenticate: authenticateReducer,
});

// Redux Persist config
const persistConfig = {
  key: "root", // Key for localStorage
  storage, // Defaults to localStorage
  whitelist: ["authenticate"], // Whitelist the slices
};

// Wrap reducer in persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,

  // Redux-persist -- Redux Toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
