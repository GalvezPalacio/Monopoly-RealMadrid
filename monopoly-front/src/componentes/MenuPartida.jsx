import { useState } from "react";
import "../App.css";  // Corregir la ruta de importación de App.css

export default function MenuPartida({ onPartidaCreada }) {
  const [mensaje, setMensaje] = useState("");

  // Función que se llama cuando se crea una nueva partida
  const crearPartida = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: "Partida sin nombre" }), // Aquí podrías cambiar el nombre de la partida si quieres
      });

      if (response.ok) {
        const partida = await response.json();
        onPartidaCreada(partida); // Enviamos la partida creada al componente padre para que se maneje en App.jsx
      } else {
        setMensaje("Error al crear la partida");
      }
    } catch (error) {
      setMensaje("Fallo en la conexión con el servidor");
    }
  };

  return (
    <div className="text-center p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Empezar partida</h2>

      {/* Botón para crear una nueva partida */}
      <button
        onClick={crearPartida}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition mb-4 w-full"
      >
        Partida nueva
      </button>

      {/* Mostramos un mensaje de error si ocurre alguno */}
      {mensaje && <p className="mt-4 text-red-600">{mensaje}</p>}
    </div>
  );
}