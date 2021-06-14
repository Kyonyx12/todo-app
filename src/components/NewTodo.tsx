import React, { useState, useEffect } from "react";
import { FormControl, Container, Button, Box } from "@material-ui/core";
import Todo, { InputTodo } from "../models/models";
import fb from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index";
import { notificationActions } from "../store/notification-slice";
import { initialStateTodo } from "../initialState/initialState";
import { TextField } from "@material-ui/core";

const NewTodo: React.FC<{
  todoToEdit: Todo;
  setTodoToEdit: (todoToEdit: Todo) => void;
  setOpen: (setOpen: boolean) => void;
}> = ({ todoToEdit, setTodoToEdit, setOpen }) => {
  const [todo, setTodo] = useState<InputTodo>(initialStateTodo);

  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    if (todoToEdit.id) {
      setTodo(todoToEdit);
    }
    return () => setTodo(initialStateTodo);
  }, [todoToEdit]);

  const handleChange =
    (inputName: keyof InputTodo) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (todo.id) {
        setTodo({
          ...todo,
          [inputName]: e.target.value,
        });
      } else {
        setTodo({
          ...todo,
          [inputName]: e.target.value,
          id: Date.now(),
        });
      }
    };

  const saveTodo = async (id: any, title: string, content: string) => {
    await fb
      .firestore()
      .collection(`todos`)
      .doc("users")
      .collection(`${userId}`)
      .doc(`${id}`)
      .set({ id, title, content })
      .then(() => {
        setTodo(initialStateTodo);
      })
      .catch((error) => {
        dispatch(
          notificationActions.sendNotification({
            severity: "error",
            message: error.message,
            open: true,
          })
        );
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.title === "" || todo.content === "") {
      dispatch(
        notificationActions.sendNotification({
          severity: "error",
          message: "Inputs cannot be empty.",
          open: true,
        })
      );
      return;
    }
    saveTodo(todo.id, todo.title, todo.content);
    if (todoToEdit.id) {
      setTodoToEdit({ id: null, title: "", content: "" });
      dispatch(
        notificationActions.sendNotification({
          severity: "info",
          message: "Todo updated.",
          open: true,
        })
      );
    } else {
      dispatch(
        notificationActions.sendNotification({
          severity: "success",
          message: "New todo added.",
          open: true,
        })
      );
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setTodoToEdit({ id: null, title: "", content: "" });
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box my={1} width="100%">
        <FormControl fullWidth>
          <TextField
            onChange={handleChange("title")}
            value={todo.title}
            variant="outlined"
            label="Title"
          />
        </FormControl>
      </Box>{" "}
      <Box my={1} width="100%">
        <FormControl fullWidth>
          <TextField
            onChange={handleChange("content")}
            value={todo.content}
            multiline={true}
            rows="2"
            variant="outlined"
            label="Content"
          />
        </FormControl>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="space-evenly">
        <Box width="40%" my={1}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            color="primary"
          >
            {todoToEdit.id ? "Update" : "Add"}
          </Button>
        </Box>
        <Box width="40%" my={1}>
          <Button
            onClick={handleCancel}
            variant="contained"
            fullWidth
            color="default"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewTodo;
