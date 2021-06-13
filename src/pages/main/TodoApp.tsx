import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  ThemeProvider,
  CssBaseline,
  createMuiTheme,
} from "@material-ui/core";
import { IoMdAddCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { useHistory } from "react-router-dom";
import Todo from "../../components/Todo";
import MySnackbar from "../../components/MySnackbar";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Todo as TodoType, Error } from "../../models/models";
import { authActions } from "../../store/auth-slice";
import NewTodo from "../../components/NewTodo";
import fb from "../../firebase/firebase";
import { BsSun, BsMoon } from "react-icons/bs";
import MyModal from "../../components/MyModal";
import {
  initialError,
  initialStateTodos,
  initialStateTodoToEdit,
} from "../../initialState/initialState";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "70vw",
      height: "280px",
      transform: "translate(21.5%,80%)",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 2, 2),
    },
  })
);

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>(initialStateTodos);
  const [todoToEdit, setTodoToEdit] = useState(initialStateTodoToEdit);
  const [errorInfo, setErrorInfo] = useState<Error>(initialError);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.userId);
  const darkmodeOn = useSelector((state: RootState) => state.auth.darkmodeOn);

  const userName = localStorage.getItem("username");

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });

  const handleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem("darkmode", "off");
    } else {
      setDarkMode(true);
      localStorage.setItem("darkmode", "on");
    }
  };

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

  useEffect(() => {
    if (darkmodeOn) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [darkmodeOn]);

  const dispatch = useDispatch();
  const history = useHistory();

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
        setErrorInfo({ error: true, errorMessage: error.message });
      });
  };

  // const handleClose = (e: React.SyntheticEvent, reason?: string) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpenAlert(false);
  // };

  const classes = useStyles();

  const body = (
    <div className={classes.paper}>
      <NewTodo
        todoToEdit={todoToEdit}
        setTodoToEdit={setTodoToEdit}
        setOpen={setOpen}
      />
    </div>
  );

  return (
    <>
      <MyModal open={open} setOpen={setOpen}>
        {body}
      </MyModal>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            my={1}
          >
            <Typography noWrap variant="h6">
              {userName}
            </Typography>
            <Box display="flex" alignContent="center">
              <Box mx={2}>
                {!darkMode ? (
                  <Button>
                    <BsMoon size="2rem" onClick={handleDarkMode} />
                  </Button>
                ) : (
                  <Button>
                    <BsSun size="2rem" onClick={handleDarkMode} />
                  </Button>
                )}
              </Box>
              <Button onClick={handleLogout} variant="contained">
                Logout
              </Button>
            </Box>
            {errorInfo.error && (
              <MySnackbar
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
                message={errorInfo.errorMessage}
                severity="error"
              />
            )}
          </Box>
          <h1>Todo App</h1>
          <Box display="flex" justifyContent="flex-end" pt={10}>
            <Button onClick={() => setOpen(true)}>
              <IoMdAddCircle size="4rem" />
            </Button>
          </Box>
          <Box mt={2}>
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
                <p>No todos to show.</p>
              )}
            </Grid>
          </Box>
        </CssBaseline>
      </ThemeProvider>
    </>
  );
};

export default TodoApp;
