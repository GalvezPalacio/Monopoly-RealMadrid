import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../tableroConFondo.css";
import casillasInfo from "../datos/casillasInfo";
import TarjetaPropiedad from "../componentes/TarjetaPropiedad";
import PanelTurno from "../componentes/panelTurno";
import fichasImagenes from "../datos/fichasImagenes";
import SelectorConstruccion from "../componentes/SelectorConstructor";
import TarjetaMensaje from "./TarjetaMensaje"; // Ajusta la ruta si es necesario
import MiniTarjetaPropiedad from "./MiniTarjetaPropiedad";

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
  const [propiedadAdjudicada, setPropiedadAdjudicada] = useState(null);
  const [mostrarAdjudicacion, setMostrarAdjudicacion] = useState(false);
  const [mostrarTarjetaCarcel, setMostrarTarjetaCarcel] = useState(false);
  const [mostrarPopupGrada, setMostrarPopupGrada] = useState(false);
  const jugadorActual = jugadores.find((j) => j.turno);
  const [mostrarSelectorDevolver, setMostrarSelectorDevolver] = useState(false);
  const [propiedadesDevueltas, setPropiedadesDevueltas] = useState([]);

  const colorTextoDesdeHex = {
    "#8B4513": "marron",
    "#87CEEB": "azul-claro",
    "#FF69B4": "rosa",
    "#FFA500": "naranja",
    "#DC143C": "rojo",
    "#FFD700": "amarillo",
    "#228B22": "verde",
    "#00008B": "azul-oscuro",
  };

