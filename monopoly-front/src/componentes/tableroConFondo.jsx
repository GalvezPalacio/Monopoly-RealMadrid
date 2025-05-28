import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../tableroConFondo.css";
import casillasInfo from "../datos/casillasInfo";
import TarjetaPropiedad from "../componentes/TarjetaPropiedad";
import PanelTurno from "../componentes/panelTurno";
import fichasImagenes from "../datos/fichasImagenes";
import SelectorConstruccion from "../componentes/SelectorConstructor";
import TarjetaMensaje from "./TarjetaMensaje"; // Ajusta la ruta si es necesario

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
  const [opcionesConstruccion, setOpcionesConstruccion] = useState({
    gruposConCasas: [],
    gruposConHotel: [],
  });
  const [mostrarSelectorCasa, setMostrarSelectorCasa] = useState(false);
  const [propiedadesJugador, setPropiedadesJugador] = useState([]);
  const [mostrarSelectorHotel, setMostrarSelectorHotel] = useState(false);
  const [mensajeEspecial, setMensajeEspecial] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null);
  const [mostrarTarjetaReal, setMostrarTarjetaReal] = useState(false);
  const [mensajeSalida, setMensajeSalida] = useState(null);

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

        const timeout = setTimeout(() => {
          setMostrarBienvenida(false);
        }, 3000);

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
      const mensaje = await res.text();
      console.log("🎲", mensaje);

      if (mensaje.includes("casilla de salida")) {
        setMensajeSalida(
          "💸 Has pasado por la casilla de salida. ¡Cobras 200€!"
        );
        setTimeout(() => setMensajeSalida(null), 3000);
      }

      const mensajeSinSalida = mensaje.replace(
        "Has pasado por la casilla de salida. ¡Cobras 200€! ",
        ""
      );

      // Detectar tarjeta de COMUNIDAD
      if (
        mensajeSinSalida.includes("Caja de Comunidad") ||
        mensajeSinSalida.includes("Has caído en 'Caja de Comunidad'")
      ) {
        try {
          const resTarjeta = await fetch(
            "http://localhost:8081/api/tarjetas/comunidad"
          );
          const tarjeta = await resTarjeta.json();
          setTipoMensaje(tarjeta.tipo);
          setMensajeEspecial(tarjeta.mensaje);
          setMostrarTarjetaReal(false);

          // 🧠 Aplicar efecto automáticamente
          await fetch("http://localhost:8081/api/tarjetas/aplicar", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              mensaje: tarjeta.mensaje,
              jugadorId: jugadorActual.id,
            }),
          })
            .then((r) => r.text())
            .then((resultado) => {
              console.log("📩 Efecto aplicado:", resultado);
            });
        } catch (e) {
          console.error("❌ Error al obtener/aplicar tarjeta de comunidad:", e);
        }

        // Detectar tarjeta de SUERTE
      } else if (mensajeSinSalida.includes("Has caído en 'Suerte'")) {
        try {
          const resTarjeta = await fetch(
            "http://localhost:8081/api/tarjetas/suerte"
          );
          const tarjeta = await resTarjeta.json();
          setTipoMensaje(tarjeta.tipo);
          setMensajeEspecial(tarjeta.mensaje);
          setMostrarTarjetaReal(false);

          // 🧠 Aplicar efecto automáticamente
          await fetch("http://localhost:8081/api/tarjetas/aplicar", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              mensaje: tarjeta.mensaje,
              jugadorId: jugadorActual.id,
            }),
          })
            .then((r) => r.text())
            .then((resultado) => {
              console.log("📩 Efecto aplicado:", resultado);
            });
        } catch (e) {
          console.error("❌ Error al obtener/aplicar tarjeta de suerte:", e);
        }
      } else {
        setTipoMensaje(null);
        setMensajeEspecial(null);
        setMostrarTarjetaReal(false);
      }

      // Refrescar estado general
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const jugadorActualizado = nuevos.find((j) => j.id === jugadorActual.id);
      const nuevaPos = jugadorActualizado?.posicion ?? 0;

      setResultadoDado(jugadorActualizado.ultimoDado || 0);
      setPosicionJugador(nuevaPos);

      const opcionesRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/opciones-construccion?jugadorId=${jugadorActual.id}`
      );
      const opciones = await opcionesRes.json();
      setOpcionesConstruccion(opciones);

      const propsRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      );
      const props = await propsRes.json();
      setPropiedadesJugador(props);

      const casilla = casillasInfo[nuevaPos];
      setPropiedadSeleccionada(casilla);

      if (["propiedad", "compania", "estacion"].includes(casilla.tipo)) {
        const propiedadPartidaRes = await fetch(
          `http://localhost:8081/api/propiedadPartida/partida/${partidaId}/posicion/${casilla.id}`
        );

        if (propiedadPartidaRes.ok) {
          const propiedadPartida = await propiedadPartidaRes.json();

          if (!propiedadPartida.duenio) {
            setAccionesDisponibles(["Comprar"]);
          } else if (propiedadPartida.duenio.id === jugadorActual.id) {
            setAccionesDisponibles(["Hipotecar"]);
          } else {
            setAccionesDisponibles(["Pagar alquiler"]);
          }
        } else {
          console.warn("No se encontró propiedadPartida para esta casilla.");
          setAccionesDisponibles([]);
        }
      } else {
        setAccionesDisponibles([]);
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

      setTimeout(() => {
        setTurnoRecienCambiado(true);
      }, 100);
    } catch (err) {
      console.error("❌ Error al terminar el turno:", err);
    }
  };

  const comprarPropiedad = async () => {
    if (!jugadorActual) return;

    try {
      const res = await fetch(
        "http://localhost:8081/api/propiedadPartida/comprar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jugadorId: jugadorActual.id,
            partidaId: partidaId,
            casillaId: posicionJugador, // puedes usar propiedadSeleccionada.id si lo prefieres
          }),
        }
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

  const construirCasa = async (propiedadId) => {
    if (!jugadorActual || !partidaId) return;

    try {
      const res = await fetch(
        "http://localhost:8081/api/propiedadPartida/construir-casa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jugadorId: jugadorActual.id,
            propiedadId,
          }),
        }
      );

      const mensaje = await res.text();
      alert(mensaje);

      // 🔁 ACTUALIZAR propiedades después de construir
      const propsRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      );
      const props = await propsRes.json();
      setPropiedadesJugador(props);

      // 🔁 ACTUALIZAR opciones de construcción después de construir
      const opcionesRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/opciones-construccion?jugadorId=${jugadorActual.id}`
      );
      const opciones = await opcionesRes.json();
      setOpcionesConstruccion(opciones);

      setMostrarSelectorCasa(false);
    } catch (err) {
      console.error("❌ Error al construir casa:", err);
    }
  };

  const construirHotel = async (propiedadId) => {
    if (!jugadorActual || !partidaId) return;

    try {
      const res = await fetch(
        "http://localhost:8081/api/propiedadPartida/construir-hotel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jugadorId: jugadorActual.id,
            propiedadId,
            partidaId,
          }),
        }
      );

      const mensaje = await res.text();
      alert(mensaje);

      // 🔁 Refrescar propiedades (para actualizar visualización de hoteles)
      const propsRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      );
      const props = await propsRes.json();
      setPropiedadesJugador(props); // 👈 Esto faltaba

      // 🔁 Refrescar jugadores
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      // 🔁 Refrescar opciones de construcción
      const opcionesRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/opciones-construccion?jugadorId=${jugadorActual.id}`
      );
      const nuevasOpciones = await opcionesRes.json();
      setOpcionesConstruccion(nuevasOpciones);

      setMostrarSelectorHotel(false); // opcional: cierra selector al construir
    } catch (err) {
      console.error("❌ Error al construir hotel:", err);
    }
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
              onClick={() => {
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
                  setPropiedadSeleccionada(casilla);
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

        <div className="tarjeta-suerte-diagonal">
          <img src="/tarjetas/suerte-tablero.png" alt="Suerte" />
        </div>
        <div className="tarjeta-comunidad-vertical">
          <img src="/tarjetas/comunidad-tablero.png" alt="Comunidad" />
        </div>
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
        opcionesConstruccion={opcionesConstruccion}
        onConstruirCasa={() => setMostrarSelectorCasa(true)}
        onConstruirHotel={() => setMostrarSelectorHotel(true)}
      />

      {propiedadSeleccionada && (
        <TarjetaPropiedad
          propiedad={propiedadSeleccionada}
          tipoEspecial={tipoMensaje} // nuevo
          onClose={() => {
            setPropiedadSeleccionada(null);

            // Si es tipo suerte o comunidad → mostrar la tarjeta real
            if (tipoMensaje === "suerte" || tipoMensaje === "comunidad") {
              setMostrarTarjetaReal(true);
            }
          }}
        />
      )}
      {mostrarSelectorCasa && (
        <SelectorConstruccion
          propiedades={propiedadesJugador.filter((p) =>
            opcionesConstruccion.gruposConCasas.includes(p.propiedad.grupoColor)
          )}
          tipo="casa" // ✅ NECESARIO para que se vean las casas
          onSeleccionar={async (propiedadId) => {
            await construirCasa(propiedadId);
            setMostrarSelectorCasa(false);
          }}
          onCerrar={() => setMostrarSelectorCasa(false)}
        />
      )}
      {mostrarSelectorHotel && (
        <SelectorConstruccion
          propiedades={propiedadesJugador.filter((p) =>
            opcionesConstruccion.gruposConHotel.includes(p.propiedad.grupoColor)
          )}
          tipo="hotel"
          onSeleccionar={(id) => {
            construirHotel(id);
            setMostrarSelectorHotel(false);
          }}
          onCerrar={() => setMostrarSelectorHotel(false)}
        />
      )}
      {mostrarTarjetaReal && mensajeEspecial && (
        <TarjetaMensaje
          mensaje={mensajeEspecial}
          tipo={tipoMensaje}
          onCerrar={() => {
            setMostrarTarjetaReal(false);
            setMensajeEspecial(null);
            setTipoMensaje(null);
          }}
        />
      )}
      {mensajeSalida && <div className="flash-salida">{mensajeSalida}</div>}
    </div>
  );
}
