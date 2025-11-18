import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SliderFeatured.css";

const featured = [
  {
    title: "Suites Exclusivas",
    desc: "Amplias, modernas y con balcón privado.",
    img: "https://img.freepik.com/foto-gratis/interior-dormitorio-lujo-muebles-ricos-vistas-panoramicas-cubierta-huelga_1258-111483.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Habitaciones Superiores",
    desc: "El equilibrio perfecto entre diseño y funcionalidad.",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    title: "Estándar Premium",
    desc: "Una opción accesible sin resignar calidad.",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },
];

export default function SliderFeatured() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % featured.length);
  const prev = () => setIndex((i) => (i - 1 + featured.length) % featured.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="featured-slider">

      <div className="featured-slide">
        <img src={featured[index].img} alt={featured[index].title} />

        <div className="featured-overlay"></div>

        <div className="featured-info">
          <h3>{featured[index].title}</h3>
          <p>{featured[index].desc}</p>
          <Link to="/habitaciones" className="featured-btn">Ver más</Link>
        </div>
      </div>

      {/* Flechas */}
      <button className="feat-arrow left" onClick={prev}>❮</button>
      <button className="feat-arrow right" onClick={next}>❯</button>

      {/* Dots */}
      <div className="feat-dots">
        {featured.map((_, i) => (
          <div
            key={i}
            className={`feat-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>
    </div>
  );
}
