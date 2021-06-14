import React, { useState } from "react";
import {
  Grid,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
} from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { makeStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index";
import { Todo as TodoType } from "../models/models";
import { notificationActions } from "../store/notification-slice";
import MyModal from "./MyModal";
import fb from "../firebase/firebase";

const useStyles = makeStyles({
  root: {
    height: "150px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#1c1e21",
    backgroundColor: "#fff",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 1px 2px 3px 1px, rgba(60, 64, 67, 0.15) 1px 2px 4px 2px",
    borderRadius: "5px",
  },
});

const Todo: React.FC<{
  title: string;
  id: number | null;
  content: string;
  setTodoToEdit: (todoToEdit: TodoType) => void;
  setOpen: (setOpen: boolean) => void;
}> = ({ title, id, content, setTodoToEdit, setOpen }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleDelete = (id: number | null) => {
    fb.firestore()
      .collection(`todos`)
      .doc("users")
      .collection(`${userId}`)
      .doc(`${id}`)
      .delete()
      .catch((error) =>
        dispatch(
          notificationActions.sendNotification({
            severity: "error",
            message: error.message,
            open: true,
          })
        )
      );
    dispatch(
      notificationActions.sendNotification({
        severity: "warning",
        message: "Todo deleted.",
        open: true,
      })
    );
  };

  const handleEdit = (id: number | null) => {
    setOpen(true);
    const todoData = { id, title, content };
    setTodoToEdit(todoData);

    fb.firestore()
      .collection(`todos`)
      .doc("users")
      .collection(`${userId}`)
      .doc(`${id}`)
      .update(todoData)
      .catch((error) =>
        dispatch(
          notificationActions.sendNotification({
            severity: "error",
            message: error.message,
            open: true,
          })
        )
      );
  };

  const body = (
    <Box display="flex" flexDirection="column" textAlign="center" mt={8}>
      <h2>Do you want to delete this Todo?</h2>
      <Box display="flex" justifyContent="center">
        <Box mx={1}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(id)}
          >
            Delete
          </Button>
        </Box>
        <Box mx={1}>
          <Button variant="contained" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <MyModal open={openModal} setOpen={setOpenModal}>
        {body}
      </MyModal>
      <Grid item xs={12} sm={6}>
        <Box className={classes.root}>
          <Box textAlign="center">
            <Typography variant="h6">
              {title.length >= 20 ? title.substring(0, 20) + "..." : title}
            </Typography>
          </Box>
          <CardContent>
            <Typography paragraph>
              {content.length >= 20
                ? content.substring(0, 20) + "..."
                : content}
            </Typography>
          </CardContent>
          <Box display="flex" justifyContent="flex-end">
            <CardActions>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleEdit(id)}
              >
                <EditRoundedIcon />
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => setOpenModal(true)}
              >
                <HighlightOffRoundedIcon />
              </Button>
            </CardActions>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default Todo;
