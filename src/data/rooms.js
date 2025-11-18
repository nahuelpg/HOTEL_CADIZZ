// src/data/rooms.js
export const ROOMS = [
  {
    id: "std",
    nombre: "Standard",
    camas: "1 Queen",
    huespedesMax: 2,
    metros: 22,
    precio: 65,          // USD/noche
    stock: 6,            // unidades de esta categoría en el hotel
    imagen: "/assets/rooms/standard.jpg",
    amenities: ["Wi-Fi", "TV", "A/C", "Baño privado"]
  },
  {
    id: "dbl",
    nombre: "Doble",
    camas: "2 Twin",
    huespedesMax: 3,
    metros: 28,
    precio: 85,
    stock: 5,
    imagen: "/assets/rooms/double.jpg",
    amenities: ["Wi-Fi", "TV", "A/C", "Vista ciudad"]
  },
  {
    id: "sui",
    nombre: "Suite Cadizz",
    camas: "1 King",
    huespedesMax: 4,
    metros: 40,
    precio: 140,
    stock: 3,
    imagen: "/assets/rooms/suite.jpg",
    amenities: ["Wi-Fi", "Smart TV", "A/C", "Jacuzzi", "Balcón"]
  }
];
