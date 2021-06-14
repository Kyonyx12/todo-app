import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialStateAuth } from "../initialState/initialState";

const authSlice = createSlice({
  name: "auth",
  initialState: initialStateAuth,
  reducers: {
    login(state, action: PayloadAction<string | null>) {
      state.isAuth = true;
      state.userId = action.payload;
    },
    logout(state) {
      state.isAuth = false;
      state.userId = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
