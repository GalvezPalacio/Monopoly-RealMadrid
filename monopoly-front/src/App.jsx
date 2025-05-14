import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import CrearJugador from "./CrearJugador";
import TableroConFondo from "./componentes/tableroConFondo";
import InicioPartida from "./componentes/inicioPartida";
import MenuPartida from "./componentes/MenuPartida";
import SeleccionarPartida from "./componentes/SeleccionarPartida";

function AppWrapper() {
  const [partidaGuardada, setPartidaGuardada] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarSelectorPartida, setMostrarSelectorPartida] = useState(false);
  const [jugadores, setJugadores] = useState([]);
  const [partidaIdActual, setPartidaIdActual] = useState(null);
  const [partidasGuardadas, setPartidasGuardadas] = useState([]);
  const [guardadaEnEstaSesion, setGuardadaEnEstaSesion] = useState(false); // ✅ NUEVO

  const navigate = useNavigate();

  useEffect(() => {
    const cargarPartidas = async () => {
      const response = await fetch("http://localhost:8081/api/partidas");
      const data = await response.json();
      setPartidaGuardada(data.hayPartidaActiva);
      setPartidasGuardadas(data.partidas.filter(p => p.guardada));
    };
    cargarPartidas();
  }, []);

  const manejarPartidaNueva = async () => {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/partidas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: "Partida sin nombre" }),
      });

      if (response.ok) {
        const nuevaPartida = await response.json();
        setPartidaGuardada(true);
        setPartidaIdActual(nuevaPartida.id);
        setMostrarFormulario(true);
        setMostrarSelectorPartida(false);
        setGuardadaEnEstaSesion(false); // ✅ se marca como NO guardada
      } else {
        console.error("Error al crear la partida");
      }
    } catch (error) {
      console.error("Fallo al conectar con el servidor", error);
    }
  };

  const alternarSelectorPartida = () => {
    setMostrarSelectorPartida(prev => !prev);
    setMostrarFormulario(false);
  };

  const agregarJugador = (jugador) => {
    setJugadores((prev) => [...prev, jugador]);
  };

  // ✅ función que pasamos al componente hijo
  const marcarPartidaComoGuardada = () => {
    setGuardadaEnEstaSesion(true);
  };

  return (
    <div className="App">
      <div className="menu">
        <button
          disabled={partidaGuardada}
          onClick={manejarPartidaNueva}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition mb-4 w-full"
        >
          Partida nueva
        </button>

        <button
          disabled={partidasGuardadas.length === 0}
          onClick={alternarSelectorPartida}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition mb-4 w-full"
        >
          Continuar partida
        </button>

        <button className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition mb-4 w-full">
          Ver reglas
        </button>
      </div>

      {mostrarFormulario && (
        <CrearJugador
          onJugadorCreado={agregarJugador}
          partidaId={partidaIdActual}
        />
      )}

      {jugadores.length >= 2 && (
        <button
          onClick={() =>
            navigate("/partida", {
              state: {
                partidaId: partidaIdActual,
              },
            })
          }
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition mt-4 w-full"
        >
          Empezar partida
        </button>
      )}

      {mostrarSelectorPartida && (
        <SeleccionarPartida
          partidas={partidasGuardadas}
          onSeleccion={(id) => {
            setPartidaIdActual(id);
            setGuardadaEnEstaSesion(false); // ✅ asumimos que no se ha vuelto a guardar
            navigate("/partida", {
              state: { partidaId: id },
            });
          }}
        />
      )}
    </div>
  );
}

function PantallaInicioPartida() {
  const location = useLocation();
  const { jugadorInicial, partidaId } = location.state || {};

  if (!partidaId) {
    return <p>❌ Error: no se ha recibido el ID de la partida.</p>;
  }

  return jugadorInicial ? (
    <TableroConFondo
      jugadorInicial={jugadorInicial}
      partidaId={partidaId}
    />
  ) : (
    <InicioPartida
      partidaId={partidaId}
    />
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppWrapper />} />
        <Route path="/partida" element={<PantallaInicioPartida />} />
      </Routes>
    </Router>
  );
}