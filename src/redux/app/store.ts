// store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authenticateReducer from '../features/authenticate/authenticateSlice';


const rootReducer = combineReducers({
  authenticate: authenticateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// inferred TS types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
