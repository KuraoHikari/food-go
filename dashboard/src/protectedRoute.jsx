import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export const ProtectedAuthRoute = ({ children }) => {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return children;
};
