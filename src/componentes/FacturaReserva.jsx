// src/componentes/FacturaReserva.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authContext";

export default function FacturaReserva() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const reservation = location.state?.reservation;

  // Si no llega nada en state
  if (!reservation) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1120",
          padding: 20,
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at top left,#1f2937,#020617 80%)",
            padding: "24px 28px",
            borderRadius: 16,
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            maxWidth: 420,
            textAlign: "center",
            color: "#e5e7eb",
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <h2 style={{ marginBottom: 10, fontSize: 20 }}>
            No hay datos de reserva
          </h2>
          <p style={{ marginBottom: 16, color: "#cbd5f5", fontSize: 14 }}>
            Volvé al inicio y seleccioná una reserva para ver su factura.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 10px 25px rgba(56,189,248,0.5)",
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // ================== FORMATEOS ==================
  const formatUSD = (v) =>
    Number(v).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  // 👉 Intentamos usar la fecha/hora que venga de la BD
  const rawEmitted =
    reservation.emitted_at ||
    reservation.emission_at ||
    reservation.created_at ||
    reservation.createdAt ||
    null;

  let emisionFecha = "";
  let emisionHora = "";

  if (rawEmitted) {
    const iso = rawEmitted.replace(" ", "T"); // "2025-11-17 01:23:00" -> "2025-11-17T01:23:00"
    const dUtc = new Date(iso + "Z"); // forzamos a UTC

    if (!isNaN(dUtc.getTime())) {
      const optsBase = {
        timeZone: "America/Argentina/Buenos_Aires",
      };

      emisionFecha = dUtc.toLocaleDateString("es-AR", optsBase);
      emisionHora = dUtc.toLocaleTimeString("es-AR", {
        ...optsBase,
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Si por algún motivo no pudimos parsear, usamos "ahora" como backup
  if (!emisionFecha || !emisionHora) {
    const now = new Date();
    emisionFecha = now.toLocaleDateString("es-AR");
    emisionHora = now.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Campos de la reserva
  const {
    id,
    roomId,
    room_id,
    room_name,
    checkin,
    checkout,
    nights,
    subtotal,
    taxes,
    total,
    dni,
    phone,
    guest_name,
    guests,
    address,
    city,
    notes,
    guest_email,
  } = reservation;

  const email = guest_email || user?.email;
  const room = room_name || roomId || room_id;

  // Intentamos detectar posibles nombres de campo de hora
  const rawCheckinTime =
    reservation.checkin_time ||
    reservation.checkinTime ||
    reservation.checkin_hour ||
    reservation.checkinHour ||
    "";

  const rawCheckoutTime =
    reservation.checkout_time ||
    reservation.checkoutTime ||
    reservation.checkout_hour ||
    reservation.checkoutHour ||
    "";

  // ⏰ Horarios por defecto (solo estética, sin modificar la lógica)
  const DEFAULT_CHECKIN_HOUR = "14:00";
  const DEFAULT_CHECKOUT_HOUR = "10:00";

  const checkinDisplay = rawCheckinTime || DEFAULT_CHECKIN_HOUR;
  const checkoutDisplay = rawCheckoutTime || DEFAULT_CHECKOUT_HOUR;

  // 🎫 Código de reserva (estético)
  const reservationCode =
    reservation.code ||
    reservation.reservation_code ||
    reservation.booking_code ||
    (id != null ? `CDZ-${String(id).padStart(6, "0")}` : "CDZ-SIN-CODIGO");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left,#020617,#0b1120 45%,#020617 100%)",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 20,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* ENCABEZADO */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            background:
              "linear-gradient(135deg,#0f172a 0%,#020617 45%,#111827 100%)",
            color: "#e5e7eb",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.6rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              CADIZZ HOTEL
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                color: "#9ca3af",
                fontSize: 13,
              }}
            >
              Comprobante de reserva
            </p>
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: 13,
              color: "#e5e7eb",
              lineHeight: 1.6,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <strong>N° interno:</strong>{" "}
              {id != null ? `#${id}` : "-"}
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong>Código de reserva:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  color: "#ecfdf5",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  fontSize: 12,
                }}
              >
                {reservationCode}
              </span>
            </div>
            <div>
              <strong>Emitido por:</strong> {user?.name || "Operador"}
            </div>
            <div>
              <strong>Fecha de emisión:</strong> {emisionFecha}
            </div>
            <div>
              <strong>Hora de emisión:</strong> {emisionHora} hs
            </div>
          </div>
        </div>

        {/* CUERPO PRINCIPAL */}
        <div style={{ padding: "20px 24px" }}>
          {/* DATOS PRINCIPALES EN DOS COLUMNAS */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {/* Datos huésped */}
            <div
              style={{
                flex: 1,
                minWidth: 260,
                borderRight: "1px solid #e5e7eb",
                paddingRight: 12,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 8,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6b7280",
                }}
              >
                Datos del huésped
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#111827",
                  lineHeight: 1.6,
                }}
              >
                <strong>Nombre:</strong> {guest_name}
                <br />
                <strong>Email:</strong> {email}
                <br />
                <strong>DNI:</strong> {dni}
                <br />
                <strong>Teléfono:</strong> {phone || "-"}
                <br />
                <strong>Dirección:</strong> {address || "-"}
                <br />
                <strong>Ciudad:</strong> {city || "-"}
              </p>
            </div>

            {/* Datos reserva */}
            <div
              style={{
                flex: 1,
                minWidth: 260,
                paddingLeft: 12,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 8,
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6b7280",
                }}
              >
                Datos de la reserva
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "#111827",
                  lineHeight: 1.6,
                }}
              >
                <strong>Habitación:</strong> {room}
                <br />
                <strong>Check-in:</strong> {checkin}
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {checkinDisplay} hs
                </span>
                <br />
                <strong>Check-out:</strong> {checkout}
                <span
                  style={{
                    marginLeft: 8,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#fef3c7",
                    color: "#92400e",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {checkoutDisplay} hs
                </span>
                <br />
                <strong>Noches:</strong> {nights}
                <br />
                <strong>Huéspedes:</strong> {guests}
              </p>
            </div>
          </div>

          {/* SECCIÓN IMPORTES */}
          <div
            style={{
              marginBottom: 20,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              background:
                "linear-gradient(135deg,#f9fafb 0%,#eef2ff 100%)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 15,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#4b5563",
              }}
            >
              Detalle de importes
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 8,
                fontSize: 14,
              }}
            >
              <div>
                <div>
                  Subtotal: <strong>{formatUSD(subtotal)}</strong>
                </div>
                <div>
                  Impuestos: <strong>{formatUSD(taxes)}</strong>
                </div>
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  marginLeft: "auto",
                }}
              >
                Total:{" "}
                <span
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg,#111827,#020617)",
                    color: "white",
                  }}
                >
                  {formatUSD(total)}
                </span>
              </div>
            </div>
          </div>

          {/* NOTAS */}
          <div
            style={{
              marginBottom: 22,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px dashed #d1d5db",
              background: "#f9fafb",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 6,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#6b7280",
              }}
            >
              Notas
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
              {notes && notes.trim() ? notes : "-"}
            </p>
          </div>

          {/* BOTONES ACCIONES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 10,
            }}
          >
            <button
              onClick={() => window.print()}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg,#111827,#020617)",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                boxShadow: "0 10px 24px rgba(15,23,42,0.5)",
              }}
            >
              Imprimir
            </button>

            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#374151",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
