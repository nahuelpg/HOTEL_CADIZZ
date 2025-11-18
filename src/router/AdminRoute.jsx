// src/router/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e5e7eb",
          background: "#020617",
        }}
      >
        Cargando...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
