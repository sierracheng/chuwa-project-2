import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface AuthenticateState {
  isLogin: boolean;
  role: "HR" | "Employee" | "";
};

const initialState: AuthenticateState = {
  isLogin: false,
  role: "",
};

const authenticateSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {
    setIsLogin(state, action: PayloadAction<boolean>) {
      state.isLogin = action.payload;
    },
    setRole(state, action: PayloadAction<AuthenticateState["role"]>) {
      state.role = action.payload;
    },
  },
});

export const { setIsLogin, setRole } = authenticateSlice.actions;

export const selectIsLogin = (state: RootState) => state.authenticate.isLogin;
export const selectRole = (state: RootState) => state.authenticate.role;

export default authenticateSlice.reducer;
