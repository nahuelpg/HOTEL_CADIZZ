// src/componentes/admin/AdminOperators.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../store/authContext";
import { adminApi } from "../../services/Admin";
import { Panel } from "../operator/Panel";

const ROLES = ["user", "operator", "admin"];

export default function AdminOperators() {
  const { user } = useAuth();

  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // 👉 nuevo: email para promover
  const [emailNew, setEmailNew] = useState("");
  const [promoting, setPromoting] = useState(false);

  const loadOperators = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminApi.getOperators();
      setOperators(data?.operators || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudieron cargar los operadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const handleRoleChange = (id, newRole) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, role: newRole } : op))
    );
    setSuccess("");
    setError("");
  };

  const handleSaveRole = async (op) => {
    if (!op.role) return;

    try {
      setSavingId(op.id);
      setError("");
      setSuccess("");
      await adminApi.setUserRole(op.id, op.role);
      setSuccess(`Rol actualizado para ${op.name} (${op.email}).`);
      await loadOperators();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo actualizar el rol.");
    } finally {
      setSavingId(null);
    }
  };

  const handleRemoveOperator = async (op) => {
    if (
      !window.confirm(
        `¿Quitar rol de operador a "${op.name}" (${op.email})? Pasará a ser usuario normal.`
      )
    )
      return;

    try {
      setSavingId(op.id);
      setError("");
      setSuccess("");
      await adminApi.removeOperator(op.id);
      setSuccess(`"${op.name}" ya no es operador.`);
      await loadOperators();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo quitar el rol de operador.");
    } finally {
      setSavingId(null);
    }
  };

  // 👉 nuevo: promover por email
  const handlePromote = async (e) => {
    e.preventDefault();
    const email = emailNew.trim();
    if (!email) return;

    try {
      setPromoting(true);
      setError("");
      setSuccess("");
      await adminApi.promoteOperatorByEmail(email);
      setSuccess(`Se asignó rol de operador a: ${email}`);
      setEmailNew("");
      await loadOperators();
    } catch (e) {
      console.error(e);
      setError(e.message || "No se pudo asignar el rol de operador.");
    } finally {
      setPromoting(false);
    }
  };

  const filtered = operators.filter((op) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      op.name?.toLowerCase().includes(q) ||
      op.email?.toLowerCase().includes(q) ||
      String(op.id).includes(q)
    );
  });

  return (
    <Panel title="Gestión de Operadores">
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
          Admin: <strong>{user?.name}</strong> ({user?.role})
        </p>

        {/* Barra superior */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Operadores del sistema
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
              Acá podés cambiar roles, quitar operadores y asignar nuevos por email.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              placeholder="Buscar por nombre, email o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: 13,
                minWidth: 240,
              }}
            />
          </div>
        </div>

        {/* 👉 NUEVO: formulario para asignar operador por email */}
        <form
          onSubmit={handlePromote}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            background: "rgba(15,23,42,0.9)",
            borderRadius: 14,
            padding: "10px 14px",
            border: "1px solid rgba(148,163,184,0.5)",
          }}
        >
          <span style={{ fontSize: 13 }}>
            Asignar rol de <strong>operador</strong> a un usuario por email:
          </span>
          <input
            type="email"
            placeholder="usuario@cadizz.com"
            value={emailNew}
            onChange={(e) => setEmailNew(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.6)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
              fontSize: 13,
              minWidth: 240,
            }}
          />
          <button
            type="submit"
            disabled={promoting}
            style={{
              padding: "6px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #22c55e 100%)",
              color: "white",
              boxShadow: "0 8px 20px rgba(34,197,94,0.45)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {promoting ? "Asignando..." : "Hacer operador"}
          </button>
        </form>

        {/* Mensajes */}
        {error && (
          <div
            style={{
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.7)",
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
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(22,163,74,0.15)",
              border: "1px solid rgba(22,163,74,0.7)",
              color: "#bbf7d0",
              fontSize: 13,
            }}
          >
            {success}
          </div>
        )}

        {/* Tabla */}
        <div
          style={{
            marginTop: 10,
            borderRadius: 18,
            overflow: "hidden",
            background: "rgba(2,6,23,0.95)",
            border: "1px solid rgba(148,163,184,0.35)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.9)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "#e5e7eb",
                fontSize: 14,
              }}
            >
              Cargando operadores...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: 28,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 14,
              }}
            >
              No hay operadores que coincidan con la búsqueda.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: 800,
                  borderCollapse: "collapse",
                  color: "#e5e7eb",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(15,23,42,0.9), rgba(37,99,235,0.85))",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Nombre</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Rol</th>
                    <th style={{ ...thStyle, minWidth: 220 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((op, idx) => (
                    <tr
                      key={op.id}
                      style={{
                        background: idx % 2 === 0 ? "#020617" : "#0b1120",
                      }}
                    >
                      <td style={tdStyle}>{op.id}</td>
                      <td style={tdStyle}>{op.name}</td>
                      <td style={tdStyle}>{op.email}</td>
                      <td style={tdStyle}>
                        <select
                          value={op.role}
                          onChange={(e) =>
                            handleRoleChange(op.id, e.target.value)
                          }
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            border:
                              "1px solid rgba(129,140,248,0.7)",
                            background: "rgba(15,23,42,0.9)",
                            color: "#e5e7eb",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
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
                          onClick={() => handleSaveRole(op)}
                          disabled={savingId === op.id}
                          style={btnSmall("primary")}
                        >
                          {savingId === op.id
                            ? "Guardando..."
                            : "Guardar rol"}
                        </button>

                        {op.role === "operator" && (
                          <button
                            onClick={() => handleRemoveOperator(op)}
                            disabled={savingId === op.id}
                            style={btnSmall("danger")}
                          >
                            Quitar operador
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

// ===== estilos helpers =====
const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid rgba(148,163,184,0.3)",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 13,
  borderBottom: "1px solid rgba(15,23,42,0.9)",
};

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

  if (type === "primary") {
    return {
      ...base,
      background: "rgba(59,130,246,0.2)",
      color: "#bfdbfe",
      border: "1px solid rgba(59,130,246,0.7)",
    };
  }

  if (type === "danger") {
    return {
      ...base,
      background: "rgba(239,68,68,0.15)",
      color: "#fecaca",
      border: "1px solid rgba(239,68,68,0.7)",
    };
  }

  return base;
}
