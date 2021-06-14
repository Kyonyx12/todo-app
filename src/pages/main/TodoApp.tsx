import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography, AppBar } from "@material-ui/core";
import { IoMdAddCircle } from "react-icons/io";
import { FcTodoList } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { useHistory } from "react-router-dom";
import Todo from "../../components/Todo";

import { Todo as TodoType } from "../../models/models";
import { authActions } from "../../store/auth-slice";
import { notificationActions } from "../../store/notification-slice";
import NewTodo from "../../components/NewTodo";
import fb from "../../firebase/firebase";
import MyModal from "../../components/MyModal";
import {
  initialStateTodos,
  initialStateTodoToEdit,
} from "../../initialState/initialState";

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>(initialStateTodos);
  const [todoToEdit, setTodoToEdit] = useState(initialStateTodoToEdit);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const userId = useSelector((state: RootState) => state.auth.userId);

  const userName = localStorage.getItem("username");

  const getTodos = async (userId: string | null) => {
    await fb
      .firestore()
      .collection(`todos`)
      .doc("users")
      .collection(`${userId}`)
      .orderBy("id", "desc")
      .onSnapshot((querySnapshot) => {
        let todos: any = [];
        querySnapshot.forEach((todo) => {
          todos.push({ ...todo.data() });
        });
        setTodos(todos);
      });
  };

  useEffect(() => {
    getTodos(userId);
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("loged");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    fb.auth()
      .signOut()
      .then(() => {
        history.replace("/login");
        dispatch(authActions.login(null));
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

  const body = (
    <NewTodo
      todoToEdit={todoToEdit}
      setTodoToEdit={setTodoToEdit}
      setOpen={setOpen}
    />
  );

  return (
    <>
      <MyModal open={open} setOpen={setOpen}>
        {body}
      </MyModal>
      <Box
        style={{
          backgroundColor: "#fff",
          boxShadow:
            "rgba(60, 64, 67, 0.3) 1px 2px 3px 1px, rgba(60, 64, 67, 0.15) 1px 2px 4px 2px",
        }}
        minHeight="96vh"
      >
        <AppBar position="static">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            px={1}
            style={{ backgroundColor: "#1976d2" }}
          >
            <Typography variant="h6">{userName}</Typography>
            <Box display="flex">
              <Button onClick={handleLogout} variant="contained">
                Logout
              </Button>
            </Box>
          </Box>
        </AppBar>
        <h1 style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <span>
            <FcTodoList size="1.5rem" />
          </span>
          <span>TODO</span>
          <span style={{ color: "rgb(25, 118, 210)" }}>APP</span>
        </h1>
        <Box display="flex" justifyContent="flex-end" pt={6}>
          <Button onClick={() => setOpen(true)}>
            <IoMdAddCircle size="4rem" color="rgb(25, 118, 210)" />
          </Button>
        </Box>
        <Box mt={2} px={1}>
          <Grid container direction="row" justify="center" spacing={1}>
            {todos.length > 0 ? (
              todos.map((todo) => {
                return (
                  <Todo
                    key={todo.id}
                    title={todo.title}
                    id={todo.id}
                    content={todo.content}
                    setTodoToEdit={setTodoToEdit}
                    setOpen={setOpen}
                  />
                );
              })
            ) : (
              <>
                <Typography variant="h5">
                  No todos to show.
                  <div className="divider" />
                </Typography>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TodoApp;
