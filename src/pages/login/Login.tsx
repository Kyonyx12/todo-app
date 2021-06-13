import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Error, InputLogin } from "../../models/models";
import fb from "../../firebase/firebase";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Container,
} from "@material-ui/core";
import MySnackbar from "../../components/MySnackbar";
import { initialInput, initialError } from "../../initialState/initialState";

const Login: React.FC = () => {
  const [input, setInput] = useState<InputLogin>(initialInput);
  const [errorInfo, setErrorInfo] = useState<Error>(initialError);
  const [openAlert, setOpenAlert] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange =
    (inputName: keyof InputLogin) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput({ ...input, [inputName]: e.target.value });
    };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo({ error: false, errorMessage: "" });
    setOpenAlert(true);
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
        setErrorInfo({ error: true, errorMessage: error.message });
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
      {errorInfo.error && (
        <MySnackbar
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          message={errorInfo.errorMessage}
          severity="error"
        />
      )}
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
