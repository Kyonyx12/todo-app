import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { notificationActions } from "../store/notification-slice";

const MySnackbar: React.FC = () => {
  let alert;

  const { severity, message, open } = useSelector(
    (state: RootState) => state.notification
  );

  switch (severity) {
    case "error":
      alert = <Alert severity="error">{message}</Alert>;
      break;
    case "success":
      alert = <Alert severity="success">{message}</Alert>;
      break;
    case "info":
      alert = <Alert severity="info">{message}</Alert>;
      break;
    case "warning":
      alert = <Alert severity="warning">{message}</Alert>;
      break;
  }
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(notificationActions.showNotification(false));
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      {alert}
    </Snackbar>
  );
};

export default MySnackbar;
