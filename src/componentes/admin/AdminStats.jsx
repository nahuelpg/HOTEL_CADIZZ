import { useEffect, useState } from "react";
import { useAuth } from "../../store/authContext";
import { adminApi } from "../../services/Admin";
import { Panel } from "../operator/Panel";

export default function AdminStats() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await adminApi.getRooms();
        setRooms(data?.rooms || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // helpers para gráficos
  const maxStock = rooms.reduce(
    (max, r) => (r.stock != null && r.stock > max ? r.stock : max),
    0
  );
  const maxPrice = rooms.reduce(
    (max, r) => (r.price != null && r.price > max ? r.price : max),
    0
  );

  return (
    <Panel title="Gráficos y Estadísticas">
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

        {error && (
          <div
            style={{
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

        {loading ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              color: "#e5e7eb",
              fontSize: 14,
            }}
          >
            Cargando estadísticas...
          </div>
        ) : rooms.length === 0 ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No hay tipos de habitación cargados para mostrar estadísticas.
          </div>
        ) : (
          <>
            {/* ====== GRÁFICO 1: Stock por tipo ====== */}
            <section
              style={{
                padding: 16,
                borderRadius: 18,
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.5)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.8)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 6,
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Stock por tipo de habitación
              </h3>
              <p style={{ margin: 0, marginBottom: 10, fontSize: 13, color: "#94a3b8" }}>
                Cantidad máxima de reservas simultáneas configurada para cada tipo.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rooms.map((r) => {
                  const val = r.stock != null ? r.stock : 0;
                  const width =
                    maxStock > 0 ? `${Math.max((val / maxStock) * 100, 5)}%` : "5%";

                  return (
                    <div key={r.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          marginBottom: 3,
                        }}
                      >
                        <span>
                          <strong>{r.id}</strong> — {r.name}
                        </span>
                        <span>{val} unidades</span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(15,23,42,0.8)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg,#38bdf8,#22c55e)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ====== GRÁFICO 2: Precio por tipo ====== */}
            <section
              style={{
                padding: 16,
                borderRadius: 18,
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.5)",
                boxShadow: "0 18px 40px rgba(15,23,42,0.8)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 6,
                  fontSize: 16,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Precio por tipo de habitación
              </h3>
              <p style={{ margin: 0, marginBottom: 10, fontSize: 13, color: "#94a3b8" }}>
                Valor de la noche para cada tipo (escala comparativa).
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rooms.map((r) => {
                  const val = r.price != null ? Number(r.price) : 0;
                  const width =
                    maxPrice > 0 ? `${Math.max((val / maxPrice) * 100, 5)}%` : "5%";

                  return (
                    <div key={r.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          marginBottom: 3,
                        }}
                      >
                        <span>
                          <strong>{r.id}</strong> — {r.name}
                        </span>
                        <span>
                          $
                          {val.toLocaleString("es-AR", {
                            minimumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(15,23,42,0.8)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width,
                            height: "100%",
                            borderRadius: 999,
                            background:
                              "linear-gradient(90deg,#6366f1,#a855f7)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </Panel>
  );
}
