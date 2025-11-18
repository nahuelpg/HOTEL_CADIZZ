import { useState, useEffect } from "react";
import "./SliderHero.css";

const images = [
  "https://www.kayak.com.mx/rimg/dimg/dynamic/29/2023/08/9ad7e8322abdb473d30bd9a932f9caeb.webp",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/8a/0c/0c/hotel-penalisa-colsubsidio.jpg?w=700&h=-1&s=1",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/ae/26/1a/caption.jpg?w=1100&h=1100&s=1",
  "https://santiagorobayo.com/wp-content/uploads/2021/07/HOTELES-COLSUBSIDIO-67-1920x1279.jpg",
];

export default function SliderHero() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="slider-hero">
      <img 
        src={images[index]} 
        alt={`Hotel slide ${index + 1}`}
        className="slider-image" 
      />

      {/* Flechas de navegación */}
      <button className="arrow left" onClick={prev} aria-label="Anterior">
        ❮
      </button>
      <button className="arrow right" onClick={next} aria-label="Siguiente">
        ❯
      </button>

      {/* Overlay oscuro */}
      <div className="slider-overlay" />

      {/* Indicadores de slides (opcional) */}
      <div className="slider-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}