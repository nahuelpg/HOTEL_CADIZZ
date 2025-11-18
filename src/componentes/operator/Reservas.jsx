// src/componentes/operator/Reservas.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { operatorApi } from "../../services/Operator";
import { Panel } from "./Panel";

export default function OpReservas() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [dni, setDni] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // 3.b) Consultar reservas
  // ================================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};
      if (query.trim()) filters.q = query.trim();
      if (dni.trim()) filters.dni = dni.trim();
      if (from) filters.from = from;
      if (to) filters.to = to;

      const data = await operatorApi.getReservations(filters);
      setRows(data?.reservations || []);
    } catch (e) {
      console.error("Error al cargar reservas:", e);
      setError(e.message || "No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================================
  // 3.b) Liberar reserva
  // ================================
  const handleRelease = async (id) => {
    if (!window.confirm("⚠️ ¿Deseás LIBERAR esta reserva?")) return;
    try {
      await operatorApi.releaseReservation(id);
      alert("Reserva liberada correctamente.");
      fetchData();
    } catch (e) {
      console.error("Error al liberar:", e);
      alert("Error al liberar la reserva.");
    }
  };

  // ================================
  // 3.d) Procesar pago
  // ================================
  const handlePay = async (id) => {
    if (!window.confirm("¿Confirmar el PAGO de esta reserva?")) return;
    try {
      await operatorApi.markAsPaid(id);
      alert("Pago registrado.");
      fetchData();
    } catch (e) {
      console.error("Error al procesar el pago:", e);
      alert("Error al procesar el pago.");
    }
  };

  // ================================
  // FACTURA
  // ================================
  const handleFactura = (reservation) => {
    navigate("/factura-reserva", {
      state: { reservation },
    });
  };

  // ================================
  // Helpers visuales (solo diseño)
  // ================================
  const badge = (text, bg, color) => (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {text}
    </span>
  );

  const renderStatus = (r) => {
    if (r.status === "canceled")
      return badge("Cancelada", "#ffe2e2", "#b91c1c");
    if (r.status === "released")
      return badge("Liberada", "#fff7c2", "#92400e");
    return badge("Activa", "#dcfce7", "#166534");
  };

  const renderPayment = (r) => {
    if (r.payment_status === "paid")
      return badge("Pagada", "#dcfce7", "#166534");
    return badge("Pendiente", "#fff7c2", "#92400e");
  };

  // ================================
  // RENDER
  // ================================
  return (
    <Panel title="Gestión de Reservas (Operador)">
      {/* Cabecera */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>
          Usuario: <strong>{user?.name}</strong> ({user?.role})
        </p>

        <p style={{ margin: 0, fontSize: 14, color: "#cbd5e1" }}>
          Total resultados:{" "}
          <strong style={{ color: "#38bdf8" }}>{rows.length}</strong>
        </p>
      </div>

      {/* FILTROS ESTILO PRO */}
      <div
        style={{
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
          background: "rgba(15,23,42,0.8)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {/* FECHA DESDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}
          >
            Desde
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={inputStyle()}
          />
        </div>

        {/* FECHA HASTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}
          >
            Hasta
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={inputStyle()}
          />
        </div>

        {/* DNI */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}
          >
            DNI
          </label>
          <input
            placeholder="DNI exacto"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            style={inputStyle()}
          />
        </div>

        {/* BÚSQUEDA */}
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label
            style={{ fontSize: 12, textTransform: "uppercase", opacity: 0.7 }}
          >
            Búsqueda
          </label>
          <input
            placeholder="Nombre, email, habitación, id..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={inputStyle(14)}
          />
        </div>

        {/* BOTÓN */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button style={btnFilter()} onClick={fetchData}>
            {loading ? "Buscando..." : "Aplicar filtros"}
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(2,6,23,0.85)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        }}
      >
        {error && (
          <p style={{ color: "red", padding: 10, textAlign: "center" }}>
            {error}
          </p>
        )}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 1100,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(30,41,59,0.9)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  textTransform: "uppercase",
                }}
              >
                <th style={th()}>ID</th>
                <th style={th()}>Cliente</th>
                <th style={th()}>DNI</th>
                <th style={th()}>Email</th>
                <th style={th()}>Hab.</th>
                <th style={th()}>Check-in</th>
                <th style={th()}>Check-out</th>
                <th style={th()}>Total</th>
                <th style={th()}>Estado</th>
                <th style={th()}>Pago</th>
                <th style={{ ...th(), minWidth: 260 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, index) => (
                <tr
                  key={r.id}
                  style={{
                    background: index % 2 === 0 ? "#0f172a" : "#1e293b",
                    color: "#e2e8f0",
                    transition: "0.2s",
                  }}
                >
                  <td style={td()}>{r.id}</td>
                  <td style={td()}>{r.guest_name}</td>
                  <td style={td()}>{r.dni}</td>
                  <td style={td()}>
                    <a
                      href={`mailto:${r.guest_email}`}
                      style={{ color: "#38bdf8" }}
                    >
                      {r.guest_email}
                    </a>
                  </td>
                  <td style={td()}>{r.room_name}</td>
                  <td style={td()}>{r.checkin}</td>
                  <td style={td()}>{r.checkout}</td>
                  <td style={td()}>${r.total}</td>
                  <td style={td()}>{renderStatus(r)}</td>
                  <td style={td()}>{renderPayment(r)}</td>

                  <td style={td({ display: "flex", gap: 8, flexWrap: "wrap" })}>
                    {/* LIBERAR */}
                    {(!r.status || r.status === "active") && (
                      <button style={btnDanger()} onClick={() => handleRelease(r.id)}>
                        Liberar
                      </button>
                    )}

                    {/* PAGAR */}
                    {r.payment_status !== "paid" &&
                      (!r.status || r.status === "active") && (
                        <button style={btnSuccess()} onClick={() => handlePay(r.id)}>
                          Pagar
                        </button>
                      )}

                    {/* FACTURA */}
                    <button style={btnWarning()} onClick={() => handleFactura(r)}>
                      Factura
                    </button>

                    {/* MAIL */}
                    <a
                      href={`mailto:${r.guest_email}`}
                      style={btnOutline()}
                    >
                      Mail
                    </a>
                  </td>
                </tr>
              ))}

              {!rows.length && !loading && (
                <tr>
                  <td colSpan={11} style={{ padding: 30, textAlign: "center" }}>
                    Sin resultados para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
}

/* ============================
    ESTILOS REUTILIZABLES
============================ */
function inputStyle(font = 13) {
  return {
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(2,6,23,0.8)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    fontSize: font,
    outline: "none",
  };
}

function btnFilter() {
  return {
    padding: "10px 26px",
    borderRadius: 999,
    background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    color: "white",
    fontWeight: 600,
    border: "none",
    boxShadow: "0 6px 18px rgba(14,165,233,0.45)",
    cursor: "pointer",
    letterSpacing: "0.03em",
  };
}

function btnDanger() {
  return {
    padding: "5px 14px",
    borderRadius: 999,
    background: "#dc2626",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  };
}

function btnSuccess() {
  return {
    padding: "5px 14px",
    borderRadius: 999,
    background: "#16a34a",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  };
}

function btnWarning() {
  return {
    padding: "5px 14px",
    borderRadius: 999,
    background: "#facc15",
    color: "#473900",
    fontSize: 12,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
  };
}

function btnOutline() {
  return {
    padding: "5px 14px",
    borderRadius: 999,
    background: "transparent",
    border: "1px solid #38bdf8",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
  };
}

function th() {
  return {
    padding: "12px 10px",
    textAlign: "left",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  };
}

function td(extra = {}) {
  return {
    padding: "12px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    ...extra,
  };
}