import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { notificationActions } from "../../store/notification-slice";
import { authActions } from "../../store/auth-slice";
import { InputRegister } from "../../models/models";
import fb from "../../firebase/firebase";
import {
  FormControl,
  TextField,
  Button,
  Box,
  Typography,
} from "@material-ui/core";
import { initialInputRegistration } from "../../initialState/initialState";
import { RiLock2Line } from "react-icons/ri";

const Registration: React.FC = () => {
  const [input, setInput] = useState<InputRegister>(initialInputRegistration);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange =
    (inputName: keyof InputRegister) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput({ ...input, [inputName]: e.target.value });
    };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!(input.password === input.confirmPassword)) {
      dispatch(
        notificationActions.sendNotification({
          severity: "error",
          message: "Passwords don't match.",
          open: true,
        })
      );
      return;
    }

    fb.auth()
      .createUserWithEmailAndPassword(input.email, input.password)

      .then((response) => {
        if (response) {
          const username = response.user!.email?.substring(
            0,
            response.user!.email?.indexOf("@")
          );

          localStorage.setItem("userId", `${response.user!.uid}`);
          localStorage.setItem("username", `${username}`);
          localStorage.setItem("loged", "true");

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
    setInput(initialInputRegistration);
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
      <Typography variant="h5">Sing Up</Typography>
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
      <Box my={1} width="100%">
        <FormControl fullWidth>
          <TextField
            id="confirmPassword"
            type="password"
            onChange={handleChange("confirmPassword")}
            value={input.confirmPassword}
            label="Confirm Password"
            variant="outlined"
          />
        </FormControl>
      </Box>
      <Box width="100%" my={1}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
        >
          Signup
        </Button>
      </Box>
      <Link to="/login">
        <Typography variant="h6">I already have and account.</Typography>
      </Link>
    </Box>
  );
};
export default Registration;
