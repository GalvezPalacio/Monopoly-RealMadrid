import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./inicioPartida.css";

export default function InicioPartida({ partidaId }) {
  const [jugadores, setJugadores] = useState([]);
  const [tiradas, setTiradas] = useState({});
  const [turno, setTurno] = useState(0);
  const [faseFinalizada, setFaseFinalizada] = useState(false);
  const [empatesPendientes, setEmpatesPendientes] = useState([]);
  const [redirigido, setRedirigido] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  const navigate = useNavigate();
  const ambienteRef = useRef(null);
  const pitidoRef = useRef(null);

  // ✅ Intentar reproducir el sonido si está activo
  const intentarReproducir = () => {
    const audio = ambienteRef.current;
    if (audio && audio.paused && sonidoActivo) {
      audio
        .play()
        .catch((e) => console.warn("🔇 No se pudo reproducir audio:", e));
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8081/api/partidas/${partidaId}/jugadores`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Jugadores con ficha:", data);
        setJugadores(data);

        const jugadorConTurno = data.find((j) => j.turno);
        if (jugadorConTurno) {
          console.log("🎯 Ya hay jugador con turno, redirigiendo...");
          setRedirigido(true);
          navigate("/partida", {
            state: {
              jugadorInicial: jugadorConTurno.nombre,
              partidaId: partidaId,
            },
          });
          return;
        }

        const inicial = {};
        data.forEach((j) => (inicial[j.nombre] = []));
        setTiradas(inicial);

        // ✅ Precarga de sonido
        const audioAmbiente = new Audio(
          "/sonidos/ambiente_estadio_completo.mp3"
        );
        audioAmbiente.loop = true;
        audioAmbiente.volume = 0.6;
        ambienteRef.current = audioAmbiente;

        document.addEventListener("click", intentarReproducir, { once: true });
      });

    return () => {
      document.removeEventListener("click", intentarReproducir);
      if (ambienteRef.current) {
        ambienteRef.current.pause();
        ambienteRef.current.currentTime = 0;
      }
    };
  }, [partidaId, navigate]);

  const toggleSonido = () => {
    const audio = ambienteRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setSonidoActivo(true))
        .catch(() => {});
    } else {
      audio.pause();
      setSonidoActivo(false);
    }
  };

  const tirarDado = () => {
    const resultado = Math.floor(Math.random() * 6) + 1;
    const jugador =
      empatesPendientes.length > 0
        ? empatesPendientes[turno]
        : jugadores[turno];

    setTiradas((prev) => ({
      ...prev,
      [jugador.nombre]: [...prev[jugador.nombre], resultado],
    }));

    const siguienteTurno = turno + 1;
    const total =
      empatesPendientes.length > 0
        ? empatesPendientes.length
        : jugadores.length;

    if (siguienteTurno < total) {
      setTurno(siguienteTurno);
    } else {
      setTimeout(() => resolverTiradas(), 500);
    }
  };

  const resolverTiradas = () => {
    const ultimaTirada = Object.entries(tiradas).map(
      ([nombre, lanzamientos]) => ({
        nombre,
        valor: lanzamientos[lanzamientos.length - 1],
        historial: lanzamientos,
      })
    );

    const ordenado = [...ultimaTirada].sort((a, b) => b.valor - a.valor);

    const grupos = {};
    ordenado.forEach((j) => {
      if (!grupos[j.valor]) grupos[j.valor] = [];
      grupos[j.valor].push(j);
    });

    const siguientesEmpates = Object.values(grupos)
      .filter((g) => g.length > 1)
      .flat();

    if (siguientesEmpates.length > 0) {
      setEmpatesPendientes(
        siguientesEmpates.map((j) => ({ nombre: j.nombre }))
      );
      setTurno(0);
    } else {
      setEmpatesPendientes([]);
      setFaseFinalizada(true);
    }
  };

  const obtenerOrdenTurno = () => {
    return Object.entries(tiradas)
      .map(([nombre, lanzamientos]) => ({
        nombre,
        resultado: lanzamientos[lanzamientos.length - 1],
      }))
      .sort((a, b) => b.resultado - a.resultado)
      .map((j, index) => ({ ...j, posicion: index + 1 }));
  };

  const empezarPartida = async () => {
    const primerJugador = obtenerOrdenTurno()[0];
    const ganadorNombre = primerJugador?.nombre;
    if (!ganadorNombre) return;

    const ganador = jugadores.find((j) => j.nombre === ganadorNombre);
    if (!ganador) return;

    try {
      await fetch(
        `http://localhost:8081/api/jugadores/establecer-turno-inicial?jugadorId=${ganador.id}&partidaId=${partidaId}`,
        { method: "POST" }
      );
      console.log("✅ Turno inicial asignado al jugador:", ganador.nombre);
    } catch (error) {
      console.error("❌ Error al asignar turno inicial:", error);
    }

    if (ambienteRef.current) {
      ambienteRef.current.pause();
      ambienteRef.current.currentTime = 0;
    }

    const pitido = new Audio("/public/sonidos/pitido-arbitro.mp3");
    pitido.volume = 1;
    pitido.play().catch(() => {});
    pitidoRef.current = pitido;

    navigate("/partida", {
      state: {
        jugadorInicial: ganador.nombre,
        partidaId: partidaId,
      },
    });
  };

  if (redirigido) return null;

  return (
    <div className="pantalla-inicio-partida">
      <div className="bienvenida-jugadores">
        <h2>Bienvenidos a RealMadridPoly</h2>
        <ul>
          {jugadores.map((j) => (
            <li key={j.id}>
              <strong>{j.nombre}</strong>
            </li>
          ))}
        </ul>

        {!faseFinalizada ? (
          <div>
            {Object.entries(tiradas).map(([nombre, resultados]) => (
              <p key={nombre}>
                {nombre}:{" "}
                {resultados.map((r, i) => (
                  <span key={i}>🎲 {r} </span>
                ))}
              </p>
            ))}
            <p>
              Turno de{" "}
              <strong>
                {empatesPendientes.length > 0
                  ? empatesPendientes[turno]?.nombre
                  : jugadores[turno]?.nombre}
              </strong>
              : tira el dado
            </p>
            <button onClick={tirarDado}>🎲 Tirar dado</button>
          </div>
        ) : (
          <div>
            <h3>Orden de turno:</h3>
            <ul>
              {obtenerOrdenTurno().map((jugador) => (
                <li key={jugador.nombre}>
                  {jugador.posicion}. {jugador.nombre} 🎲 ({jugador.resultado})
                </li>
              ))}
            </ul>
            <button onClick={empezarPartida}>Empezar partida</button>
          </div>
        )}
        <button onClick={toggleSonido} className="icono-sonido">
          {sonidoActivo ? "🔊" : "🔇"}
        </button>
      </div>
    </div>
  );
}
