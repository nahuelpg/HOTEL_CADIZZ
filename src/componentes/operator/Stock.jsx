// src/componentes/operator/Stock.jsx
import { useEffect, useState } from "react";
import { Panel } from "./Panel";

export default function OpStock() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStock = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/operator/rooms-stock");
      const data = await res.json();

      if (!data.rooms) {
        throw new Error("Datos inválidos del servidor");
      }

      setRooms(data.rooms);
    } catch (err) {
      console.error("Error loading stock:", err);
      setError("No se pudo cargar el stock de habitaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const pillEstado = (estado) => {
    if (estado === "completa")
      return (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "999px",
            background: "#fee2e2",
            color: "#b91c1c",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          🔴 Completa
        </span>
      );

    if (estado === "parcial")
      return (
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "999px",
            background: "#fef9c3",
            color: "#a16207",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          🟡 Parcial
        </span>
      );

    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "999px",
          background: "#dcfce7",
          color: "#166534",
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        🟢 Libre
      </span>
    );
  };

  const cell = {
    padding: 14,
    fontSize: 15,
    fontWeight: 500,
    color: "#1f2937",
  };

  return (
    <Panel title="Stock de Habitaciones">
      {loading && <p style={{ textAlign: "center" }}>Cargando stock...</p>}

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 20 }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "#ffffffcc",
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                background: "#f1f5f9",
                color: "#1e3a8a",
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <tr>
                <th style={{ ...cell, paddingLeft: 16 }}>Hab.</th>
                <th style={cell}>Stock Total</th>
                <th style={cell}>Ocupadas Hoy</th>
                <th style={cell}>Disponibles</th>
                <th style={cell}>Estado</th>
              </tr>
            </thead>

            <tbody>
              {rooms.map((r) => (
                <tr
                  key={r.id}
                  style={{ transition: "0.2s", background: "white" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <td style={{ ...cell, paddingLeft: 16 }}>{r.name}</td>
                  <td style={cell}>{r.stock_total}</td>
                  <td style={cell}>{r.stock_ocupado}</td>
                  <td style={cell}>{r.stock_disponible}</td>
                  <td style={cell}>{pillEstado(r.estado)}</td>
                </tr>
              ))}

              {rooms.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 30 }}>
                    No hay habitaciones cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
