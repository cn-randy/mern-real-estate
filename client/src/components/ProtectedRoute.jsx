import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser.user || null;

  return user ? <Outlet /> : <Navigate to="/" />;
}
