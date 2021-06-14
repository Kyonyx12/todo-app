import React, { ReactElement } from "react";
import { Modal, makeStyles, createStyles, Theme, Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "550px",
      height: "240px",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 2, 2),
    },
  })
);

const MyModal: React.FC<{
  children: ReactElement;
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = (props) => {
  const classes = useStyles();
  return (
    <Modal
      disableBackdropClick
      open={props.open}
      onClose={() => props.setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {
        <Box display="flex" justifyContent="center" mt={32}>
          <div className={classes.paper}>{props.children}</div>
        </Box>
      }
    </Modal>
  );
};

export default MyModal;
