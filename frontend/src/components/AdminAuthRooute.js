import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminAuthRooute = ({ user, children }) => {
  const { name, isAdmin } = user;

  if (!name && !isAdmin) {
    return <Navigate replace to="/signin" />;
  }

  return children ? children : <Outlet />;
};

export default AdminAuthRooute;
