// src/services/Admin.js

const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE = `${BASE}/api`;
const LOCAL_KEY = "cadizz_auth_v1";

// =====================
// Helpers de token + headers
// =====================
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

function buildHeaders(extra = {}) {
  const token = getTokenFromStorage();
  const clean = token ? token.replace(/^Bearer\s+/i, "").trim() : "";
  const h = { "Content-Type": "application/json", ...extra };
  if (clean) h.Authorization = `Bearer ${clean}`;
  return h;
}

// =====================
// Helper de fetch JSON
// =====================
async function jsonFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  const ct = res.headers.get("content-type") || "";
  let data = null;

  if (ct.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  } else {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Respuesta no JSON (${res.status}). URL=${url}. Inicio: ${text.slice(
        0,
        80
      )}`
    );
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Error ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// =====================
// API ADMIN
// =====================
export const adminApi = {
  // ─────────────────────────────
  // CRUD HABITACIONES (TIPOS)
  // ─────────────────────────────

  async getRooms() {
    const url = `${API_BASE}/admin/rooms`;
    return jsonFetch(url, {
      headers: buildHeaders(),
    });
  },

  async createRoom(payload) {
    const url = `${API_BASE}/admin/rooms`;
    return jsonFetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
  },

  async updateRoom(id, payload) {
    const url = `${API_BASE}/admin/rooms/${id}`;
    return jsonFetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
  },

  async deleteRoom(id) {
    const url = `${API_BASE}/admin/rooms/${id}`;
    return jsonFetch(url, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  },

  // ─────────────────────────────
  // RESÚMEN / RESERVAS / STOCK
  // ─────────────────────────────

  async overview() {
    const url = `${API_BASE}/admin/overview`;
    return jsonFetch(url, {
      headers: buildHeaders(),
    });
  },

  async reservations({ from, to, query } = {}) {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    if (query) q.set("query", query);

    const url = `${API_BASE}/admin/reservations?${q.toString()}`;
    return jsonFetch(url, {
      headers: buildHeaders(),
    });
  },

  async cancelReservation(id) {
    const url = `${API_BASE}/admin/reservations/${id}/cancel`;
    return jsonFetch(url, {
      method: "POST",
      headers: buildHeaders(),
    });
  },

  async updateStock(roomId, stock) {
    const url = `${API_BASE}/admin/rooms/${roomId}/stock`;
    return jsonFetch(url, {
      method: "PATCH",
      headers: buildHeaders(),
      body: JSON.stringify({ stock }),
    });
  },

  async addBlocks(roomId, days, qty = 1) {
    const url = `${API_BASE}/admin/blocks`;
    return jsonFetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ roomId, days, qty }),
    });
  },

  // ─────────────────────────────
  // CRUD OPERADORES
  // ─────────────────────────────

  // Lista usuarios con rol 'operator'
  async getOperators() {
    const url = `${API_BASE}/admin/operators`;
    return jsonFetch(url, {
      headers: buildHeaders(),
    });
  },

  // Cambia el rol de un usuario: 'user' | 'operator' | 'admin'
  async setUserRole(userId, role) {
    const url = `${API_BASE}/admin/operators/${userId}/role`;
    return jsonFetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify({ role }),
    });
  },

  // "Eliminar" operador → lo baja a 'user'
  async removeOperator(userId) {
    const url = `${API_BASE}/admin/operators/${userId}`;
    return jsonFetch(url, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  },
    async promoteOperatorByEmail(email) {
    const url = `${API_BASE}/admin/operators/promote`;
    return jsonFetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ email }),
    });
  },

};