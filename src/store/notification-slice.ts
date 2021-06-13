import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialStateNotification } from "../initialState/initialState";
import { Notification } from "../models/models";

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialStateNotification,
  reducers: {
    showNotification(state, action: PayloadAction<Notification>) {
      state.severity = action.payload.severity;
      state.message = action.payload.message;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice;
