import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { InputLogin } from "../../models/models";
import fb from "../../firebase/firebase";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Container,
} from "@material-ui/core";
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
    <Container component="main" maxWidth="xs">
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
      >
        Login
      </Button>
      <Link
        to="/registration"
        style={{
          textAlign: "center",
          textDecoration: "none",
          fontSize: "20px",
        }}
      >
        <p>I don't have and account...</p>
      </Link>
    </Container>
  );
};
export default Login;
