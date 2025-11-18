// src/services/api.js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE = `${BASE}/api`;
const LOCAL_KEY = "cadizz_auth_v1";

function headers(token, extra = {}) {
  const clean = token ? token.replace(/^Bearer\s+/i, "").trim() : "";
  const h = { "Content-Type": "application/json", ...extra };
  if (clean) h.Authorization = `Bearer ${clean}`;
  return h;
}

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

async function jsonFetch(url, opts) {
  const res = await fetch(url, opts);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Respuesta no JSON (${res.status}). URL=${url}. Inicio: ${text.slice(
        0,
        80
      )}`
    );
  }
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error || data?.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // ─────────── Auth ───────────
  async register(name, email, password, captchaToken) {
    const payload = {
      name,
      email,
      password,
      captchaToken,
      recaptchaToken: captchaToken,
      "g-recaptcha-response": captchaToken,
    };

    const extraHeaders = captchaToken
      ? { "X-Recaptcha-Token": captchaToken }
      : {};

    return jsonFetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: headers(undefined, extraHeaders),
      body: JSON.stringify(payload),
    });
  },

  async login(email, password) {
    return jsonFetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
  },

  async me(token) {
    return jsonFetch(`${API_BASE}/auth/me`, {
      headers: headers(token),
    });
  },

  // ─────────── Rooms / Reservas del cliente ───────────
  async getRooms() {
    return jsonFetch(`${API_BASE}/rooms`);
  },

  async checkAvailability({ roomId, checkin, checkout }) {
    const q = new URLSearchParams({ roomId, checkin, checkout }).toString();
    return jsonFetch(`${API_BASE}/rooms/availability?${q}`);
  },

  async createReservation({
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
  }) {
    return jsonFetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify({
        roomId,
        checkin,
        checkout,
        dni,
        phone,
        guestName,
        guests,
        address,
        city,
        notes,
      }),
    });
  },

  async myReservations(token) {
    return jsonFetch(`${API_BASE}/reservations/mine`, {
      headers: headers(token),
    });
  },

  async cancelMyReservation(token, id) {
    return jsonFetch(`${API_BASE}/reservations/${id}/cancel`, {
      method: "POST",
      headers: headers(token),
    });
  },

  // ─────────── Métodos genéricos para Operador/Admin ───────────
  async get(path, { params, token } = {}) {
    const url = new URL(API_BASE + path);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
          url.searchParams.append(k, v);
        }
      });
    }
    const t = token || getTokenFromStorage();
    return jsonFetch(url.toString(), {
      headers: headers(t),
    });
  },

  async post(path, body = {}, token) {
    const t = token || getTokenFromStorage();
    return jsonFetch(API_BASE + path, {
      method: "POST",
      headers: headers(t),
      body: JSON.stringify(body),
    });
  },
};
