// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./store/bookingContext";
import { AuthProvider } from "./store/authContext";

// COMPONENTES GENERALES
import Navbar from "./componentes/Navbar";
import Inicio from "./componentes/Inicio";
import Habitaciones from "./componentes/Habitaciones";
import Reserva from "./componentes/Reserva";
import Contacto from "./componentes/Contacto";
import Login from "./componentes/Login";
import Perfil from "./componentes/Perfil";
import Register from "./componentes/Register";
import FacturaReserva from "./componentes/FacturaReserva";
import RecuperarPassword from "./componentes/RecuperarPassword";

// RUTAS PROTEGIDAS
import PrivateRoute from "./router/PrivateRoute";
import OperatorRoute from "./router/OperatorRoute";
import AdminRoute from "./router/AdminRoute";

// COMPONENTES DEL OPERADOR
import OperatorHome from "./componentes/operator/Panel";
import OpHabitaciones from "./componentes/operator/Habitaciones";
import OpReservas from "./componentes/operator/Reservas";
import OpHistorial from "./componentes/operator/HistorialHuesped";
import OpStock from "./componentes/operator/Stock";

// COMPONENTES DEL ADMIN
import AdminPanel from "./componentes/admin/AdminPanel";
import AdminOperators from "./componentes/admin/adminOperators";
import AdminStats from "./componentes/admin/AdminStats";   // 👈 NUEVO

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Navbar />

          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Inicio />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/reserva" element={<Reserva />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/recuperar-password"
              element={<RecuperarPassword />}
            />

            {/* RUTAS PRIVADAS (usuario logueado) */}
            <Route element={<PrivateRoute />}>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/factura-reserva" element={<FacturaReserva />} />
            </Route>

            {/* RUTAS OPERADOR / ADMIN */}
            <Route element={<OperatorRoute />}>
              <Route path="/operator" element={<OperatorHome />} />
              <Route
                path="/operator/habitaciones"
                element={<OpHabitaciones />}
              />
              <Route path="/operator/reservas" element={<OpReservas />} />
              <Route path="/operator/stock" element={<OpStock />} />
              <Route
                path="/operator/huesped/:id/historial"
                element={<OpHistorial />}
              />
            </Route>

            {/* RUTAS ADMINISTRADOR */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/operators" element={<AdminOperators />} />
              <Route path="/admin/stats" element={<AdminStats />} /> {/* 👈 NUEVO */}
            </Route>
          </Routes>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
