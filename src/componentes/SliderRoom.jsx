import { useState, useEffect } from "react";
import "./SliderRoom.css";

const roomImages = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
];

export default function SliderRoom() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % roomImages.length);
  const prev = () => setIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="slider-room">
      <img
        src={roomImages[index]}
        alt={`room-slide-${index}`}
        className="slider-room-image"
      />

      {/* Flechas */}
      <button className="arrow-room left" onClick={prev}>❮</button>
      <button className="arrow-room right" onClick={next}>❯</button>

      {/* Overlay */}
      <div className="slider-room-overlay" />

      {/* Dots */}
      <div className="slider-room-dots">
        {roomImages.map((_, i) => (
          <button
            key={i}
            className={`dot-room ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
