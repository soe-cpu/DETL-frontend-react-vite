import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("jwtToken");
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
