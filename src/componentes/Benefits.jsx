// Benefits.jsx
import "./Benefits.css";

export default function Benefits() {
  const benefits = [
    {
      icon: "⭐",
      title: "Excelencia Reconocida",
      text: "Calificación 4.9/5 con más de 2,500 reseñas verificadas",
      gradient: "amber"
    },
    {
      icon: "🛏️",
      title: "Confort Excepcional",
      text: "Ropa de cama italiana, colchones ergonómicos y almohadas premium a elección",
      gradient: "blue"
    },
    {
      icon: "🎧",
      title: "Concierge 24/7",
      text: "Asistencia personalizada en español, inglés y portugués",
      gradient: "purple"
    },
    {
      icon: "🏆",
      title: "Certificación AAA",
      text: "Reconocidos con el Diamond Award por servicio excepcional",
      gradient: "emerald"
    },
    {
      icon: "🛡️",
      title: "Garantía de Satisfacción",
      text: "Si no cumplimos tus expectativas, reembolsamos tu estadía",
      gradient: "rose"
    },
    {
      icon: "⏰",
      title: "Check-in Flexible",
      text: "Early check-in y late check-out sin cargo adicional según disponibilidad",
      gradient: "indigo"
    }
  ];

  return (
    <section className="benefits-section">
      {/* Animated background */}
      <div className="benefits-bg">
        <div className="bg-overlay">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
        </div>
      </div>

      <div className="benefits-container">
        {/* Header */}
        <div className="benefits-header">
          <div className="premium-badge">
            <span className="badge-icon">⭐</span>
            <span className="badge-text">EXPERIENCIA PREMIUM</span>
          </div>
          
          <h2 className="benefits-title">
            La Excelencia en Cada
            <span className="title-gradient">Detalle</span>
          </h2>
          
          <p className="benefits-subtitle">
            En Cadizz Hotel redefinimos el lujo con un servicio impecable y atención personalizada
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`benefit-card benefit-${benefit.gradient}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-content">
                <div className="gradient-overlay"></div>
                
                <div className="icon-container">
                  <div className="icon-wrapper">
                    <span className="benefit-icon">{benefit.icon}</span>
                  </div>
                  <div className="icon-glow"></div>
                </div>

                <div className="card-text">
                  <h3 className="card-title">{benefit.title}</h3>
                  <p className="card-description">{benefit.text}</p>
                </div>

                <div className="corner-accent"></div>
              </div>

              <div className="card-glow"></div>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="trust-section">
          <div className="trust-badge">
            <div className="trust-group">
              <div className="avatars-stack">
                <div className="avatar avatar-1">1</div>
                <div className="avatar avatar-2">2</div>
                <div className="avatar avatar-3">3</div>
                <div className="avatar avatar-4">4</div>
              </div>
              <div className="trust-text">
                <p className="trust-title">2,500+ Huéspedes</p>
                <p className="trust-subtitle">Satisfechos este año</p>
              </div>
            </div>
            
            <div className="trust-divider"></div>
            
            <div className="trust-text">
              <p className="trust-title">98% Recomendación</p>
              <p className="trust-subtitle">Volvería a hospedarse</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}