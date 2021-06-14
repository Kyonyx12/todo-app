import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { RootState } from "../../store/index";
import { Route, Redirect } from "react-router-dom";
import { PrivateRouteProps } from "../../models/models";

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  const dispatch = useDispatch();

  if (localStorage.getItem("loged") === "true") {
    dispatch(authActions.login(localStorage.getItem("userId")));
  }

  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  return (
    <Route
      {...routeProps}
      render={(_) => (isAuth ? <Component /> : <Redirect to="/login" />)}
    />
  );
};

export default PrivateRoute;
