import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SellerAuthRoute = ({ user, children }) => {
  const { name, isSeller } = user;

  if (!name && !isSeller) {
    return <Navigate replace to="/signin" />;
  }

  return children ? children : <Outlet />;
};

export default SellerAuthRoute;
