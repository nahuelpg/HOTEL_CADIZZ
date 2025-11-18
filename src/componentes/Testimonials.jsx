// Testimonials.jsx
import { Link } from "react-router-dom";
import "./Testimonials.css";

export default function Testimonials() {
  const reviews = [
    {
      text: "Una experiencia que supera cualquier expectativa. Desde el momento en que llegamos, sentimos el lujo y la calidez del servicio. Cada detalle está pensado para el máximo confort.",
      author: "Sofía Martínez",
      role: "CEO, Tech Innovations",
      rating: 5,
      location: "Buenos Aires, Argentina",
      image: "SM"
    },
    {
      text: "El desayuno buffet es una obra de arte culinaria. La suite presidencial con vista panorámica nos dejó sin palabras. Sin duda, el mejor hotel de la región.",
      author: "Bruno Rodríguez",
      role: "Director de Marketing",
      rating: 5,
      location: "Salta Capital, Argentina",
      image: "BR"
    },
    {
      text: "Celebramos nuestro aniversario aquí y fue absolutamente mágico. El spa es de clase mundial, el servicio de concierge anticipó cada una de nuestras necesidades. Volveremos cada año.",
      author: "Valentina González",
      role: "Arquitecta",
      rating: 5,
      location: "Córdoba, Argentina",
      image: "VG"
    },
    {
      text: "Como viajero frecuente, he estado en muchos hoteles de lujo. Cadizz Hotel establece un nuevo estándar. La atención personalizada y los detalles exclusivos son incomparables.",
      author: "Diego Fernández",
      role: "Consultor Internacional",
      rating: 5,
      location: "Madrid, España",
      image: "DF"
    }
  ];

  return (
    <section className="testimonials-section">
      {/* Background decoration */}
      <div className="testimonials-bg">
        <div className="bg-pattern"></div>
      </div>

      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="rating-badge">
            <div className="stars">
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
            </div>
            <span className="rating-text">4.9 de 5.0</span>
          </div>
          
          <h2 className="testimonials-title">
            Experiencias que
            <span className="title-highlight"> Inspiran</span>
          </h2>
          
          <p className="testimonials-subtitle">
            Historias reales de huéspedes que vivieron momentos inolvidables en Cadizz Hotel
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote decoration */}
              <div className="quote-mark">"</div>
              
              {/* Rating stars */}
              <div className="card-rating">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="star-icon">★</span>
                ))}
              </div>

              {/* Review text */}
              <p className="testimonial-text">
                {review.text}
              </p>

              {/* Author info */}
              <div className="testimonial-author">
                <div className="author-avatar">
                  <span className="avatar-initials">{review.image}</span>
                  <div className="avatar-ring"></div>
                </div>
                
                <div className="author-details">
                  <p className="author-name">{review.author}</p>
                  <p className="author-role">{review.role}</p>
                  <p className="author-location">
                    <span className="location-icon">📍</span>
                    {review.location}
                  </p>
                </div>
              </div>

              {/* Verified badge */}
              <div className="verified-badge">
                <span className="verified-icon">✓</span>
                <span className="verified-text">Estadía Verificada</span>
              </div>

              {/* Card shine effect */}
              <div className="card-shine"></div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="trust-indicators">
          <div className="indicator">
            <span className="indicator-icon">🏆</span>
            <div className="indicator-text">
              <p className="indicator-value">Top 1%</p>
              <p className="indicator-label">Hoteles de Lujo</p>
            </div>
          </div>
          
          <div className="indicator-divider"></div>
          
          <div className="indicator">
            <span className="indicator-icon">💎</span>
            <div className="indicator-text">
              <p className="indicator-value">2,847</p>
              <p className="indicator-label">Reseñas Positivas</p>
            </div>
          </div>
          
          <div className="indicator-divider"></div>
          
          <div className="indicator">
            <span className="indicator-icon">⭐</span>
            <div className="indicator-text">
              <p className="indicator-value">98.5%</p>
              <p className="indicator-label">Satisfacción</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="testimonials-cta">
          <p className="cta-text">¿Listo para crear tu propia historia?</p>
          <Link to="/habitaciones" className="cta-button">
            <span className="button-text">Reservar Ahora</span>
            <span className="button-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}