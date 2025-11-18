// src/componentes/Reserva.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authContext";
import { api } from "../services/api";

export default function Reserva() {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialRoomId = location.state?.roomId || "";

  // Paso 1
  const [roomId, setRoomId] = useState(initialRoomId);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);

  // Paso 2
  const [guestName, setGuestName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Errores por campo
  const [errors, setErrors] = useState({});

  // USD formatter
  const formatUSD = (v) =>
    Number(v).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  // Calcular noches
  const nights = checkin && checkout ? 
    Math.max(
      1,
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    )
    : 0;

  // PRECIOS
  const prices = { std: 50, dbl: 80, sui: 120 };
  const pricePerNight = prices[roomId] || 0;
  const subtotal = nights * pricePerNight;
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  const validateStep1 = () => {
    const err = {};
    if (!roomId) err.roomId = "Elegí una habitación.";
    if (!checkin) err.checkin = "Elegí fecha de entrada.";
    if (!checkout) err.checkout = "Elegí fecha de salida.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err = {};

    if (!guestName.trim()) err.guestName = "Ingresá el nombre.";
    if (!dni.match(/^\d{7,9}$/)) err.dni = "DNI inválido.";
    if (!phone.match(/^\+?\d{6,15}$/)) err.phone = "Teléfono inválido.";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const goNext = (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const reservation = await api.createReservation({
        token,
        roomId,
        checkin,
        checkout,
        guests,
        dni,
        phone,
        guestName,
        address,
        city,
        notes,
      });

      navigate("/factura-reserva", { state: { reservation } });
    } catch (err) {
      console.error(err);
      alert("Error al crear reserva.");
    } finally {
      setLoading(false);
    }
  };

  const errorText = { color: "red", fontSize: "0.85rem", marginTop: "3px" };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Reservar habitación</h2>

      {/* ===== PASO 1 ===== */}
      {step === 1 && (
        <form onSubmit={goNext}>
          <h3>Paso 1: Datos de la estadía</h3>

          {/* Habitación */}
          <label>
            Habitación
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="std / dbl / sui..."
              style={{ width: "100%" }}
            />
          </label>
          {errors.roomId && <p style={errorText}>{errors.roomId}</p>}

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>
                Check-in
                <input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
              {errors.checkin && <p style={errorText}>{errors.checkin}</p>}
            </div>

            <div style={{ flex: 1 }}>
              <label>
                Check-out
                <input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
              {errors.checkout && <p style={errorText}>{errors.checkout}</p>}
            </div>
          </div>

          {/* Huespedes */}
          <label>
            Huéspedes
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              style={{ width: 200 }}
            />
          </label>

          {/* Totales */}
          {nights > 0 && (
            <div style={{ marginTop: 15 }}>
              <p>Noches: <strong>{nights}</strong></p>
              <p>Subtotal: <strong>{formatUSD(subtotal)}</strong></p>
              <p>Impuestos 15%: <strong>{formatUSD(taxes)}</strong></p>
              <p>Total: <strong>{formatUSD(total)}</strong></p>
            </div>
          )}

          <button type="submit" style={{ marginTop: 15 }}>
            Continuar
          </button>
        </form>
      )}

      {/* ===== PASO 2 ===== */}
      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h3>Paso 2: Datos del huésped</h3>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <label>
            Nombre completo
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
          {errors.guestName && <p style={errorText}>{errors.guestName}</p>}

          <label>
            DNI
            <input
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
          {errors.dni && <p style={errorText}>{errors.dni}</p>}

          <label>
            Teléfono
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
          {errors.phone && <p style={errorText}>{errors.phone}</p>}

          <label>
            Dirección
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Ciudad
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Notas
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setStep(1)}>
              Volver
            </button>
            <button type="submit" disabled={loading}>
              Confirmar reserva
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
