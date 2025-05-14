import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Partida.css";

export default function Partida() {
  const location = useLocation();
  const partidaId = location.state?.partidaId || 1;

  const [jugadores, setJugadores] = useState([]);
  const [jugadorActual, setJugadorActual] = useState(null);
  const [posicionJugador, setPosicionJugador] = useState(0);
  const [mensajeDado, setMensajeDado] = useState("");
  const [mostrarMensajeInicio, setMostrarMensajeInicio] = useState(true);

  // Obtener todos los jugadores y encontrar el que tiene el turno
  useEffect(() => {
    fetch(`http://localhost:8081/api/jugadores/por-partida?partidaId=${partidaId}`)
      .then((res) => res.json())
      .then((data) => {
        setJugadores(data);
        const actual = data.find(j => j.turno);
        setJugadorActual(actual);
        setPosicionJugador(actual?.posicion || 0);
        setMensajeDado(`Empieza ${actual?.nombre}. 🎲 Tira los dados para comenzar.`);
      });
  }, [partidaId]);

  const tirarDado = async () => {
    if (!jugadorActual) return;

    if (mostrarMensajeInicio) {
      setMostrarMensajeInicio(false);
    }

    try {
      const res = await fetch(`http://localhost:8081/api/jugadores/${jugadorActual.id}/tirar`, {
        method: "POST"
      });

      const mensaje = await res.text();
      setMensajeDado(mensaje);

      // Actualizar posición visual
      const updated = await fetch(`http://localhost:8081/api/jugadores/${jugadorActual.id}`);
      const jugadorActualizado = await updated.json();
      setPosicionJugador(jugadorActualizado.posicion);

    } catch (error) {
      console.error("❌ Error al tirar dado:", error);
      setMensajeDado("Error al tirar el dado. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="pagina-partida">
      <div className="panel-lateral">
        <h2>{jugadorActual?.nombre}</h2>
        <p>Posición: {posicionJugador}</p>

        <button onClick={tirarDado}>Tirar dado</button>

        {mostrarMensajeInicio ? (
          <p className="mt-4 text-yellow-300 font-semibold">
            {mensajeDado}
          </p>
        ) : (
          mensajeDado && (
            <p className="mt-4 text-yellow-300 font-semibold">{mensajeDado}</p>
          )
        )}
      </div>
    </div>
  );
}