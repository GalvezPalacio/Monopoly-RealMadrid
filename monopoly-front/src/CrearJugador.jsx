import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import trofeo from "./assets/fichas/trofeo-champion.png";
import escudo from "./assets/fichas/escudo-real-madrid.png";
import balon from "./assets/fichas/balon-oro.png";
import autobus from "./assets/fichas/autobus-real-madrid.png";
import camiseta from "./assets/fichas/camiseta.png";
import botin from "./assets/fichas/bota-oro.png";
import portero from "./assets/fichas/portero-legendario.png";
import bernabeu from "./assets/fichas/santiago-bernabeu.png";

export default function CrearJugador({ partidaId }) {
  const [nombre, setNombre] = useState("");
  const [fichaSeleccionada, setFichaSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [jugadoresExistentes, setJugadoresExistentes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarJugadores = async () => {
      const response = await fetch("http://localhost:8081/api/jugadores");
      const data = await response.json();
      setJugadoresExistentes(data);
    };
    cargarJugadores();
  }, []);

  const FICHAS_DISPONIBLES = [
    "Trofeo Champions",
    "Escudo Real Madrid",
    "Balón de Oro",
    "Autobús del equipo",
    "Camiseta Blanca",
    "Botín de oro",
    "Portero legendario",
    "Santiago Bernabéu",
  ];

  const fichasOcupadas = jugadoresExistentes
    .filter((j) => j.partida.id === partidaId)
    .map((j) => j.ficha);
  const fichasDisponibles = FICHAS_DISPONIBLES.filter(
    (f) => !fichasOcupadas.includes(f)
  );

  const jugadoresDeEstaPartida = jugadoresExistentes.filter(
    (j) => j.partida.id === partidaId
  );

  const crearJugador = async () => {
    if (!nombre.trim() || !fichaSeleccionada) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    const response = await fetch("http://localhost:8081/api/jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        ficha: fichaSeleccionada,
        partidaId,
      }),
    });

    const data = await response.json();
    if (data.nombre && data.ficha) {
      setMensaje(`Jugador creado: ${data.nombre} con ficha: ${data.ficha}`);
      setNombre("");
      setFichaSeleccionada("");
      setJugadoresExistentes((prev) => [...prev, data]);
    } else {
      setMensaje("Error al crear el jugador. Revisa los datos enviados.");
    }
  };

  const obtenerImagenFicha = (nombreFicha) => {
    switch (nombreFicha) {
      case "Trofeo Champions":
        return trofeo;
      case "Escudo Real Madrid":
        return escudo;
      case "Balón de Oro":
        return balon;
      case "Autobús del equipo":
        return autobus;
      case "Camiseta Blanca":
        return camiseta;
      case "Botín de oro":
        return botin;
      case "Portero legendario":
        return portero;
      case "Santiago Bernabéu":
        return bernabeu;
      default:
        return null;
    }
  };

  return (
    <div className="crear-jugador p-6 bg-white rounded-xl shadow-md w-fit mx-auto mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Crear jugador</h2>

      <input
        type="text"
        value={nombre}
        placeholder="Nombre del jugador"
        onChange={(e) => setNombre(e.target.value)}
        className="border px-4 py-2 rounded-md mb-4 w-full"
      />

      <div className="mb-4 text-left">
        <label htmlFor="ficha" className="block font-semibold mb-2">
          Selecciona una ficha:
        </label>
        <select
          id="ficha"
          value={fichaSeleccionada}
          onChange={(e) => setFichaSeleccionada(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        >
          <option value="">-- Elige ficha --</option>
          {fichasDisponibles.map((ficha) => (
            <option key={ficha} value={ficha}>
              {ficha}
            </option>
          ))}
        </select>

        {fichaSeleccionada && obtenerImagenFicha(fichaSeleccionada) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="font-medium">Has elegido:</span>
            <img
              src={obtenerImagenFicha(fichaSeleccionada)}
              alt={fichaSeleccionada}
              className="w-8 h-8 object-contain"
            />
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          crearJugador();
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Crear jugador
      </button>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}

      {jugadoresDeEstaPartida.length >= 2 && (
        <button
          onClick={() =>
            navigate("/partida", {
              state: {
                partidaId: partidaId,
              },
            })
          }
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Empezar partida
        </button>
      )}
    </div>
  );
}
