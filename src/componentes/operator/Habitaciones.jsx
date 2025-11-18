// src/componentes/operator/Habitaciones.jsx
import React, { useState, useEffect } from "react";
import { operatorApi } from "../../services/Operator";
import { Panel } from "./Panel";

export default function OpHabitaciones() {
  const [rooms, setRooms] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | std | dbl | sui
  const [savingId, setSavingId] = useState(null);

  // =========================
  // CARGAR MAPA REAL (101, 102, ...)
  // =========================
  const fetchRealMap = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await operatorApi.getRealRoomsMap(date);
      setRooms(data.rooms || []);
    } catch (e) {
      console.error("Error al cargar mapa real:", e);
      setError("Error al cargar disponibilidad real de habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  // ABRIR / CERRAR HABITACIÓN
  // =========================
  const handleToggleOpen = async (room) => {
    const isCurrentlyClosed =
      room.estado === "CERRADA" || room.is_open === 0 || room.is_open === false;
    const newIsOpen = isCurrentlyClosed; // true si estaba cerrada, false si estaba abierta
    const accion = newIsOpen ? "ABRIR" : "CERRAR";

    if (
      !window.confirm(
        `¿Seguro que querés ${accion} la habitación "${room.code}"?`
      )
    ) {
      return;
    }

    try {
      setSavingId(room.id);

      // usamos el id de la tabla rooms (la misma que usás en el mapa real)
      const targetId = room.id;

      await operatorApi.togglePhysicalRoom(room.id);

      // recargamos el mapa con la fecha actual
      await fetchRealMap();
    } catch (e) {
      console.error("Error al abrir/cerrar habitación:", e);
      alert(e.message || "No se pudo cambiar el estado de la habitación.");
    } finally {
      setSavingId(null);
    }
  };

  // =========================
  // FILTROS EN MEMORIA
  // =========================
  const filteredRooms =
    filterType === "all"
      ? rooms
      : rooms.filter((r) => r.type === filterType);

  const floors = Array.from(new Set(filteredRooms.map((r) => r.floor))).sort(
    (a, b) => a - b
  );

  // =========================
  // BADGE DE ESTADO
  // =========================
  const estadoBadge = (estado) => {
    const map = {
      LIBRE: { bg: "#dcfce7", color: "#166534" },
      OCUPADA: { bg: "#fee2e2", color: "#991b1b" },
      CERRADA: { bg: "#e2e8f0", color: "#111827" },
    };
    const s = map[estado] || map.LIBRE;

    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: "4px 10px",
          borderRadius: "999px",
          fontWeight: 700,
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {estado}
      </span>
    );
  };

  if (loading) {
    return (
      <Panel title="Mapa real de habitaciones">
        <p style={{ color: "#e5e7eb" }}>Cargando mapa real...</p>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel title="Mapa real de habitaciones">
        <p style={{ color: "#fecaca" }}>{error}</p>
      </Panel>
    );
  }

  return (
    <Panel title="Mapa real de habitaciones (101, 102, 201, etc.)">
      {/* CONTROLES SUPERIORES */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {/* Fecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid #1f2937",
              background: "#020617",
              fontSize: "13px",
              color: "#e5e7eb",
            }}
          />
        </div>

        <button
          onClick={fetchRealMap}
          style={{
            marginTop: "18px",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "none",
            background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
            color: "white",
            fontWeight: 700,
            fontSize: "13px",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(15,23,42,0.45)",
          }}
        >
          Actualizar
        </button>

        {/* Filtro por tipo */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            marginLeft: "auto",
          }}
        >
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Filtrar tipo:</span>
          {[
            { id: "all", label: "Todos" },
            { id: "std", label: "Standard" },
            { id: "dbl", label: "Doble" },
            { id: "sui", label: "Suite" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border:
                  filterType === t.id ? "1px solid #0ea5e9" : "1px solid #1f2937",
                background:
                  filterType === t.id ? "rgba(14,165,233,0.16)" : "#020617",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: filterType === t.id ? 700 : 500,
                color: filterType === t.id ? "#e5e7eb" : "#9ca3af",
                boxShadow:
                  filterType === t.id
                    ? "0 4px 10px rgba(15,23,42,0.45)"
                    : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEYENDA */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          fontSize: 12,
          color: "#94a3b8",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 600 }}>Leyenda:</span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "999px",
              background: "#22c55e",
              marginRight: 4,
            }}
          ></span>
          Libre
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "999px",
              background: "#ef4444",
              marginRight: 4,
            }}
          ></span>
          Ocupada
        </span>
        <span>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "999px",
              background: "#94a3b8",
              marginRight: 4,
            }}
          ></span>
          Cerrada
        </span>
      </div>

      {/* GRID POR PISO */}
      {floors.map((floor) => (
        <div key={floor} style={{ marginBottom: 18 }}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 15,
              fontWeight: 700,
              color: "#e5e7eb",
            }}
          >
            Piso {floor}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "10px",
            }}
          >
            {filteredRooms
              .filter((r) => r.floor === floor)
              .map((room) => {
                const estado = room.estado; // LIBRE / OCUPADA / CERRADA

                let bg = "#22c55e";
                let border = "1px solid #16a34a";

                if (estado === "OCUPADA") {
                  bg = "#fecaca";
                  border = "1px solid #f97373";
                } else if (estado === "CERRADA") {
                  bg = "#e5e7eb";
                  border = "1px solid #cbd5e1";
                }

                const isClosed =
                  estado === "CERRADA" ||
                  room.is_open === 0 ||
                  room.is_open === false;

                return (
                  <div
                    key={room.id}
                    style={{
                      background:
                        "linear-gradient(145deg,#020617,#0b1120 40%,#020617)",
                      borderRadius: 12,
                      padding: "10px 10px 8px",
                      boxShadow: "0 6px 18px rgba(15,23,42,0.65)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      transition: "0.18s",
                      border: "1px solid rgba(148,163,184,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 26px rgba(15,23,42,0.8)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 18px rgba(15,23,42,0.65)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: "#f9fafb",
                        }}
                      >
                        {room.code}
                      </span>
                      {estadoBadge(estado)}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#cbd5e1",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <span>{room.type_name}</span>
                      <span>Piso {room.floor}</span>
                    </div>

                    {/* indicador de color grande */}
                    <div
                      style={{
                        marginTop: 6,
                        background: bg,
                        border,
                        borderRadius: 999,
                        height: 8,
                      }}
                    ></div>

                    {/* Botón abrir/cerrar */}
                    <button
                      onClick={() => handleToggleOpen(room)}
                      disabled={savingId === room.id}
                      style={{
                        marginTop: 6,
                        alignSelf: "stretch",
                        padding: "5px 6px",
                        borderRadius: 999,
                        border: "none",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: isClosed
                          ? "linear-gradient(135deg,#22c55e,#16a34a)" // Abrir
                          : "linear-gradient(135deg,#dc2626,#b91c1c)", // Cerrar
                        color: "#f9fafb",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.55)",
                      }}
                    >
                      {savingId === room.id
                        ? "Guardando..."
                        : isClosed
                        ? "Abrir habitación"
                        : "Cerrar habitación"}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {filteredRooms.length === 0 && (
        <p style={{ marginTop: 12, fontSize: 14, color: "#cbd5e1" }}>
          No hay habitaciones para los filtros seleccionados.
        </p>
      )}
    </Panel>
  );
}
