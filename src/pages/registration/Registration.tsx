import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Error, InputRegister } from "../../models/models";
import MySnackbar from "../../components/MySnackbar";
import fb from "../../firebase/firebase";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Container,
} from "@material-ui/core";
import {
  initialInputRegistration,
  initialError,
} from "../../initialState/initialState";

const Registration: React.FC = () => {
  const [input, setInput] = useState<InputRegister>(initialInputRegistration);
  const [errorInfo, setErrorInfo] = useState<Error>(initialError);
  const [openAlert, setOpenAlert] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange =
    (inputName: keyof InputRegister) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput({ ...input, [inputName]: e.target.value });
    };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorInfo({ error: false, errorMessage: "" });
    setOpenAlert(true);

    if (!(input.password === input.confirmPassword)) {
      setErrorInfo({ error: true, errorMessage: "Passwords don't match." });
      setOpenAlert(true);
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
        setErrorInfo({ error: true, errorMessage: error.message });
        setOpenAlert(true);
      });
    setInput(initialInputRegistration);
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
      {errorInfo.error && (
        <MySnackbar
          openAlert={openAlert}
          setOpenAlert={setOpenAlert}
          message={errorInfo.errorMessage}
          severity="error"
        />
      )}
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
    </Container>
  );
};
export default Registration;
