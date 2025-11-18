// src/componentes/operator/Panel.jsx
import { Outlet, NavLink } from "react-router-dom";

/**
 * Panel simple para envolver contenido de cada pantalla del operador.
 * Se usa así:
 *   <Panel title="Mapa de Habitaciones"> ... </Panel>
 */
export function Panel({ title, children }) {
  return (
    <div
      style={{
        padding: "16px",
        background:
          "radial-gradient(circle at top left, rgba(31,41,55,0.9), rgba(15,23,42,0.95))",
        borderRadius: "12px",
        marginTop: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        color: "#e5e7eb",
      }}
    >
      {title && (
        <h3
          style={{
            marginBottom: "12px",
            fontWeight: 600,
            fontSize: "1.05rem",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

/**
 * Layout principal del Panel del Operador (ruta /operator).
 * Acá van una breve bienvenida, accesos rápidos y el <Outlet />
 * donde se renderizan /operator/habitaciones, /operator/reservas, /operator/historial.
 */
export default function OperatorPanel() {
  const containerStyle = {
    padding: "90px 5vw 24px 5vw", // 👈 MÁS ABAJO PARA QUE SE VEA MEJOR
    minHeight: "calc(100vh - 80px)",
    color: "#e5e7eb",
  };

  const headerStyle = {
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    marginBottom: "6px",
    fontWeight: 600,
  };

  const subtitleStyle = {
    fontSize: "0.95rem",
    color: "#9ca3af",
    maxWidth: "520px",
  };

  const shortcutsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    margin: "24px 0",
  };

  const cardStyle = {
    background:
      "radial-gradient(circle at top left, rgba(31,41,55,0.9), rgba(15,23,42,0.95))",
    borderRadius: "16px",
    padding: "16px 18px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 16px 32px rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const cardTitle = {
    fontSize: "1.1rem",
    fontWeight: 600,
  };

  const cardText = {
    fontSize: "0.9rem",
    color: "#a5b4fc",
  };

  const linkButton = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "6px",
    padding: "8px 14px",
    borderRadius: "999px",
    border: "none",
    fontSize: "0.9rem",
    cursor: "pointer",
    background: "linear-gradient(135deg, #25a4ff, #3b82f6)",
    color: "#ffffff",
    fontWeight: 500,
    textDecoration: "none",
    boxShadow: "0 10px 24px rgba(59,130,246,0.5)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
  };

  const contentStyle = {
    marginTop: "8px",
  };

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Panel del operador</h2>
        <p style={subtitleStyle}>
          Desde aquí podés gestionar el estado de las habitaciones, revisar las
          reservas y consultar el historial de los huéspedes. Elegí una opción
          o usá el menú superior.
        </p>
      </header>

      {/* Accesos rápidos */}
      <section style={shortcutsGrid}>
        <article style={cardStyle}>
          <h3 style={cardTitle}>Habitaciones</h3>
          <p style={cardText}>
            Abrí o cerrá habitaciones, revisá la capacidad y el estado actual
            del mapa.
          </p>
          <NavLink to="/operator/habitaciones" style={linkButton}>
            Ir a habitaciones
          </NavLink>
        </article>

        <article style={cardStyle}>
          <h3 style={cardTitle}>Reservas</h3>
          <p style={cardText}>
            Revisá las reservas activas, futuras y pasadas. Controlá check-in y
            check-out.
          </p>
          <NavLink to="/operator/reservas" style={linkButton}>
            Ir a reservas
          </NavLink>
        </article>

        <article style={cardStyle}>
          <h3 style={cardTitle}>Historial de huésped</h3>
          <p style={cardText}>
            Buscá un huésped por DNI o email y consultá todas sus estadías en
            el hotel.
          </p>
          <NavLink to="/operator/historial" style={linkButton}>
            Ver historial
          </NavLink>
        </article>
      </section>

      {/* Acá se muestran las rutas hijas (/habitaciones, /reservas, /historial) */}
      <section style={contentStyle}>
        <Outlet />
      </section>
    </main>
  );
}
