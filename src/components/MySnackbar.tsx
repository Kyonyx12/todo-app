import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const MySnackbar: React.FC<{
  openAlert: boolean;
  setOpenAlert: (bool: boolean) => void;
  message: string;
  severity: string;
}> = (props) => {
  let alert;

  switch (props.severity) {
    case "error":
      alert = <Alert severity="error">{props.message}</Alert>;
      break;
    case "success":
      alert = <Alert severity="success">{props.message}</Alert>;
      break;
    case "info":
      alert = <Alert severity="info">{props.message}</Alert>;
      break;
    case "warning":
      alert = <Alert severity="warning">{props.message}</Alert>;
      break;
  }

  return (
    <Snackbar
      open={props.openAlert}
      autoHideDuration={3000}
      onClose={() => props.setOpenAlert(false)}
    >
      {alert}
    </Snackbar>
  );
};

export default MySnackbar;
