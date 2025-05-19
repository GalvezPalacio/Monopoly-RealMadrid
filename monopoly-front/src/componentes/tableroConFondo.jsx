import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../tableroConFondo.css";
import casillasInfo from "../datos/casillasInfo";
import TarjetaPropiedad from "../componentes/TarjetaPropiedad";
import PanelTurno from "../componentes/panelTurno";
import fichasImagenes from "../datos/fichasImagenes";

export default function TableroConFondo({
  partidaId,
  guardadaEnEstaSesion,
  marcarPartidaComoGuardada,
}) {
  const location = useLocation();
  const jugadorInicial = location.state?.jugadorInicial || "Jugador 1";

  const [posicionJugador, setPosicionJugador] = useState(0);
  const [resultadoDado, setResultadoDado] = useState(null);
  const [accionesDisponibles, setAccionesDisponibles] = useState([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [mensajeBienvenida, setMensajeBienvenida] = useState("");
  const [jugadores, setJugadores] = useState([]);
  const [turnoRecienCambiado, setTurnoRecienCambiado] = useState(false);

  const jugadorActual = jugadores.find((j) => j.turno);

  useEffect(() => {
    if (!partidaId) return;

    document.body.style.backgroundImage =
      'url("/fondo-monopoly-partida-4.jpeg")';
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    fetch(`http://localhost:8081/api/partidas/${partidaId}/jugadores`)
      .then((res) => res.json())
      .then((data) => setJugadores(data));

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
    };
  }, [partidaId]);

  useEffect(() => {
    if (posicionJugador === 0 && jugadores.length > 0) {
      const jugadorTurno = jugadores.find((j) => j.turno);
      if (jugadorTurno) {
        const mensaje = `Empieza ${jugadorTurno.nombre}`;
        setMensajeBienvenida(mensaje);
        setMostrarBienvenida(true);
        const timeout = setTimeout(() => setMostrarBienvenida(false), 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [posicionJugador, jugadores]);

  useEffect(() => {
    if (!turnoRecienCambiado) return;
    const jugadorTurno = jugadores.find((j) => j.turno);
    if (jugadorTurno) {
      const mensaje = `Ahora le toca a ${jugadorTurno.nombre}`;
      setMensajeBienvenida(mensaje);
      setMostrarBienvenida(true);
      const timeout = setTimeout(() => {
        setMostrarBienvenida(false);
        setTurnoRecienCambiado(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [turnoRecienCambiado, jugadores]);

  const tirarDado = async () => {
    if (mostrarBienvenida) setMostrarBienvenida(false);
    if (!jugadorActual) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/tirar`,
        { method: "POST" }
      );
      await res.text();

      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const jugadorActualizado = nuevos.find((j) => j.id === jugadorActual.id);
      const nuevaPos = jugadorActualizado?.posicion ?? 0;

      setResultadoDado(jugadorActualizado.ultimoDado || 0);
      setPosicionJugador(nuevaPos);

      const casilla = casillasInfo[nuevaPos];

      if (casilla.tipo === "propiedad") {
        const response = await fetch(
          `http://localhost:8081/api/jugadores/partida/${partidaId}/posicion/${casilla.id}`
        );
        const propiedadPartida = await response.json();
        console.log("🧩 PropiedadPartida desde backend:", propiedadPartida);

        // Buscar datos visuales desde casillasInfo
        const extra = casillasInfo.find(
          (c) => c.id === propiedadPartida.propiedad.posicion
        );

        // Enriquecer la propiedad
        const propiedadEnriquecida = {
          ...propiedadPartida,
          propiedad: {
            ...propiedadPartida.propiedad,
            ...extra, // fondo, alquileres, hipoteca, color...
          },
        };

        setPropiedadSeleccionada(propiedadEnriquecida);
      } else {
        setPropiedadSeleccionada(casilla);
      }
    } catch (err) {
      console.error("❌ Error al tirar el dado:", err);
    }
  };
  const terminarTurno = async () => {
    if (!jugadorActual) return;
    try {
      await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/terminar-turno`,
        { method: "POST" }
      );
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);
      setResultadoDado(null);
      setPropiedadSeleccionada(null);
      setTimeout(() => setTurnoRecienCambiado(true), 100);
    } catch (err) {
      console.error("❌ Error al terminar el turno:", err);
    }
  };

  const comprarPropiedad = async () => {
    if (!jugadorActual) return;
    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/comprar`,
        { method: "POST" }
      );
      const texto = await res.text();
      alert(texto);
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);
    } catch (err) {
      console.error("❌ Error al comprar:", err);
    }
  };

  const obtenerGridArea = (id) => {
    if (id === 0) return "11 / 11";
    if (id === 10) return "11 / 1";
    if (id === 20) return "1 / 1";
    if (id === 30) return "1 / 11";
    if (id >= 1 && id <= 9) return `11 / ${11 - id}`;
    if (id >= 11 && id <= 19) return `${11 - (id - 10)} / 1`;
    if (id >= 21 && id <= 29) return `1 / ${id - 19}`;
    if (id >= 31 && id <= 39) return `${id - 29} / 11`;
    return "1 / 1";
  };

  return (
    <div className="tablero-fondo">
      {mostrarBienvenida && (
        <div className="modal-bienvenida">
          <div className="contenido-modal">
            <p>{mensajeBienvenida}</p>
            <p>🎲 Tira los dados para continuar la partida.</p>
          </div>
        </div>
      )}

      <div className="rejilla-tablero">
        <img
          src="/tarjetas/fondo-verde.png"
          alt="Fondo derecha"
          className="tapadera-derecha"
        />
        <img
          src="/tarjetas/fondo-verde.png"
          alt="Fondo izquierda"
          className="tapadera-izquierda"
        />

        {casillasInfo.map((casilla) => {
          const posicion = obtenerGridArea(casilla.id);
          let clase = "";
          if (casilla.id >= 0 && casilla.id <= 10) clase = "abajo";
          else if (casilla.id >= 11 && casilla.id <= 20) clase = "izquierda";
          else if (casilla.id >= 21 && casilla.id <= 30) clase = "arriba";
          else if (casilla.id >= 31 && casilla.id <= 39) clase = "derecha";

          return (
            <div
              key={casilla.id}
              className={`casilla-grid ${clase}`}
              style={{ gridArea: posicion }}
              onClick={async () => {
                if (
                  [
                    "propiedad",
                    "salida",
                    "comunidad",
                    "impuesto",
                    "suerte",
                    "estacion",
                    "compania",
                    "visita-carcel",
                    "palco-vip",
                    "vas-grada",
                  ].includes(casilla.tipo)
                ) {
                  if (casilla.tipo === "propiedad") {
                    const res = await fetch(
                      `http://localhost:8081/api/jugadores/partida/${partidaId}/posicion/${casilla.id}`
                    );
                    const propiedadPartida = await res.json();
                    setPropiedadSeleccionada(propiedadPartida);
                  } else {
                    setPropiedadSeleccionada(casilla);
                  }
                }
              }}
            >
              {casilla.nombre}
              {jugadores
                .filter((j) => j.posicion === casilla.id)
                .map((j, index) => (
                  <img
                    key={j.id}
                    src={fichasImagenes[j.ficha]}
                    alt={j.nombre}
                    className="ficha-jugador-img"
                    style={{ left: `${4 + index * 24}px` }}
                  />
                ))}
            </div>
          );
        })}
      </div>

      <div className="botones-partida-container">
        <button
          className="boton-guardar"
          onClick={async () => {
            const nombre = prompt(
              "Introduce un nombre para guardar la partida:"
            );
            if (!nombre) return;

            try {
              const res = await fetch(
                `http://localhost:8081/api/partidas/${partidaId}/guardar?nombre=${encodeURIComponent(
                  nombre
                )}`,
                {
                  method: "PATCH",
                }
              );

              if (res.ok) {
                alert("✅ Partida guardada correctamente.");
                marcarPartidaComoGuardada();
              } else {
                alert("❌ Error al guardar la partida.");
              }
            } catch (error) {
              console.error("Error guardando partida:", error);
            }
          }}
        >
          💾 Guardar partida
        </button>

        <button
          className="boton-finalizar"
          onClick={async () => {
            const confirmar = window.confirm(
              "¿Seguro que quieres finalizar la partida?"
            );
            if (confirmar) {
              if (!guardadaEnEstaSesion) {
                await fetch(
                  `http://localhost:8081/api/partidas/${partidaId}/finalizar`,
                  {
                    method: "DELETE",
                  }
                );
              }
              window.location.href = "/";
            }
          }}
        >
          🛑 Finalizar partida
        </button>
      </div>

      <PanelTurno
        resultado={resultadoDado}
        casilla={casillasInfo[posicionJugador]}
        acciones={accionesDisponibles}
        onTirarDado={tirarDado}
        onTerminarTurno={terminarTurno}
        onComprar={comprarPropiedad}
        tieneElTurno={jugadorActual}
      />

      {propiedadSeleccionada && (
        <TarjetaPropiedad
          propiedad={propiedadSeleccionada}
          onClose={() => setPropiedadSeleccionada(null)}
        />
      )}
    </div>
  );
}
