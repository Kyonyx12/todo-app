import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { notificationActions } from "../../store/notification-slice";
import { authActions } from "../../store/auth-slice";
import { InputRegister } from "../../models/models";
import fb from "../../firebase/firebase";
import { FormControl, InputLabel, Input, Button, Box } from "@material-ui/core";
import { initialInputRegistration } from "../../initialState/initialState";

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
      <FormControl fullWidth>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          type="email"
          onChange={handleChange("email")}
          value={input.email}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type="password"
          onChange={handleChange("password")}
          value={input.password}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
        <Input
          id="confirmPassword"
          type="password"
          onChange={handleChange("confirmPassword")}
          value={input.confirmPassword}
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Signup
      </Button>
      <Link
        to="/login"
        style={{
          textAlign: "center",
          textDecoration: "none",
          fontSize: "20px",
        }}
      >
        <p>I already have and account...</p>
      </Link>
    </Box>
  );
};
export default Registration;
