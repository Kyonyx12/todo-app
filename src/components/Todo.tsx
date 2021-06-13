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
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import { Todo as TodoType, Error } from "../models/models";
import { initialError } from "../initialState/initialState";
import MyModal from "./MyModal";
import fb from "../firebase/firebase";

const useStyles = makeStyles({
  root: {
    height: "150px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "#fafafa",
    boxShadow: "0 0 8px rgba(0,0,0,0.25)",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "70vw",
    height: "120px",
    color: "rgba(0, 0, 0, 0.87)",
    transform: "translate(20%,283%)",
    backgroundColor: "#fafafa",
    border: "2px solid #000",
  },
});

const Todo: React.FC<{
  title: string;
  id: number | null;
  content: string;
  setTodoToEdit: (todoToEdit: TodoType) => void;
  setOpen: (setOpen: boolean) => void;
}> = ({ title, id, content, setTodoToEdit, setOpen }) => {
  const [errorInfo, setErrorInfo] = useState<Error>(initialError);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  // const dispatch = useDispatch();
  const classes = useStyles();

  const handleDelete = (id: number | null) => {
    fb.firestore()
      .collection(`todos`)
      .doc("users")
      .collection(`${userId}`)
      .doc(`${id}`)
      .delete();
    // .catch((error) =>
    //  setErrorInfo({ error: true, errorMessage: error.message })
    // )
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
      .update(todoData);

    // .catch((error) =>
    //  setErrorInfo({ error: true, errorMessage: error.message })
    // )
  };

  const body = (
    <div className={classes.paper}>
      <h2>Do you want to delete this Todo?</h2>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
        <Button variant="contained" onClick={() => setOpenModal(false)}>
          Cancel
        </Button>
      </Box>
    </div>
  );

  return (
    <>
      <MyModal open={openModal} setOpen={setOpenModal}>
        {body}
      </MyModal>
      <Grid item xs={12} sm={6} md={4}>
        <Box className={classes.root}>
          {/*{errorInfo.error ? (
        <Alert severity="error">{errorInfo.errorMessage}</Alert>
      ) : (
        <Alert severity={todoToEdit.id ? "info" : "success"}>
          {todoToEdit.id ? "Todo updated." : "New todo added."}
        </Alert>
      )}*/}
          <Box textAlign="center">
            <Typography noWrap variant="h6">
              {title}
            </Typography>
          </Box>
          <CardContent>
            <Typography noWrap paragraph>
              {content}
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
