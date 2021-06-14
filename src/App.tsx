import React from "react";
import TodoApp from "./pages/main/TodoApp";
import { Provider } from "react-redux";
import store from "./store/index";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./pages/main/PrivateRoute";
import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import { Container } from "@material-ui/core";
import MySnackbar from "./components/MySnackbar";
import "./App.css";

const App: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <PrivateRoute path="/" component={TodoApp} />
          </Switch>
        </Router>
        <MySnackbar />
      </Provider>
    </Container>
  );
};

export default App;
