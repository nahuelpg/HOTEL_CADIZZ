import SliderHero from "./SliderHero";
import SliderRoom from "./SliderRoom";
import SliderFeatured from "./SliderFeatured";

import Testimonials from "./Testimonials";
import Benefits from "./Benefits";

import "./Inicio.css";
import { Link } from "react-router-dom";

export default function Inicio() {
  return (
    <div className="inicio-wrapper">

      {/* ================= HERO PRINCIPAL ================= */}
      <section className="hero-container">
        <SliderHero />

        <div className="hero-overlay"></div>

        <div className="hero-text fade-up">
          <h1>Redefinimos el concepto de confort</h1>
          <p>
            Elegancia, calidez y experiencias memorables en el corazón de la ciudad.
          </p>

          <div className="hero-buttons">
            <Link to="/reserva" className="btn-primary">Reservar ahora</Link>
            <Link to="/habitaciones" className="btn-ghost">Ver habitaciones</Link>
          </div>
        </div>
      </section>

      {/* ================= CARRUSEL HABITACIONES ================= */}
      <section className="wrap slider-section fade-up">
        <h2 className="section-title">Galería de Habitaciones</h2>
        <p className="section-subtitle centered">
          Explorá nuestras habitaciones más destacadas.
        </p>

        <SliderRoom />
      </section>

      {/* ================= BUSCADOR ================= */}
      <section className="finder-box fade-up">
        <div className="finder-item">
          <label>Fecha de ingreso</label>
          <input type="date" />
        </div>

        <div className="finder-item">
          <label>Fecha de salida</label>
          <input type="date" />
        </div>

        <div className="finder-item">
          <label>Huéspedes</label>
          <select>
            <option>1 huésped</option>
            <option>2 huéspedes</option>
            <option>3 huéspedes</option>
            <option>4 huéspedes</option>
          </select>
        </div>

        <Link to="/habitaciones" className="finder-btn">
          Buscar disponibilidad
        </Link>
      </section>


      {/* ================= BENEFICIOS (COMPONENTE NUEVO) ================= */}
      <Benefits />


      {/* ================= HABITACIONES DESTACADAS ================= */}
      <section className="wrap featured-section fade-up">
        <h2 className="section-title">Descubrí nuestros espacios</h2>
        <p className="section-subtitle centered">
          Habitaciones diseñadas para tu descanso, comodidad y bienestar.
        </p>

        <SliderFeatured />
      </section>

      {/* ================= TESTIMONIOS (COMPONENTE NUEVO) ================= */}
      <Testimonials />


      {/* ================= FOOTER PRO ================= */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Cadizz Hotel</h3>
          <p>Confort, excelencia y momentos inolvidables.</p>


          <p className="copyright">
            © {new Date().getFullYear()} Cadizz Hotel — Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
