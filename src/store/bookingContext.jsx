// src/store/bookingContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ROOMS } from "../data/rooms";

const BookingContext = createContext();

const dateKey = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
const rangeDays = (checkin, checkout) => {
  const start = new Date(checkin), end = new Date(checkout);
  const days = [];
  for (let d = new Date(start); d < end; d.setDate(d.getDate()+1)) {
    days.push(dateKey(d));
  }
  return days;
};

const LOCAL_KEY = "cadizz_reservas_v1";
// Estructura de reservas por habitación y fecha: { [roomId]: { [YYYY-MM-DD]: cantidadReservada } }

export function BookingProvider({ children }) {
  const [rooms] = useState(ROOMS);
  const [reservas, setReservas] = useState({}); // estado en memoria

  // Persistencia simple (demo)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setReservas(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(reservas));
    } catch {}
  }, [reservas]);

  const getRoom = (id) => rooms.find(r => r.id === id);

  const disponibilidad = (roomId, checkin, checkout) => {
    const room = getRoom(roomId);
    if (!room || !checkin || !checkout) return { ok: false, faltante: 0 };
    const dias = rangeDays(checkin, checkout);
    if (!dias.length) return { ok: false, faltante: 0 };
    const porFecha = reservas[roomId] || {};
    // disponibilidad = stock - reservadas ese día; debe ser >= 1 para TODOS los días
    const minDisp = Math.min(...dias.map(d => room.stock - (porFecha[d] || 0)));
    return { ok: minDisp >= 1, faltante: Math.max(0, 1 - minDisp) };
  };

  const confirmarReserva = ({ roomId, checkin, checkout, huespedes, nombre, email, total }) => {
    const dias = rangeDays(checkin, checkout);
    setReservas(prev => {
      const next = { ...prev, [roomId]: { ...(prev[roomId] || {}) } };
      dias.forEach(d => {
        next[roomId][d] = (next[roomId][d] || 0) + 1;
      });
      return next;
    });
    return true;
  };

  const value = useMemo(() => ({
    rooms, reservas, getRoom, disponibilidad, confirmarReserva
  }), [rooms, reservas]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export const useBooking = () => useContext(BookingContext);
