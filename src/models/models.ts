import { RouteProps } from "react-router-dom";

//Slices Types

export type Auth = {
  isAuth: null | boolean;
  userId: string | null;
  darkmodeOn: boolean;
};

// Components Types

export type InputRegister = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type InputTodo = {
  id: number | null;
  title: string;
  content: string;
};
export type InputLogin = {
  email: string;
  password: string;
};
export type Error = {
  error: boolean;
  errorMessage: string;
};
export type PrivateRouteProps = {
  path: RouteProps["path"];
  component: React.ElementType;
};

export type Todo = {
  id: number | null;
  title: string;
  content: string;
};

export type Notification = {
  severity: string;
  message: string;
};

export default Todo;
