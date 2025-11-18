// src/services/Operator.js

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE = `${BASE}/api`;
const LOCAL_KEY = "cadizz_auth_v1";

// ============================
// 🔐 Token desde localStorage
// ============================
function getTokenFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return "";
    const saved = JSON.parse(raw);
    return saved?.token || "";
  } catch {
    return "";
  }
}

// ============================
// 🧱 Headers con Authorization
// ============================
function buildHeaders(extra = {}) {
  const token = getTokenFromStorage();
  const h = { "Content-Type": "application/json", ...extra };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// ============================
// 🌐 Wrapper para fetch JSON
// ============================
async function jsonFetch(path, opts = {}) {
  const url = path.startsWith("http") ? path : API_BASE + path;

  const res = await fetch(url, {
    credentials: "include",
    ...opts,
    headers: { ...buildHeaders(opts.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Error");

  return data;
}

// ============================
// GET con query params
// ============================
async function get(path, { params } = {}) {
  let url = path;

  if (params && Object.keys(params).length > 0) {
    const u = new URL(API_BASE + path);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) {
        u.searchParams.append(k, v);
      }
    });
    url = u.toString();
    return jsonFetch(url);
  }

  return jsonFetch(url);
}

// ============================
// POST JSON
// ============================
async function post(path, body = {}) {
  return jsonFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const operatorApi = {
  // ================================================================
  // 🔥 MAPA REAL DE HABITACIONES FÍSICAS (101, 102, 201, 202, etc.)
  // ================================================================
  getRealRoomsMap(date) {
    return get("/operator/real-rooms/map", {
      params: { date },
    });
  },

  // ================================================================
  // 🔥 TOGGLE (ABRIR / CERRAR) HABITACIÓN FÍSICA
  // ================================================================
  togglePhysicalRoom(physicalRoomId) {
    return post(`/operator/real-rooms/${physicalRoomId}/toggle`);
  },

  // ================================================================
  // 3.b) Consultar reservas
  // ================================================================
  getReservations(filters = {}) {
    return get("/operator/reservations", { params: filters });
  },

  // ================================================================
  // 3.b) Liberar reserva
  // ================================================================
  releaseReservation(id) {
    return post(`/operator/reservations/${id}/release`);
  },

  // ================================================================
  // 3.d) Marcar como pagada
  // ================================================================
  markAsPaid(id, data = {}) {
    return post(`/operator/reservations/${id}/pay`, data);
  },

  // ================================================================
  // 4) Historial huésped
  // ================================================================
  getUserHistory(userId) {
    return get(`/operator/guest/${userId}/history`);
  },
};
