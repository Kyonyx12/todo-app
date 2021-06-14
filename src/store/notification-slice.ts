import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialStateNotification } from "../initialState/initialState";
import { Notification } from "../models/models";

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialStateNotification,
  reducers: {
    sendNotification(state, action: PayloadAction<Notification>) {
      state.severity = action.payload.severity;
      state.message = action.payload.message;
      state.open = action.payload.open;
    },
    showNotification(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice;
