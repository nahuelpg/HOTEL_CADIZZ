// src/componentes/operator/HistorialHuesped.jsx
import React from "react";
import { Panel } from "./Panel";

export default function HistorialHuesped() {
  // tu lógica actual: dni, history, loading, error, handleSearch...

  const history = []; // 🔴 BORRAR y usar tu state real

  return (
    <Panel title="Historial del huésped">
      {/* Buscador por DNI */}
      <div
        style={{
          background: "rgba(15,23,42,0.85)",
          borderRadius: "14px",
          padding: "16px 18px",
          marginBottom: "14px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              color: "#e5e7eb",
              marginBottom: "4px",
            }}
          >
            DNI del huésped
          </label>
          {/* <input value={dni} onChange=... /> */}
          <input
            type="text"
            placeholder="Ej: 38765432"
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #64748b",
              outline: "none",
            }}
          />
        </div>

        <button
          // onClick={handleSearch}
          style={{
            background: "#22c55e",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Buscar
        </button>
      </div>

      {/* Resultados en tarjeta PRO */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "16px",
            padding: "18px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            minWidth: "70%",
            maxWidth: "1000px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9", color: "#334155" }}>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Reserva
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Habitación
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Check-in
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Check-out
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Estado
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item.reservationId}
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.01)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  <td style={{ padding: "8px 10px" }}>{item.reservationId}</td>
                  <td style={{ padding: "8px 10px" }}>
                    {item.roomNumber || item.roomId}
                  </td>
                  <td style={{ padding: "8px 10px" }}>{item.checkIn}</td>
                  <td style={{ padding: "8px 10px" }}>{item.checkOut}</td>
                  <td style={{ padding: "8px 10px" }}>
                    {item.status || "—"}
                  </td>
                  <td style={{ padding: "8px 10px" }}>
                    {item.totalPrice
                      ? `$ ${Number(item.totalPrice).toFixed(2)}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}
