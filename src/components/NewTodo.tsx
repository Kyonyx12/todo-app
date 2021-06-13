import React, { useState, useEffect } from "react";
import {
  FormControl,
  Input,
  InputLabel,
  Container,
  Button,
  Box,
} from "@material-ui/core";
import Todo, { Error, InputTodo } from "../models/models";
import fb from "../firebase/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import MySnackbar from "./MySnackbar";
import { initialError, initialStateTodo } from "../initialState/initialState";

const NewTodo: React.FC<{
  todoToEdit: Todo;
  setTodoToEdit: (todoToEdit: Todo) => void;
  setOpen: (setOpen: boolean) => void;
}> = ({ todoToEdit, setTodoToEdit, setOpen }) => {
  const [todo, setTodo] = useState<InputTodo>(initialStateTodo);
  const [errorInfo, setErrorInfo] = useState<Error>(initialError);
  const [openAlert, setOpenAlert] = useState(false);
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
        setErrorInfo({ error: true, errorMessage: error.message });
        setOpenAlert(true);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo.title === "" || todo.content === "") {
      setErrorInfo({ error: true, errorMessage: "Inputs cannot be empty." });
      setOpenAlert(true);
      return;
    }
    saveTodo(todo.id, todo.title, todo.content);
    setTodoToEdit({ id: null, title: "", content: "" });
    setOpen(false);
  };
  const handleCancel = () => {
    setTodoToEdit({ id: null, title: "", content: "" });
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <FormControl fullWidth>
        <InputLabel>Title</InputLabel>
        <Input onChange={handleChange("title")} value={todo.title} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Content</InputLabel>
        <Input
          onChange={handleChange("content")}
          value={todo.content}
          multiline={true}
          rows="4"
        />
      </FormControl>
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
      {errorInfo.error && (
        <MySnackbar
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          message={errorInfo.errorMessage}
          severity="error"
        />
      )}
    </Container>
  );
};

export default NewTodo;
