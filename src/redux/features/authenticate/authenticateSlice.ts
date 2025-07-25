import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface AuthenticateState {
  isLogin: boolean;
  role: "HR" | "Employee" | "";
  username: string;
  id: string;
}

const initialState: AuthenticateState = {
  isLogin: false,
  role: "",
  username: "",
  id: "",
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
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    clearAuthenticateState(state) {
      console.log("Clearing authenticate state");
      return initialState;
  },
},
});

export const { setIsLogin, setRole, setUsername, setId, clearAuthenticateState } =
  authenticateSlice.actions;

export const selectIsLogin = (state: RootState) => state.authenticate.isLogin;
export const selectRole = (state: RootState) => state.authenticate.role;
export const selectUsername = (state: RootState) => state.authenticate.username;
export const selectId = (state: RootState) => state.authenticate.id;

export default authenticateSlice.reducer;
