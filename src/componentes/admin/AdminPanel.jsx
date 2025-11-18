import { useEffect, useState } from "react";
import { Link } from "react-router-dom";          // 👈 agregado
import { useAuth } from "../../store/authContext";
import { adminApi } from "../../services/Admin";
import { Panel } from "../operator/Panel";

const EMPTY_ROOM = {
  id: "",
  name: "",
  beds: "",
  guests_max: "",
  size_m2: "",
  price: "",
  stock: "",
  image: "",
  amenities: "",
  is_open: 1,
};

export default function AdminPanel() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ROOM);
  const [showForm, setShowForm] = useState(false);

  // Cargar rooms al entrar
  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getRooms();
      setRooms(data?.rooms || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudieron cargar las habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Abrir formulario en modo crear
  const handleNew = () => {
    setEditingId(null);
    setForm(EMPTY_ROOM);
    setShowForm(true);
    setSuccess("");
    setError("");
  };

  // Abrir formulario en modo editar
  const handleEdit = (room) => {
    setEditingId(room.id);
    setForm({
      id: room.id,
      name: room.name || "",
      beds: room.beds ?? "",
      guests_max: room.guests_max ?? "",
      size_m2: room.size_m2 ?? "",
      price: room.price ?? "",
      stock: room.stock ?? "",
      image: room.image || "",
      amenities: room.amenities || "",
      is_open: room.is_open ?? 1,
    });
    setShowForm(true);
    setSuccess("");
    setError("");
  };

  // Eliminar habitación
  const handleDelete = async (room) => {
    if (!window.confirm(`¿Eliminar el tipo de habitación "${room.name}" (${room.id})?`))
      return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await adminApi.deleteRoom(room.id);
      setSuccess("Habitación eliminada correctamente.");
      await loadRooms();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo eliminar la habitación.");
    } finally {
      setSaving(false);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      beds: form.beds !== "" ? Number(form.beds) : null,
      guests_max: form.guests_max !== "" ? Number(form.guests_max) : null,
      size_m2: form.size_m2 !== "" ? Number(form.size_m2) : null,
      price: form.price !== "" ? Number(form.price) : null,
      stock: form.stock !== "" ? Number(form.stock) : null,
      image: form.image.trim() || null,
      amenities: form.amenities.trim() || null,
      is_open: Number(form.is_open) === 1 ? 1 : 0,
    };

    if (!payload.id || !payload.name || !payload.guests_max || !payload.price) {
      setError("Los campos ID, Nombre, Capacidad y Precio son obligatorios.");
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await adminApi.updateRoom(editingId, payload);
        setSuccess("Habitación actualizada correctamente.");
      } else {
        await adminApi.createRoom(payload);
        setSuccess("Habitación creada correctamente.");
      }

      setShowForm(false);
      setForm(EMPTY_ROOM);
      setEditingId(null);
      await loadRooms();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo guardar la habitación.");
    } finally {
      setSaving(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      r.id?.toLowerCase().includes(q) ||
      r.name?.toLowerCase().includes(q)
    );
  });

  const formatPrice = (value) => {
    if (value == null || value === "") return "-";
    return `$${Number(value).toLocaleString("es-AR")}`;
  };

  return (
    <Panel title="Panel de Administración">
      {/* Bloque: bienvenida + tarjetas */}
      <div
        style={{
          padding: 16,
          color: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p style={{ margin: 0, fontSize: 14 }}>
          Bienvenido, <strong>{user?.name}</strong> (rol: {user?.role})
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 8,
          }}
        >
          {/* Card Habitaciones */}
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>
              Habitaciones
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5f5" }}>
              Alta, baja y modificación de los tipos de habitaciones del hotel.
            </p>
            <span style={{ fontSize: 11, opacity: 0.7 }}>
              Estás viendo el gestor de habitaciones debajo.
            </span>
          </div>

          {/* Card Operadores */}
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>
              Operadores
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5f5" }}>
              Gestión de usuarios con rol operador: asignar rol, quitarlo, etc.
            </p>
            <Link
              to="/admin/operators"
              style={{
                marginTop: 6,
                alignSelf: "flex-start",
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid rgba(59,130,246,0.7)",
                color: "#bfdbfe",
                textDecoration: "none",
              }}
            >
              Ir a gestión de operadores
            </Link>
          </div>

          {/* Card Gráficos / Estadísticas */}
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 4, fontSize: 15 }}>
              Gráficos / Estadísticas
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5f5" }}>
              Visualización rápida de stock y precios por tipo de habitación.
            </p>
            <Link
              to="/admin/stats"
              style={{
                marginTop: 6,
                alignSelf: "flex-start",
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid rgba(34,197,94,0.7)",
                color: "#bbf7d0",
                textDecoration: "none",
              }}
            >
              Ver gráficos
            </Link>
          </div>
        </div>

        <p style={{ margin: 0, marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          Debajo se muestra el gestor completo de tipos de habitaciones.
        </p>
      </div>

      {/* ===========================
          CRUD HABITACIONES ADMIN
      ============================ */}

      {/* Barra superior CRUD */}
      <div
        style={{
          marginBottom: 16,
          marginTop: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 8,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              color: "#e5e7eb",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Tipos de habitación
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
            Estas habitaciones son las que ve el cliente al reservar.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="Buscar por ID o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.4)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: 13,
              minWidth: 220,
            }}
          />
          <button
            onClick={handleNew}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #22c55e 100%)",
              color: "white",
              boxShadow: "0 10px 30px rgba(34,197,94,0.45)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            + Nueva habitación
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.5)",
            color: "#fecaca",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(22,163,74,0.15)",
            border: "1px solid rgba(22,163,74,0.6)",
            color: "#bbf7d0",
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      {/* Tabla y formulario se quedan tal cual estaban */}
      {/* ... (resto de tu código de tabla y form SIN CAMBIOS) ... */}
      {/* te dejo el mismo bloque que ya tenías abajo */}

      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(2,6,23,0.9)",
          border: "1px solid rgba(148,163,184,0.35)",
          boxShadow: "0 18px 50px rgba(15,23,42,0.9)",
          marginBottom: 20,
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "#e5e7eb",
              fontSize: 14,
            }}
          >
            Cargando habitaciones...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No hay habitaciones que coincidan con la búsqueda.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 900,
                borderCollapse: "collapse",
                color: "#e5e7eb",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,0.9), rgba(30,64,175,0.8))",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Capacidad</th>
                  <th style={thStyle}>Camas</th>
                  <th style={thStyle}>Tamaño</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Stock</th>
                  <th style={thStyle}>Estado</th>
                  <th style={{ ...thStyle, minWidth: 220 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room, idx) => (
                  <tr
                    key={room.id}
                    style={{
                      background: idx % 2 === 0 ? "#020617" : "#0b1120",
                      transition: "background 0.2s",
                    }}
                  >
                    <td style={tdStyle}>{room.id}</td>
                    <td style={tdStyle}>{room.name}</td>
                    <td style={tdStyle}>
                      {room.guests_max != null ? `${room.guests_max} pax` : "-"}
                    </td>
                    <td style={tdStyle}>
                      {room.beds != null ? room.beds : "-"}
                    </td>
                    <td style={tdStyle}>
                      {room.size_m2 != null ? `${room.size_m2} m²` : "-"}
                    </td>
                    <td style={tdStyle}>{formatPrice(room.price)}</td>
                    <td style={tdStyle}>
                      {room.stock != null ? room.stock : "-"}
                    </td>
                    <td style={tdStyle}>
                      {room.is_open ? (
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            background: "rgba(22,163,74,0.15)",
                            color: "#4ade80",
                            border: "1px solid rgba(22,163,74,0.6)",
                          }}
                        >
                          Abierta
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            background: "rgba(239,68,68,0.15)",
                            color: "#fecaca",
                            border: "1px solid rgba(239,68,68,0.7)",
                          }}
                        >
                          Cerrada
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(room)}
                        style={btnSmall("edit")}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          handleEdit({
                            ...room,
                            is_open: room.is_open ? 0 : 1,
                          })
                        }
                        style={btnSmall("toggle")}
                      >
                        {room.is_open ? "Cerrar" : "Abrir"}
                      </button>
                      <button
                        onClick={() => handleDelete(room)}
                        style={btnSmall("delete")}
                        disabled={saving}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario (tarjeta flotante) */}
      {showForm && (
        <div
          style={{
            marginTop: 10,
            padding: 20,
            borderRadius: 18,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.85))",
            border: "1px solid rgba(129,140,248,0.6)",
            boxShadow: "0 20px 60px rgba(15,23,42,0.9)",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 14,
              fontSize: 16,
              color: "#e5e7eb",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {editingId ? "Editar habitación" : "Nueva habitación"}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {/* ID */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>ID (código)</label>
              <input
                value={form.id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, id: e.target.value }))
                }
                placeholder="std, dbl, fam..."
                disabled={!!editingId}
                style={inputStyle(!!editingId)}
              />
            </div>

            {/* Nombre */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Nombre</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Standard, Doble, Suite..."
                style={inputStyle()}
              />
            </div>

            {/* Camas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Camas</label>
              <input
                type="number"
                value={form.beds}
                onChange={(e) =>
                  setForm((f) => ({ ...f, beds: e.target.value }))
                }
                placeholder="2"
                style={inputStyle()}
              />
            </div>

            {/* Capacidad */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Capacidad (pax)</label>
              <input
                type="number"
                value={form.guests_max}
                onChange={(e) =>
                  setForm((f) => ({ ...f, guests_max: e.target.value }))
                }
                placeholder="4"
                style={inputStyle()}
              />
            </div>

            {/* Tamaño */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Tamaño (m²)</label>
              <input
                type="number"
                value={form.size_m2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, size_m2: e.target.value }))
                }
                placeholder="35"
                style={inputStyle()}
              />
            </div>

            {/* Precio */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Precio por noche</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="45000"
                style={inputStyle()}
              />
            </div>

            {/* Stock */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Stock (máx. reservas simultáneas)</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value }))
                }
                placeholder="5"
                style={inputStyle()}
              />
            </div>

            {/* Imagen */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>URL de imagen</label>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                placeholder="https://..."
                style={inputStyle()}
              />
            </div>

            {/* Amenities */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                gridColumn: "1 / -1",
              }}
            >
              <label style={labelStyle}>Amenities (texto)</label>
              <textarea
                rows={3}
                value={form.amenities}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amenities: e.target.value }))
                }
                placeholder="WiFi, TV, Aire acondicionado..."
                style={{
                  ...inputStyle(),
                  borderRadius: 14,
                  resize: "vertical",
                }}
              />
            </div>

            {/* Estado */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={labelStyle}>Estado</label>
              <select
                value={form.is_open}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_open: Number(e.target.value) }))
                }
                style={{
                  ...inputStyle(),
                  cursor: "pointer",
                }}
              >
                <option value={1}>Abierta</option>
                <option value={0}>Cerrada</option>
              </select>
            </div>

            {/* Botones */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 10,
                gridColumn: "1 / -1",
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #4ade80 100%)",
                  color: "white",
                  boxShadow: "0 10px 30px rgba(22,163,74,0.6)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {saving
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear habitación"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_ROOM);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.7)",
                  background: "transparent",
                  color: "#e5e7eb",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </Panel>
  );
}

/* ==== estilos helper ==== */

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid rgba(148,163,184,0.3)",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 13,
  borderBottom: "1px solid rgba(15,23,42,0.9)",
  color: "#e5e7eb",
};

const labelStyle = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#c7d2fe",
};

function inputStyle(disabled = false) {
  return {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(129,140,248,0.8)",
    background: disabled ? "rgba(15,23,42,0.6)" : "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: 13,
    outline: "none",
  };
}

function btnSmall(type) {
  const base = {
    padding: "5px 12px",
    borderRadius: 999,
    border: "none",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  if (type === "edit") {
    return {
      ...base,
      background: "rgba(59,130,246,0.15)",
      color: "#93c5fd",
      border: "1px solid rgba(59,130,246,0.7)",
    };
  }
  if (type === "delete") {
    return {
      ...base,
      background: "rgba(239,68,68,0.15)",
      color: "#fecaca",
      border: "1px solid rgba(239,68,68,0.7)",
    };
  }
  if (type === "toggle") {
    return {
      ...base,
      background: "rgba(234,179,8,0.15)",
      color: "#facc15",
      border: "1px solid rgba(234,179,8,0.7)",
    };
  }

  return base;
}