const pagarSalidaCarcel = async () => {
  try {
    const res = await fetch(
      `http://localhost:8081/api/jugadores/${jugadorActual.id}/salirPagando`,
      { method: "POST" }
    );

    const data = await res.json();
    const { mensaje } = data;

    alert(mensaje); // Puedes usar un modal si lo prefieres

    // 🔁 Refrescar jugadores
    const nuevos = await fetch(
      `http://localhost:8081/api/partidas/${partidaId}/jugadores`
    ).then((r) => r.json());

    setJugadores(nuevos);

    // ✅ Mostrar botón de tirar dado manualmente
    setMostrarBotonTirar(true);

    // Limpiar cualquier estado anterior para evitar errores
    setResultadoDado(null);
    setPropiedadSeleccionada(null);
    setAccionesDisponibles([]);
    setMensajeBienvenida(null);
    setMostrarBienvenida(false);
  } catch (error) {
    console.error("❌ Error al pagar salida:", error);
  }
};


  const tirarDesdeCarcel = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/tirarDesdeCarcel`,
        { method: "POST" }
      );

      const data = await res.json();
      const { dado1, dado2, suma, mensaje, salio } = data;

      console.log("🎲 Dados cárcel:", dado1, dado2, "→", suma);
      alert(mensaje);

      // 🔁 Refrescar jugadores
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());

      setJugadores(nuevos);

      const actualizado = nuevos.find((j) => j.id === jugadorActual.id);
      setResultadoDado({ dado1, dado2, suma });
      setPosicionJugador(actualizado?.posicion ?? 0);

      // ✅ Mostrar mensaje de cambio de turno si ha cambiado
      const siguiente = nuevos.find((j) => j.turno);
      if (siguiente && siguiente.id !== jugadorActual.id) {
        const mensaje = `Ahora le toca a ${siguiente.nombre}`;
        setMensajeBienvenida(mensaje);
        setMostrarBienvenida(true);
        setTimeout(() => {
          setMostrarBienvenida(false);
        }, 2000);
      }

      const casilla = casillasInfo[actualizado.posicion];

      if (
        salio &&
        ["propiedad", "compania", "estacion"].includes(casilla.tipo)
      ) {
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

          setPropiedadSeleccionada(casilla); // ✅ Mostrar popup de propiedad
        }
      } else {
        setAccionesDisponibles([]);
        setPropiedadSeleccionada(null);
      }
    } catch (error) {
      console.error("❌ Error al tirar desde la cárcel:", error);
    }
  };
  const guardarTarjeta = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/guardarTarjetaSalirCarcel`,
        { method: "POST" }
      );

      if (res.ok) {
        console.log("✅ Tarjeta guardada correctamente.");
      } else {
        console.warn("❌ Error al guardar tarjeta.");
      }

      setMostrarTarjetaReal(false); // cerrar popup
      setMensajeEspecial(null); // borrar mensaje
      setTipoMensaje(null); // borrar tipo
    } catch (error) {
      console.error("❌ Error guardando tarjeta:", error);
    }
  };

  const devolverPropiedad = async (propiedadId) => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/propiedadPartida/devolver`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jugadorId: jugadorActual.id,
            propiedadId,
          }),
        }
      );

      const texto = await res.text();
      alert(texto);

      // Refrescar jugadores y propiedades tras devolver
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const propsRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      );
      const props = await propsRes.json();
      setPropiedadesJugador(props);

      setMostrarSelectorDevolver(false);
      setPropiedadesDevueltas([]);
    } catch (error) {
      console.error("❌ Error al devolver propiedad:", error);
      alert("Error al devolver la propiedad");
    }
  };

  const usarTarjetaCarcel = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/usarTarjetaSalirCarcel`,
        { method: "POST" }
      );

      const mensaje = await res.text();
      alert(mensaje); // puedes reemplazar por modal elegante

      // Refrescar jugadores y permitir tirar dado
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());

      setJugadores(nuevos);
      setResultadoDado(null); // permitir nueva tirada
    } catch (error) {
      console.error("❌ Error al usar tarjeta:", error);
    }
  };

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
        }, 2000);

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
      }, 2000);

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

      const data = await res.json(); // ✅ ahora esperamos un JSON
      const { dado1, dado2, suma, mensaje } = data;

      console.log("🎲 Dados:", dado1, dado2, "→ total:", suma);
      console.log("📩 Mensaje:", mensaje);

      // 👇 Detectar cárcel directa
      if (mensaje === "CARCEL_DIRECTA") {
        setMostrarPopupGrada(true);
        return;
      }

      if (mensaje.includes("casilla de salida")) {
        setMensajeSalida(
          "💸 Has pasado por la casilla de salida. ¡Cobras 200€!"
        );
        setTimeout(() => setMensajeSalida(null), 2000);
      }

      const mensajeSinSalida = mensaje.replace(
        "Has pasado por la casilla de salida. ¡Cobras 200€! ",
        ""
      );

      // Tarjeta de COMUNIDAD
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
        } catch (e) {
          console.error("❌ Error al obtener/aplicar tarjeta de comunidad:", e);
        }
      } else if (mensajeSinSalida.includes("Has caído en 'Suerte'")) {
        try {
          const resTarjeta = await fetch(
            "http://localhost:8081/api/tarjetas/suerte"
          );
          const tarjeta = await resTarjeta.json();
          setTipoMensaje(tarjeta.tipo);
          setMensajeEspecial(tarjeta.mensaje);
          setMostrarTarjetaReal(false);
        } catch (e) {
          console.error("❌ Error al obtener/aplicar tarjeta de suerte:", e);
        }
      } else {
        setTipoMensaje(null);
        setMensajeEspecial(null);
        setMostrarTarjetaReal(false);
      }

      // Actualizar estado general
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const jugadorActualizado = nuevos.find((j) => j.id === jugadorActual.id);
      const nuevaPos = jugadorActualizado?.posicion ?? 0;

      // ✅ Guardamos los dados completos en el estado
      setResultadoDado({ dado1, dado2, suma });
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
  const enviarACarcel = async () => {
    setMostrarPopupGrada(false); // Cierra el popup

    await fetch(
      `http://localhost:8081/api/jugadores/${jugadorActual.id}/enviarACarcel`,
      { method: "POST" }
    );

    const nuevos = await fetch(
      `http://localhost:8081/api/partidas/${partidaId}/jugadores`
    ).then((r) => r.json());

    setJugadores(nuevos);

    // ✅ Mostrar mensaje de turno al nuevo jugador
    const siguiente = nuevos.find((j) => j.turno);
    if (siguiente) {
      const mensaje = `Ahora le toca a ${siguiente.nombre}`;
      setMensajeBienvenida(mensaje);
      setMostrarBienvenida(true);
      setTimeout(() => {
        setMostrarBienvenida(false);
      }, 2000);
    }

    setResultadoDado(null);
    setPropiedadSeleccionada(null);
  };

  window.enviarACarcel = enviarACarcel;

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
        onTirarDesdeCarcel={tirarDesdeCarcel}
        onPagarCarcel={pagarSalidaCarcel}
        onUsarTarjetaCarcel={usarTarjetaCarcel}
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
          onCerrar={async () => {
            setMostrarTarjetaReal(false);
            setMensajeEspecial(null);
            setTipoMensaje(null);

            if (mensajeEspecial.toLowerCase().includes("pierdes un turno")) {
              await fetch(
                `http://localhost:8081/api/jugadores/${jugadorActual.id}/perder-turno`,
                {
                  method: "POST",
                }
              );
            }

            if (
              mensajeEspecial.toLowerCase().includes("te libras de la cárcel")
            ) {
              setMostrarTarjetaCarcel(true);
            } else if (
              mensajeEspecial
                .toLowerCase()
                .includes("devuelve una propiedad al banco")
            ) {
              setMostrarSelectorDevolver(true); // 🔁 abriremos popup nuevo
              const props = await fetch(
                `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
              ).then((r) => r.json());

              const sinConstruccion = props.filter(
                (p) => p.casas === 0 && p.hotel === false
              );
              setPropiedadesDevueltas(sinConstruccion);
            }

            // ✅ APLICAR EL EFECTO AL CERRAR
            try {
              const res = await fetch(
                "http://localhost:8081/api/tarjetas/aplicar",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    mensaje: mensajeEspecial,
                    jugadorId: jugadorActual.id,
                  }),
                }
              );
              const resultado = await res.text();
              console.log("📩 Efecto aplicado:", resultado);
              // Detectar si es una adjudicación con ID
              if (resultado.startsWith("🎁 Te han adjudicado")) {
                const idMatch = resultado.match(/\[ID:(\d+)\]/); // buscar ID entre corchetes

                if (idMatch) {
                  const id = parseInt(idMatch[1], 10);
                  const casilla = casillasInfo.find((c) => c.id === id);

                  if (casilla) {
                    console.log(
                      "✅ Casilla adjudicada encontrada:",
                      casilla.nombre
                    );
                    setPropiedadAdjudicada(casilla);
                    setMostrarAdjudicacion(true);
                  } else {
                    console.error("❌ No se encontró casilla con id:", id);
                  }
                } else {
                  console.warn(
                    "⚠️ No se encontró ID en el mensaje:",
                    resultado
                  );
                }
              }

              // 🔁 Actualizar jugadores después de aplicar efecto
              const nuevos = await fetch(
                `http://localhost:8081/api/partidas/${partidaId}/jugadores`
              ).then((r) => r.json());
              setJugadores(nuevos);

              const jugadorActualizado = nuevos.find(
                (j) => j.id === jugadorActual.id
              );
              const nuevaPos = jugadorActualizado?.posicion ?? 0;
              setPosicionJugador(nuevaPos);

              // Revisar la nueva casilla y abrir su popup si es necesario
              const nuevaCasilla = casillasInfo[nuevaPos];
              if (!["suerte", "comunidad"].includes(nuevaCasilla.tipo)) {
                setPropiedadSeleccionada(nuevaCasilla);
              }
            } catch (err) {
              console.error("❌ Error al aplicar efecto de tarjeta:", err);
            }
          }}
          onGuardar={guardarTarjeta} // ✅ añadido aquí correctamente
        />
      )}
      {mostrarAdjudicacion && propiedadAdjudicada && (
        <div className="popup-adjudicacion-final">
          <div className="texto-adjudicacion">
            🎁 Te han adjudicado <strong>{propiedadAdjudicada.nombre}</strong>
          </div>

          {/* Mini tarjeta estilo propiedad como componente */}
          <MiniTarjetaPropiedad propiedad={propiedadAdjudicada} />

          <button
            className="boton-cerrar-adjudicacion"
            onClick={() => {
              setMostrarAdjudicacion(false);
              setPropiedadAdjudicada(null);
            }}
          >
            Cerrar
          </button>
        </div>
      )}
      {mostrarTarjetaCarcel && (
        <div className="popup-tarjeta-carcel">
          <img
            src="/public/imagenes-minitarjetas/libras-carcel.png"
            alt="Tarjeta librarse de la cárcel"
            className="imagen-tarjeta-carcel"
          />
          <button
            className="boton-cerrar-adjudicacion"
            onClick={() => setMostrarTarjetaCarcel(false)}
          >
            Cerrar
          </button>
        </div>
      )}
      {mostrarPopupGrada && (
        <div className="popup-esquina">
          <div className="tarjeta-esquina">
            <img
              src="/vas-a-la-grada.png"
              alt="Vas a la grada"
              className="imagen-esquina"
            />
            <button className="boton-cerrar-esquina" onClick={enviarACarcel}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {mostrarSelectorDevolver && (
        <div className="popup-selector-dev">
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.2rem",
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: "#222",
            }}
          >
            ¿Qué propiedad quieres devolver?
          </div>

          <div className="lista-propiedades-horizontal">
            {
              // 🧠 Agrupación y filtrado inteligente
              (() => {
                const propiedadesPorGrupo = {};
                for (const p of propiedadesJugador) {
                  const grupo = p.propiedad.grupoColor;
                  if (!propiedadesPorGrupo[grupo]) {
                    propiedadesPorGrupo[grupo] = [];
                  }
                  propiedadesPorGrupo[grupo].push(p);
                }

                const gruposConConstruccion = Object.entries(
                  propiedadesPorGrupo
                )
                  .filter(([, props]) =>
                    props.some((p) => p.casas > 0 || p.hotel)
                  )
                  .map(([grupo]) => grupo);

                return propiedadesJugador
                  .filter(
                    (p) =>
                      p.casas === 0 &&
                      p.hotel === false &&
                      !gruposConConstruccion.includes(p.propiedad.grupoColor)
                  )
                  .map((p) => {
                    const casilla = casillasInfo.find(
                      (c) => c.id === p.propiedad.id
                    );
                    const colorTexto = casilla?.color || "gris";
                    return (
                      <div
                        key={p.propiedad.id}
                        className={`tarjeta-propiedad-construccion color-${colorTexto}`}
                        onClick={() => devolverPropiedad(p.id)}
                      >
                        <h5>{p.propiedad.nombre}</h5>
                      </div>
                    );
                  });
              })()
            }
          </div>
        </div>
      )}
      {mensajeSalida && <div className="flash-salida">{mensajeSalida}</div>}
    </div>
  );
}
