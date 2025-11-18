import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "./Habitaciones.css";

export default function Habitaciones() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
      setError("");
    } catch (err) {
      console.error("Rooms error:", err);
      setError("No se pudieron cargar las habitaciones");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === "all") return true;
    if (filter === "suite") return room.name.toLowerCase().includes("suite");
    if (filter === "standard") return room.name.toLowerCase().includes("standard");
    if (filter === "doble") return room.name.toLowerCase().includes("doble");
    return true;
  });

  // Loading skeleton
  if (loading) {
    return (
      <section className="wrap">
        <h1 className="section-title">Nuestras habitaciones</h1>
        <div className="room-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="room-card skeleton">
              <div className="skeleton-img"></div>
              <div className="room-body">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-amenities">
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="wrap">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops, algo salió mal</h2>
          <p className="err">{error}</p>
          <button onClick={loadRooms} className="btn-retry">
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (rooms.length === 0) {
    return (
      <section className="wrap">
        <div className="empty-state">
          <div className="empty-icon">🏨</div>
          <h2>No hay habitaciones disponibles</h2>
          <p>Vuelve pronto para ver nuestras opciones</p>
        </div>
      </section>
    );
  }

  return (
    <section className="wrap">
      <div className="header-section">
        <h1 className="section-title">Nuestras habitaciones</h1>
        <p className="section-subtitle">
          Descubre el confort y la elegancia en cada una de nuestras habitaciones
        </p>
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todas ({rooms.length})
        </button>
        <button 
          className={`filter-btn ${filter === "standard" ? "active" : ""}`}
          onClick={() => setFilter("standard")}
        >
          Standard
        </button>
        <button 
          className={`filter-btn ${filter === "suite" ? "active" : ""}`}
          onClick={() => setFilter("suite")}
        >
          Suites
        </button>
        <button 
          className={`filter-btn ${filter === "doble" ? "active" : ""}`}
          onClick={() => setFilter("doble")}
        >
          Doble
        </button>
      </div>

      {/* Grid de habitaciones */}
      <div className="room-grid">
        {filteredRooms.map((room, index) => {
          const amenities = (room.amenities || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

          const amenityIcons = {
            "Wi-Fi": "📶",
            "TV": "📺",
            "A/C": "❄️",
            "Baño privado": "🚿",
            "Smart TV": "📺",
            "Jacuzzi": "🛁",
            "Balcón": "🌆"
          };

          return (
            <article 
              key={room.id} 
              className="room-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="room-image-container">
                <img 
                  src={room.image} 
                  alt={room.name}
                  loading="lazy"
                />
                <div className="room-badge">
                  {room.guests_max} personas
                </div>
              </div>

              <div className="room-body">
                <h3>{room.name}</h3>
                
                <div className="room-specs">
                  <span className="spec-item">
                    <span className="spec-icon">🛏️</span>
                    {room.beds}
                  </span>
                  <span className="spec-item">
                    <span className="spec-icon">👥</span>
                    {room.guests_max} huéspedes
                  </span>
                  <span className="spec-item">
                    <span className="spec-icon">📏</span>
                    {room.size_m2} m²
                  </span>
                </div>

                <ul className="amenities">
                  {amenities.slice(0, 5).map(amenity => (
                    <li key={amenity}>
                      <span className="amenity-icon">
                        {amenityIcons[amenity] || "✓"}
                      </span>
                      {amenity}
                    </li>
                  ))}
                  {amenities.length > 5 && (
                    <li className="amenities-more">
                      +{amenities.length - 5} más
                    </li>
                  )}
                </ul>

                <div className="room-foot">
                  <div className="price-container">
                    <span className="price-label">Desde</span>
                    <span className="price">
                      ${room.price}
                      <small>/noche</small>
                    </span>
                  </div>
                  
                  <Link 
                    to="/reserva" 
                    state={{ roomId: room.id, roomName: room.name, roomPrice: room.price }} 
                    className="btn-outline"
                  >
                    Reservar ahora
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* No results */}
      {filteredRooms.length === 0 && (
        <div className="no-results">
          <p>No se encontraron habitaciones con ese filtro</p>
          <button onClick={() => setFilter("all")} className="btn-clear-filter">
            Ver todas
          </button>
        </div>
      )}
    </section>
  );
}