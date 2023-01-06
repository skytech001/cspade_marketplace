import React from "react";
import { Navigate, Outlet } from "react-router-dom";

//this component ensures that only signedin users can access the routes wraped by it. its a protective route.
const PrivateRoute = ({ user, children }) => {
  const { name } = user;

  if (!name) {
    return <Navigate replace to="/signin" />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
