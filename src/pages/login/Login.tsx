import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { InputLogin } from "../../models/models";
import fb from "../../firebase/firebase";
import {
  FormControl,
  Button,
  Box,
  TextField,
  Typography,
} from "@material-ui/core";
import { RiLock2Line } from "react-icons/ri";
import { initialInput } from "../../initialState/initialState";
import { notificationActions } from "../../store/notification-slice";

const Login: React.FC = () => {
  const [input, setInput] = useState<InputLogin>(initialInput);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange =
    (inputName: keyof InputLogin) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput({ ...input, [inputName]: e.target.value });
    };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    fb.auth()
      .signInWithEmailAndPassword(input.email, input.password)
      .then((response) => {
        if (response) {
          const username = response.user!.email?.substring(
            0,
            response.user!.email?.indexOf("@")
          );

          localStorage.setItem("userId", `${response.user!.uid}`);
          localStorage.setItem("loged", "true");
          localStorage.setItem("username", `${username}`);

          history.push("/");
          dispatch(authActions.login(response.user!.uid));
        }
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
    setInput(initialInput);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      style={{ backgroundColor: "#fff" }}
      p={2}
      borderRadius={5}
    >
      <Box
        style={{ backgroundColor: "rgb(25, 118, 210)" }}
        borderRadius="30px"
        height="60px"
        width="60px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={1}
        color="primary"
      >
        <RiLock2Line size="2.5rem" color="#fff" />
      </Box>
      <Typography variant="h5">Sing In</Typography>
      <Box my={1} width="100%">
        <FormControl fullWidth>
          <TextField
            id="email"
            type="email"
            onChange={handleChange("email")}
            value={input.email}
            label="Email"
            variant="outlined"
          />
        </FormControl>
      </Box>
      <Box my={1} width="100%">
        <FormControl fullWidth>
          <TextField
            id="password"
            type="password"
            onChange={handleChange("password")}
            value={input.password}
            label="Password"
            variant="outlined"
          />
        </FormControl>
      </Box>
      <Box width="100%" my={1}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
      <Link to="/registration">
        <Typography variant="h6">I don't have and account.</Typography>
      </Link>
    </Box>
  );
};
export default Login;
