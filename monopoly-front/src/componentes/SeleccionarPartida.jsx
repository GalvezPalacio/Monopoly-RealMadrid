import { useState } from "react";

export default function SeleccionarPartida({ partidas, onSeleccion }) {
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);

  const continuarPartida = async () => {
    if (!partidaSeleccionada) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/partidas/${partidaSeleccionada}/continuar`,
        { method: "PATCH" }
      );

      if (res.ok) {
        onSeleccion(partidaSeleccionada); // Navega si la petición fue exitosa
      } else {
        alert("❌ Error al continuar la partida");
      }
    } catch (error) {
      console.error("❌ Error al continuar la partida:", error);
      alert("❌ Fallo al conectar con el servidor");
    }
  };

  return (
    <div className="seleccionar-partida p-6 bg-white rounded-xl shadow-md w-fit mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Selecciona una partida guardada</h2>

      <select
        value={partidaSeleccionada || ""}
        onChange={(e) => setPartidaSeleccionada(Number(e.target.value))}
        className="border px-4 py-2 rounded-md mb-4 w-full"
      >
        <option value="">-- Elige una partida --</option>
        {partidas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre || `Partida ${p.id}`}
          </option>
        ))}
      </select>

      <button
        onClick={continuarPartida}
        disabled={!partidaSeleccionada}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
      >
        Continuar
      </button>
    </div>
  );
}