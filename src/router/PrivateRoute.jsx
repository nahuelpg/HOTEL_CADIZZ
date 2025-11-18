// src/router/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function PrivateRoute() {
  const { isAuth } = useAuth();
  const location = useLocation();

  // Si no está logueado → volver al login,
  // pero guardamos la ruta completa donde estaba
  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search + location.hash }}
      />
    );
  }

  // Si está logueado → mostrar el contenido
  return <Outlet />;
}
