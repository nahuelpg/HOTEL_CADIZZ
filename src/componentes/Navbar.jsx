// src/componentes/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../store/authContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  // Roles
  const isOperator = user && ["operator", "admin"].includes(user.role);
  const isAdmin = user && user.role === "admin";

  // Ruta del logo según rol
  const homePath = isAdmin ? "/admin" : isOperator ? "/operator" : "/";

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link to={homePath} className="nav-logo">
          <div className="logo-content">
            <div className="logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Cadizz</span>
              <span className="logo-subtitle">Hotel</span>
            </div>
          </div>
        </Link>

        <div className="nav-links">
          {/* 🔹 OPERADOR / ADMIN */}
          {isOperator ? (
            <>
              <Link to="/operator" className="nav-link">
                Panel
              </Link>
              <Link to="/operator/habitaciones" className="nav-link">
                Habitaciones
              </Link>
              <Link to="/operator/reservas" className="nav-link">
                Reservas
              </Link>

              {/* ADMIN EXTRA */}
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              )}

              <span className="nav-user">Hola, {user.name}</span>
              <button onClick={logout} className="nav-btn">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {/* 🔹 CLIENTE */}
              <Link to="/" className="nav-link">
                Inicio
              </Link>
              <Link to="/habitaciones" className="nav-link">
                Habitaciones
              </Link>
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>

              {user ? (
                <>
                  <Link to="/perfil" className="nav-link">
                    Perfil
                  </Link>
                  <span className="nav-user">Hola, {user.name}</span>
                  <button onClick={logout} className="nav-btn">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="nav-link">
                    Crear cuenta
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
