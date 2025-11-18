// src/componentes/Perfil.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../store/authContext";

export default function Perfil() {
  const { user, token, logout } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);

  // 🔁 cargar reservas del usuario
  async function cargarReservas() {
    setError("");
    setLoading(true);
    try {
      const data = await api.myReservations(token);
      setReservas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando reservas:", e);
      setError(e.message || "No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) cargarReservas();
  }, [token]);

  // ❌ cancelar reserva
  async function cancelarReserva(id) {
    const confirmar = window.confirm("¿Seguro que querés cancelar esta reserva?");
    if (!confirmar) return;
    setCanceling(true);
    try {
      await api.cancelMyReservation(token, id);
      await cargarReservas(); // refrescar lista
    } catch (e) {
      alert(e.message || "No se pudo cancelar la reserva.");
    } finally {
      setCanceling(false);
    }
  }

  if (!user) {
    return (
      <section className="wrap">
        <h1 className="section-title">Perfil</h1>
        <p>No hay sesión activa.</p>
        <button className="btn" onClick={logout}>Cerrar sesión</button>
      </section>
    );
  }

  return (
    <section className="wrap" style={{ maxWidth: 720 }}>
      <h1 className="section-title">👤 {user.name}</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        {user.email}
      </p>

      {loading && <p>Cargando reservas...</p>}
      {error && <p className="err">{error}</p>}

      {!loading && reservas.length === 0 && !error && (
        <p className="muted">No tenés reservas todavía.</p>
      )}

      {!loading && reservas.length > 0 && (
        <div className="grid" style={{ gap: 12 }}>
          {reservas.map((r) => (
            <div key={r.id} className="card p" style={{ position: "relative" }}>
              <h3>{r.room_name}</h3>
              <p>
                <b>Check-in:</b> {r.checkin} <br />
                <b>Check-out:</b> {r.checkout} <br />
                <b>Noches:</b> {r.nights} <br />
                <b>Total:</b> ${r.total.toFixed(2)} <br />
                <b>Estado:</b>{" "}
                <span
                  style={{
                    color:
                      r.status === "canceled"
                        ? "red"
                        : r.status === "active"
                        ? "green"
                        : "#666",
                  }}
                >
                  {r.status}
                </span>
              </p>

              {r.status === "active" && (
                <button
                  className="btn-secondary"
                  disabled={canceling}
                  onClick={() => cancelarReserva(r.id)}
                >
                  {canceling ? "Cancelando..." : "Cancelar"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
