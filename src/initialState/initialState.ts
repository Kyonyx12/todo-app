import { Todo } from "../models/models";
import { Auth } from "../models/models";

//Slices

export const initialStateAuth: Auth = {
  isAuth: null,
  userId: null,
  darkmodeOn: false,
};

//Components

export const initialInput = {
  email: "",
  password: "",
};

export const initialInputRegistration = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const initialError = {
  error: false,
  errorMessage: "",
};

export const initialStateTodo = { id: null, title: "", content: "" };

export const initialStateNotification = {
  severity: "",
  message: "",
};

//maybe and error? todoapp.tsx
export const initialStateTodos: Todo[] = [];
export const initialStateTodoToEdit: Todo = {
  id: null,
  title: "",
  content: "",
};
