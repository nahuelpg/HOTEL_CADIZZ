// src/router/OperatorRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function OperatorRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "operator" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
