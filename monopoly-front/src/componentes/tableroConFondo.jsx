import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../tableroConFondo.css";
import casillasInfo from "../datos/casillasInfo";
import TarjetaPropiedad from "../componentes/TarjetaPropiedad";
import PanelTurno from "../componentes/panelTurno";
import fichasImagenes from "../datos/fichasImagenes";
import SelectorConstruccion from "../componentes/SelectorConstructor";
import TarjetaMensaje from "./TarjetaMensaje"; // Ajusta la ruta si es necesario
import MiniTarjetaPropiedad from "./MiniTarjetaPropiedad";
import PopupTrueque from "./PopupTrueque";
import PopupTruequeRecibido from "./PopupTruequeRecibido";
import PopupQuiebra from "./PopupQuiebra";
import "./TarjetaPropiedad.css";
import PopupRealizarVentas from "./PopupRealizarVentas";
import "./PopupRealizarVentas.css";

export default function TableroConFondo({
  partidaId,
  guardadaEnEstaSesion,
  marcarPartidaComoGuardada,
}) {
  const location = useLocation();
  const jugadorInicial = location.state?.jugadorInicial || "Jugador 1";
  const haPagadoAlquiler = useRef(false);
  const [posicionJugador, setPosicionJugador] = useState(0);
  const [propiedadEnAccion, setPropiedadEnAccion] = useState(null);
  const [resultadoDado, setResultadoDado] = useState(null);
  const [accionesDisponibles, setAccionesDisponibles] = useState([]);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [mensajeBienvenida, setMensajeBienvenida] = useState("");
  const [jugadores, setJugadores] = useState([]);
  const [turnoRecienCambiado, setTurnoRecienCambiado] = useState(false);
  const [suprimirMensajeTurno, setSuprimirMensajeTurno] = useState(false);
  const [propiedadesEnPartida, setPropiedadesEnPartida] = useState([]);
  const [propiedadEnConfirmacion, setPropiedadEnConfirmacion] = useState(null);
  const [opcionesConstruccion, setOpcionesConstruccion] = useState({
    gruposConCasas: [],
    gruposConHotel: [],
  });
  // dentro de TableroConFondo
  const cargarDatosPartida = async () => {
    const nuevos = await fetch(
      `http://localhost:8081/api/partidas/${partidaId}/jugadores`
    ).then((r) => r.json());
    setJugadores(nuevos);

    const props = await fetch(
      `http://localhost:8081/api/propiedadPartida/partida/${partidaId}`
    ).then((r) => r.json());
    setPropiedadesPartida(props);
  };

  const jugadorActual = jugadores.find((j) => j.turno);

  useEffect(() => {
    if (!jugadorActual?.id) return;

    fetch(`http://localhost:8081/api/jugadores/estado/${jugadorActual.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al consultar estado de quiebra");
        return res.json();
      })
      .then((data) => {
        setEstadoJugador(data);
        if (data.enQuiebra) {
          setMostrarPopupQuiebra(true);
        } else {
          setMostrarPopupQuiebra(false);
        }
      })
      .catch((err) => {
        console.error("❌ Error al consultar estado de quiebra:", err);
      });
  }, [jugadorActual]);

  useEffect(() => {
    if (!jugadorActual) return;

    // Cargar propiedades del jugador actual
    fetch(
      `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
    )
      .then((res) => res.json())
      .then((data) => setPropiedadesJugador(data))
      .catch((err) => console.error("❌ Error al cargar propiedades:", err));
  }, [jugadorActual]);
  const [mostrarPropiedades, setMostrarPropiedades] = useState(false);

  const tieneTarjetaSalirCarcel = !!jugadorActual?.tieneTarjetaSalirCarcel;
  const handleTogglePropiedades = () => {
    setMostrarPropiedades(!mostrarPropiedades);
  };
  const [mostrarSelectorCasa, setMostrarSelectorCasa] = useState(false);

  const [propiedadesJugador, setPropiedadesJugador] = useState([]);

  const propiedadesFiltradas = propiedadesJugador;
  console.log("✅ jugadorActual:", jugadorActual);
  console.log("✅ propiedadesJugador:", propiedadesJugador);
  console.log("✅ propiedadesFiltradas:", propiedadesFiltradas);
  const [mostrarSelectorHotel, setMostrarSelectorHotel] = useState(false);
  const [mensajeEspecial, setMensajeEspecial] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null);
  const [mostrarTarjetaReal, setMostrarTarjetaReal] = useState(false);
  const [mensajeSalida, setMensajeSalida] = useState(null);
  const [propiedadAdjudicada, setPropiedadAdjudicada] = useState(null);
  const [mostrarAdjudicacion, setMostrarAdjudicacion] = useState(false);
  const [mostrarTarjetaCarcel, setMostrarTarjetaCarcel] = useState(false);
  const [mostrarPopupGrada, setMostrarPopupGrada] = useState(false);
  const [subastaActiva, setSubastaActiva] = useState(null); // guarda la propiedad
  const [precioMinimo, setPrecioMinimo] = useState(""); // input de precio
  const [subastaLanzada, setSubastaLanzada] = useState(null); // guarda {propiedad, minimo, ofertas}
  const [mensajeOferta, setMensajeOferta] = useState("");
  const [mostrarPopupSubastaFinal, setMostrarPopupSubastaFinal] =
    useState(false);
  const [mostrarOpcionesVenta, setMostrarOpcionesVenta] = useState(false);
  const [mostrarListaJugadores, setMostrarListaJugadores] = useState(false);
  const [modoVenta, setModoVenta] = useState(false);
  const [mostrarVentaAJugador, setMostrarVentaAJugador] = useState(false);
  const [cantidadVenta, setCantidadVenta] = useState("");
  const [propuestaRecibida, setPropuestaRecibida] = useState(null);
  const [mostrarPopupTrueque, setMostrarPopupTrueque] = useState(false);
  const [propiedadesPartida, setPropiedadesPartida] = useState([]);
  const [truequeRecibido, setTruequeRecibido] = useState(null);
  const [jugadorObjetivo, setJugadorObjetivo] = useState(null);
  const [estadoJugador, setEstadoJugador] = useState(null);
  const [mostrarImagenEliminado, setMostrarImagenEliminado] = useState(false);
  const [mostrarModalEliminado, setMostrarModalEliminado] = useState(false);
  const [ganador, setGanador] = useState(null); // string con nombre del jugador
  const [mostrarModalGanador, setMostrarModalGanador] = useState(false);
  const [mostrarIntentarPagar, setMostrarIntentarPagar] = useState(false);
  const [menuSimulacionActivo, setMenuSimulacionActivo] = useState(false);
  const [propiedadSimulada, setPropiedadSimulada] = useState(null);
  const [accionesSimuladas, setAccionesSimuladas] = useState([]);
  const [dineroSimulado, setDineroSimulado] = useState(0);
  const dineroActual = jugadorActual?.dinero ?? 0;
  const [mostrarRealizarVentas, setMostrarRealizarVentas] = useState(false);
  const [deudaPendiente, setDeudaPendiente] = useState(
    jugadorActual?.deuda ?? 0
  );
  const venderConstruccion = (propiedad) => {
    if (!propiedad) return;

    setPropiedadEnAccion(propiedad); // ✅ IMPORTANTE

    if (propiedad.hotel > 0) {
      venderHotel(propiedad);
    } else if (propiedad.casas > 0) {
      venderCasa(propiedad);
    }
  };
  const abrirPopupRealizarVentas = () => {
    setDeudaPendiente(jugadorActual?.deudaPendiente ?? 0);
    setMostrarRealizarVentas(true);
  };
  const puedeAceptar = dineroActual + dineroSimulado >= deudaPendiente;
  const getHipoteca = (p) => Math.floor(p?.propiedad?.precio * 0.5) || 0;
  const getValorVentaCasa = (p) => {
    const info = casillasInfo.find((c) => c.id === p.propiedad?.id);
    return Math.floor((info?.costeCasa ?? 0) / 2);
  };
  const getValorVentaHotel = (p) => {
    const info = casillasInfo.find((c) => c.id === p.propiedad?.id);
    return Math.floor((info?.costeHotel ?? 0) / 2);
  };
  const getValorVentaPropiedad = (p) => {
    const precio = p?.propiedad?.precio ?? 0;
    const estaHipotecada =
      p?.hipotecada ||
      accionesSimuladas.some(
        (a) => a.tipo === "HIPOTECAR" && a.propiedadId === p.id
      );

    return Math.floor(precio * (estaHipotecada ? 0.4 : 0.5));
  };

  const pushAccion = (accion) => {
    setAccionesSimuladas((prev) => [...prev, accion]);
    setDineroSimulado((prev) => prev + accion.importe);
  };

  // 🏦 Hipotecar
  const simularHipoteca = (p) => {
    if (p?.hipotecada) return; // no duplicar
    const importe = getHipoteca(p);
    if (
      accionesSimuladas.some(
        (a) => a.tipo === "HIPOTECAR" && a.propiedadId === p.id
      )
    )
      return;
    pushAccion({
      tipo: "HIPOTECAR",
      propiedadId: p.id,
      importe,
      label: `🏦 Hipotecar ${p.propiedad?.nombre}`,
    });
  };

  // 🏚️ Vender casa
  const simularVentaCasa = (p) => {
    if ((p?.casas ?? 0) <= 0) return;
    const construccionesSimuladas = accionesSimuladas.filter(
      (a) => a.tipo === "VENDER_CASA" && a.propiedadId === p.id
    ).length;

    if ((p.casas ?? 0) - construccionesSimuladas <= 0) return;
    const importe = getValorVentaCasa(p);
    pushAccion({
      tipo: "VENDER_CASA",
      propiedadId: p.id,
      importe,
      cantidad: 1,
      label: `🏚️ Vender 1 casa de ${p.propiedad?.nombre}`,
    });
  };

  const simularVentaHotel = (p) => {
    if (!p?.hotel) return;

    // Cuenta cuántas construcciones ya se han simulado (hotel o casa)
    const construccionesSimuladas = accionesSimuladas.filter(
      (a) =>
        (a.tipo === "VENDER_CASA" || a.tipo === "VENDER_HOTEL") &&
        a.propiedadId === p.id
    ).length;

    // Si ya has simulado 5 ventas (máximo posible con hotel), no dejes continuar
    if (construccionesSimuladas >= 5) return;

    const importe = getValorVentaHotel(p);
    pushAccion({
      tipo: "VENDER_HOTEL",
      propiedadId: p.id,
      importe,
      label: `🏨 Vender hotel de ${p.propiedad?.nombre}`,
    });
  };

  // 🏷️ Vender propiedad al banco
  const simularVentaPropiedad = (p) => {
    const importe = getValorVentaPropiedad(p);
    if (
      accionesSimuladas.some(
        (a) => a.tipo === "VENDER_PROPIEDAD" && a.propiedadId === p.id
      )
    )
      return;
    pushAccion({
      tipo: "VENDER_PROPIEDAD",
      propiedadId: p.id,
      importe,
      label: `🏷️ Vender ${p.propiedad?.nombre}`,
    });
  };

  const handleEliminarse = async () => {
    // lógica para eliminar jugador
  };

  const handleTransferir = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/transferir-todo`,
        { method: "POST" }
      );

      const mensaje = await response.text();

      if (response.ok) {
        // ✅ Mostrar imagen y modal de quiebra
        setMostrarImagenEliminado(true);
        setMostrarModalEliminado(true);

        // 🏆 Detectar si es victoria
        if (
          mensaje.startsWith("🎉 ¡") ||
          mensaje.toLowerCase().includes("ha ganado la partida")
        ) {
          const nombreGanador =
            mensaje.split("¡")[1]?.split(" ")[0] || "Jugador";

          setGanador(nombreGanador);
          setMostrarPopupQuiebra(false);
          setMostrarImagenEliminado(false);
          setMostrarModalEliminado(false);
          setMostrarModalGanador(true);

          // 🔄 Asegurar que se actualiza el estado del jugador ganador
          await cargarDatosPartida();
          return; // ⛔ Evitar seguir ejecutando lógica innecesaria
        }

        // 🔄 Si no es victoria, actualizar partida y ocultar modales
        setTimeout(async () => {
          await cargarDatosPartida();
          setMostrarPopupQuiebra(false);
          setEstadoJugador(null);
          setMostrarImagenEliminado(false);
          setMostrarModalEliminado(false);
        }, 300);
      } else {
        alert("❌ Error al transferir: " + mensaje);
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      alert("❌ Error inesperado al transferir al acreedor.");
    }
  };

  const handleIntentarPagar = () => {
    // ✅ Primero actualizas la deuda pendiente
    setDeudaPendiente(jugadorActual?.deudaPendiente ?? 0);

    // Luego haces el fetch para traer las propiedades
    fetch(
      `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
    )
      .then((res) => res.json())
      .then((data) => setPropiedadesJugador(data))
      .catch((err) =>
        console.error("❌ Error al cargar propiedades (intentar pagar):", err)
      );

    // Muestras el popup
    setMostrarPopupQuiebra(false);
    setMostrarIntentarPagar(true);
  };

  const [mostrarPopupQuiebra, setMostrarPopupQuiebra] = useState(false);
  const cargarEstadoJugador = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/estado/${jugadorActual.id}`
      );
      const datos = await res.json();

      console.log("Estado actualizado del jugador:", datos);
      setEstadoJugador(datos); // <-- importante para que se pase a PopupQuiebra
      console.log("¿En quiebra?", datos.enQuiebra); // <--- AÑADE ESTO
      if (datos.enQuiebra) {
        console.log("ACTIVANDO POPUP DE QUIEBRA"); // <--- AÑADE ESTO
        setMostrarPopupQuiebra(true);
      }
    } catch (error) {
      console.error("Error al cargar estado del jugador:", error);
    }
  };
  const seleccionarJugadorVenta = (id) => {
    if (!cantidadVenta || isNaN(cantidadVenta) || Number(cantidadVenta) <= 0) {
      alert("Introduce una cantidad válida para vender la propiedad.");
      return;
    }

    const dto = {
      propiedadId: propiedadSeleccionada.id,
      compradorId: id,
      vendedorId: jugadorActual.id,
      cantidad: Number(cantidadVenta),
    };

    fetch("http://localhost:8081/api/partidas/venta-pendiente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    })
      .then(async (res) => {
        const mensaje = await res.text();
        if (!res.ok) throw new Error(mensaje);
        alert(
          "✅ Propuesta enviada. Pendiente de confirmación por el jugador."
        );
        setCantidadVenta("");
        setMostrarVentaAJugador(false);
        setMostrarTarjetaReal(false);
        setModoVenta(false);

        const casillaActual = casillasInfo[jugadorActual.posicion];
        setPropiedadSeleccionada(casillaActual);
      })
      .catch((err) => {
        console.error("❌ Error al enviar propuesta:", err);
        alert(err.message);
      });
  };

  const [mostrarSelectorDevolver, setMostrarSelectorDevolver] = useState(false);
  const [alertaSuperior, setAlertaSuperior] = useState(null);
  const [mensajeLateral, setMensajeLateral] = useState(null);
  const [mostrarBotonTirar, setMostrarBotonTirar] = useState(false);
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

  const venderCasa = async () => {
    if (!propiedadEnAccion || !jugadorActual) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que quieres vender una casa en "${propiedadEnAccion.propiedad?.nombre}"?`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/propiedadPartida/vender-casa/${jugadorActual.id}/${propiedadEnAccion.id}`,
        { method: "POST" }
      );

      const txt = await res.text();
      alert(txt);

      // ✅ Recargar propiedades actualizadas del jugador
      const props = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      ).then((r) => r.json());
      setPropiedadesJugador(props);

      // ✅ NUEVO: recargar jugadores para actualizar dinero
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      // ✅ Verificar opciones de construcción tras la venta
      const opcionesRes = await fetch(
        `http://localhost:8081/api/propiedades/opciones-construccion?jugadorId=${jugadorActual.id}`
      );
      const opciones = await opcionesRes.json();
      setOpcionesConstruccion(opciones);

      setPropiedadSeleccionada(null);
      setMostrarTarjetaReal(false);
      setPropiedadEnAccion(null);
    } catch (err) {
      console.error("❌ Error al vender casa:", err);
      alert("❌ " + err.message);
    }
  };

  const venderHotel = async () => {
    if (!propiedadEnAccion || !jugadorActual) return;

    const confirmacion = window.confirm(
      `¿Seguro que quieres vender el hotel de "${propiedadEnAccion.propiedad.nombre}" por la mitad del coste de construcción?`
    );
    if (!confirmacion) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/propiedadPartida/vender-hotel/${jugadorActual.id}/${propiedadEnAccion.id}`,
        {
          method: "POST",
        }
      );

      const mensaje = await res.text();
      if (!res.ok) throw new Error(mensaje);

      alert("✅ " + mensaje);

      // Refrescar estado tras la venta
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const props = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      ).then((r) => r.json());
      setPropiedadesJugador(props);

      setPropiedadSeleccionada(null);
      setMostrarTarjetaReal(false);
      setPropiedadEnAccion(null);
    } catch (err) {
      console.error("❌ Error al vender hotel:", err);
      alert("❌ " + err.message);
    }
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

  const aceptarOferta = async (oferta) => {
    try {
      console.log("✅ Oferta aceptada:", oferta);

      const res = await fetch(
        "http://localhost:8081/api/propiedadPartida/transferir",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propiedadId: subastaLanzada.propiedadPartidaId,
            compradorId: oferta.jugadorId,
            vendedorId: subastaLanzada.duenoId,
            cantidad: oferta.cantidad,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al transferir la propiedad");
      }

      const resultado = await res.text();
      console.log("🎯 Resultado transferencia:", resultado);
      alert(resultado);

      // 🔁 Refrescar jugadores y propiedades
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const props = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      ).then((r) => r.json());
      setPropiedadesJugador(props);
    } catch (err) {
      console.error("❌ Error al aceptar oferta:", err);
      alert("Error al aceptar oferta");
    } finally {
      setMostrarPopupSubastaFinal(false);
      setTimeout(() => {
        setSubastaLanzada(null);
        localStorage.removeItem("subastaLanzada");
      }, 300);
    }
  };

  const hipotecarPropiedad = async (prop) => {
    try {
      setSuprimirMensajeTurno(true);

      const url = prop.hipotecada
        ? "http://localhost:8081/api/propiedadPartida/deshipotecar"
        : "http://localhost:8081/api/propiedadPartida/hipotecar";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jugadorId: jugadorActual.id,
          propiedadId: prop.id,
        }),
      });

      const resultado = await res.text();
      alert(resultado);

      // Refrescar datos
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const props = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      ).then((r) => r.json());
      setPropiedadesJugador(props);

      setPropiedadEnAccion(null);
    } catch (err) {
      console.error("❌ Error al hipotecar/deshipotecar propiedad:", err);
      alert("Error al intentar hipotecar o deshipotecar");
    } finally {
      setTimeout(() => setSuprimirMensajeTurno(false), 200);
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
    if (estadoJugador?.enQuiebra) {
      console.log("useEffect detecta enQuiebra → mostrando popup"); // <--- AÑADE ESTO
      setMostrarPopupQuiebra(true);
    }
  }, [estadoJugador?.enQuiebra]);

  useEffect(() => {
    if (!jugadorActual?.id) return;

    const fetchTruequePendiente = async () => {
      try {
        const resp = await fetch(
          `http://localhost:8081/api/trueque/pendiente/${jugadorActual.id}`
        );
        if (resp.status === 200) {
          const data = await resp.json();
          if (data && data.jugadorReceptorId && data.jugadorOfertanteId) {
            if (data.jugadorReceptorId !== jugadorActual.id) {
              // No es para este jugador, ignorar
              return;
            }

            if (!truequeRecibido || data.id !== truequeRecibido.id) {
              setTruequeRecibido(data);
            }
          } else {
            console.warn("❌ Trueque recibido inválido:", data);
            setTruequeRecibido(null);
          }
        }
      } catch (error) {
        console.error("Error consultando trueque pendiente:", error);
      }
    };

    // Primera carga y cada 3 segundos
    fetchTruequePendiente();
    const intervalId = setInterval(fetchTruequePendiente, 3000);
    return () => clearInterval(intervalId);
  }, [jugadorActual]);

  useEffect(() => {
    if (subastaLanzada) {
      localStorage.setItem("subastaLanzada", JSON.stringify(subastaLanzada));
    } else {
      localStorage.removeItem("subastaLanzada");
    }
  }, [subastaLanzada]);

  useEffect(() => {
    if (
      subastaLanzada &&
      jugadorActual &&
      subastaLanzada.duenoId === jugadorActual.id &&
      subastaLanzada.ofertas.length > 0
    ) {
      setMostrarPopupSubastaFinal(true);
    } else {
      setMostrarPopupSubastaFinal(false);
    }
  }, [subastaLanzada, jugadorActual]);

  useEffect(() => {
    // 🔁 Forzar recarga desde localStorage al cambiar de jugador
    const subastaGuardada = localStorage.getItem("subastaLanzada");
    if (subastaGuardada) {
      try {
        const subasta = JSON.parse(subastaGuardada);
        setSubastaLanzada(subasta);
      } catch (e) {
        console.error("❌ Error al parsear subasta guardada:", e);
      }
    }
  }, [jugadorActual]);

  useEffect(() => {
    if (!partidaId) return;

    // ✅ Paso 2: obtener TODAS las propiedades de la partida
    fetch(`http://localhost:8081/api/propiedadPartida/partida/${partidaId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Propiedades de la partida recibidas:", data);
        setPropiedadesPartida(data); // 👈 asegúrate de haberlo declarado con useState
      })
      .catch((err) =>
        console.error("❌ Error al obtener propiedades de la partida:", err)
      );

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
    if (!turnoRecienCambiado || suprimirMensajeTurno) return;

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
  }, [turnoRecienCambiado, jugadores, suprimirMensajeTurno]);

  useEffect(() => {
    if (!jugadorActual) return;

    fetch(
      `http://localhost:8081/api/partidas/venta-pendiente/${jugadorActual.id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Sin propuesta");
        return res.json();
      })
      .then((data) => {
        setPropuestaRecibida(data);
      })
      .catch(() => {
        setPropuestaRecibida(null); // limpia si no hay propuesta
      });
  }, [jugadorActual]);

  useEffect(() => {
    const actual = jugadores.find((j) => j.turno);
    if (actual) {
      console.log("✅ Nuevo jugador con el turno:", actual.nombre);
    }
  }, [jugadores]);

  useEffect(() => {
    const obtenerConstrucciones = async () => {
      const res = await fetch(
        `http://localhost:8081/api/propiedadPartida/partida/${jugadorActual.partida.id}`
      );
      const data = await res.json();
      setPropiedadesEnPartida(data);
    };

    if (jugadorActual?.partida?.id) {
      obtenerConstrucciones();
    }
  }, [jugadorActual]);

  const tirarDado = async () => {
    haPagadoAlquiler.current = false;
    if (mostrarBienvenida) setMostrarBienvenida(false);
    if (!jugadorActual) return;
    setMensajeLateral(null);

    try {
      const res = await fetch(
        `http://localhost:8081/api/jugadores/${jugadorActual.id}/tirar`,
        { method: "POST" }
      );

      const data = await res.json();
      const { dado1, dado2, suma, mensaje, carcel } = data;

      console.log("🎲 Dados:", dado1, dado2, "→ total:", suma);
      console.log("📩 Mensaje:", mensaje);

      if (carcel) {
        alert("⚠️ Has sacado dobles 3 veces seguidas. Vas directo a la grada.");
        setMostrarPopupGrada(true);
        setResultadoDado(null);
        setAccionesDisponibles([]);
        setPropiedadSeleccionada(null);
        return;
      }

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

      // Tarjeta de COMUNIDAD o SUERTE
      let fueTarjeta = false;

      if (
        mensajeSinSalida.includes("Caja de Comunidad") ||
        mensajeSinSalida.includes("Has caído en 'Caja de Comunidad'")
      ) {
        setTipoMensaje("comunidad");
        setMensajeEspecial(null); // aún no hay carta
        setMostrarTarjetaReal(true); // mostramos el popup con botón "Roba una carta"
        fueTarjeta = true;
      } else if (mensajeSinSalida.includes("Has caído en 'Suerte'")) {
        setTipoMensaje("suerte");
        setMensajeEspecial(null); // aún no hay carta
        setMostrarTarjetaReal(true); // mostramos el popup con botón "Roba una carta"
        fueTarjeta = true;
      }

      // ⚠️ SOLO limpiamos si no fue tarjeta y no fue casilla especial
      const casillaTemp = casillasInfo.find((c) =>
        mensajeSinSalida.includes(c.nombre)
      );
      const tipoCasillaTemp = casillaTemp?.tipo;

      if (!fueTarjeta && tipoCasillaTemp) {
        const casillasConPopup = [
          "suerte",
          "comunidad",
          "impuesto",
          "palco-vip",
          "vas-grada",
          "visita-carcel",
          "salida",
        ];

        if (!casillasConPopup.includes(tipoCasillaTemp)) {
          setTipoMensaje(null);
          setMensajeEspecial(null);
          setMostrarTarjetaReal(false);
        }
      }

      // 🔁 Actualizar estado general
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const jugadorActualizado = nuevos.find((j) => j.id === jugadorActual.id);
      const nuevaPos = jugadorActualizado?.posicion ?? 0;

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

      if (
        [
          "suerte",
          "comunidad",
          "impuesto",
          "palco-vip",
          "visita-carcel",
          "vas-grada",
          "salida",
        ].includes(casilla.tipo)
      ) {
        setMostrarTarjetaReal(true);
      }

      if (["propiedad", "compania", "estacion"].includes(casilla.tipo)) {
        const propiedadPartidaRes = await fetch(
          `http://localhost:8081/api/propiedadPartida/partida/${partidaId}/posicion/${casilla.id}`
        );

        if (propiedadPartidaRes.ok) {
          const datos = await propiedadPartidaRes.json();
          const propiedadPartida = datos.propiedadPartida;
          const estaciones = datos.estacionesDelDueno || 1;
          const companias = datos.companiasDelDueno || 1;
          const sumaDados = datos.sumaDados || 0;
          const tipo = casilla.tipo;
          let motivo = "";

          if (!propiedadPartida.dueno) {
            setMensajeLateral(
              `Has caído en ${casilla.nombre}. No tiene dueño, puedes comprarla.`
            );
            setAccionesDisponibles(["Comprar"]);
          } else if (propiedadPartida.dueno.id === jugadorActual.id) {
            setMensajeLateral(`Has caído en ${casilla.nombre}. Es tuya.`);
            setAccionesDisponibles(["Hipotecar"]);
          } else {
            if (tipo === "propiedad") {
              if (propiedadPartida.hotel) {
                motivo = "porque tiene un hotel";
              } else if (propiedadPartida.casas > 0) {
                motivo = `porque tiene ${propiedadPartida.casas} casa(s)`;
              } else {
                motivo = "por el alquiler base";
              }
            } else if (tipo === "estacion") {
              motivo = `porque tiene ${estaciones} estación${
                estaciones > 1 ? "es" : ""
              }`;
            } else if (tipo === "compania") {
              motivo = `porque tiene ${companias} compañía${
                companias > 1 ? "s" : ""
              } y sacaste ${sumaDados}`;
            }

            const alquiler = datos.alquilerCalculado ?? 0;

            setMensajeLateral(
              `Has caído en ${casilla.nombre}, propiedad de ${propiedadPartida.dueno.nombre}. Le pagas ${alquiler}€ ${motivo}.`
            );
          }
        } else {
          console.warn("No se encontró propiedadPartida para esta casilla.");
          setAccionesDisponibles([]);
        }
      } else {
        setAccionesDisponibles([]);
        setPropiedadSeleccionada(casilla);
      }

      if (mensaje.includes("Vuelves a tirar")) {
        setMostrarBotonTirar(true);
        setAlertaSuperior(
          "🎲 Has sacado dobles. Realiza las acciones que quieras y vuelve a tirar al pulsar 'Terminar turno'."
        );
        setTimeout(() => setAlertaSuperior(false), 2000);
      } else {
        // No cambiamos el turno aquí. Lo hará el botón "Terminar turno".
      }
    } catch (err) {
      console.error("❌ Error al tirar el dado:", err);
    }
  };

  const robarCarta = async () => {
    try {
      const res = await fetch(
        `http://localhost:8081/api/tarjetas/${tipoMensaje}`
      );
      const tarjeta = await res.json();
      console.log("📨 Carta robada:", tarjeta);
      setMensajeEspecial(tarjeta.mensaje);
      // setMostrarTarjetaReal(true); // NO lo pongas aquí, ya está activo
    } catch (e) {
      console.error("❌ Error al robar carta:", e);
    }
  };

  const handleVentaBanco = () => {
    console.log("🟢 CLICK DETECTADO EN VENDER AL BANCO");
    console.log("📦 propiedadSeleccionada:", propiedadSeleccionada);
    if (!propiedadSeleccionada) return;

    const estaHipotecada = propiedadSeleccionada.hipotecada;
    const precioOriginal = propiedadSeleccionada.propiedad.precio;
    const precioVenta = Math.floor(
      precioOriginal * (estaHipotecada ? 0.4 : 0.5)
    );
    const confirmacion = window.confirm(
      `¿Seguro que quieres vender "${propiedadSeleccionada.propiedad.nombre}" al banco por ${precioVenta}€?`
    );

    if (confirmacion) {
      setSuprimirMensajeTurno(true); // 🔕 evita mensaje de turno innecesario

      const dto = {
        propiedadId: propiedadSeleccionada.id,
        jugadorId: jugadorActual.id,
        cantidad: precioVenta,
      };

      fetch("http://localhost:8081/api/propiedadPartida/vender-banco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      })
        .then(async (res) => {
          const mensaje = await res.text();
          if (!res.ok) throw new Error(mensaje);

          alert("✅ " + mensaje);

          // 🔄 actualizar estado de jugadores y propiedades
          const nuevos = await fetch(
            `http://localhost:8081/api/partidas/${partidaId}/jugadores`
          ).then((r) => r.json());
          setJugadores(nuevos);

          const props = await fetch(
            `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
          ).then((r) => r.json());
          setPropiedadesJugador(props);

          setPropiedadEnAccion(null);

          // 🟢 cerrar todos los menús
          setPropiedadSeleccionada(null); // primero anulamos
          setMostrarTarjetaReal(false); // después ocultamos el menú
          setMostrarOpcionesVenta(false);
          setModoVenta(false);

          // 🟢 permitir mensajes de turno otra vez (tras un breve retardo)
          setTimeout(() => setSuprimirMensajeTurno(false), 300);
        })
        .catch((err) => {
          console.error("❌ Error al vender al banco:", err);
          alert("❌ " + err.message); // ✅ muestra el mensaje real que viene del backend
          setSuprimirMensajeTurno(false);
        });
    }
  };

  const venderPropiedadAlBanco = async (prop) => {
    if (!prop || !jugadorActual) return;

    const estaHipotecada = prop.hipotecada;
    const precioOriginal = prop.propiedad.precio;
    const precioVenta = Math.floor(
      precioOriginal * (estaHipotecada ? 0.4 : 0.5)
    );

    const confirmacion = window.confirm(
      `¿Seguro que quieres vender "${prop.propiedad.nombre}" al banco por ${precioVenta}€?`
    );
    if (!confirmacion) return;

    try {
      setSuprimirMensajeTurno(true);

      const dto = {
        propiedadId: prop.id,
        jugadorId: jugadorActual.id,
        cantidad: precioVenta,
      };

      const res = await fetch(
        "http://localhost:8081/api/propiedadPartida/vender-banco",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dto),
        }
      );

      const mensaje = await res.text();
      if (!res.ok) throw new Error(mensaje);
      alert("✅ " + mensaje);

      // 🔁 actualizar jugador y propiedades
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      const props = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      ).then((r) => r.json());
      setPropiedadesJugador(props);

      setPropiedadEnAccion(null);
    } catch (err) {
      console.error("❌ Error al vender propiedad:", err);
      alert("❌ " + err.message);
    } finally {
      setTimeout(() => setSuprimirMensajeTurno(false), 200);
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

  // ✅ no lo toques, es necesario para que el popup funcione
  window.enviarACarcel = enviarACarcel;

  const terminarTurno = async () => {
    if (!jugadorActual) return;

    // ⚠️ Si sacó dobles → NO llamar al backend
    if (resultadoDado?.dado1 === resultadoDado?.dado2) {
      // 🔁 Repetir turno para el mismo jugador
      setMostrarBotonTirar(true); // Mostrar el botón para tirar
      setAccionesDisponibles([]); // Limpiar acciones
      setPropiedadSeleccionada(null); // Limpiar casilla
      setResultadoDado(null); // Limpiar dados
      return;
    }

    // ✅ Si NO sacó dobles → pasar turno como siempre
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
      setMensajeLateral(null);

      const siguiente = nuevos.find((j) => j.turno);
      if (siguiente) {
        const mensaje = `Ahora le toca a ${siguiente.nombre}`;
        setMensajeBienvenida(mensaje);
        setMostrarBienvenida(true);
        setTimeout(() => {
          setMostrarBienvenida(false);
        }, 2000);
      }
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

    const confirmacion = window.confirm(
      "¿Quieres construir una casa en esta propiedad?"
    );
    if (!confirmacion) return;

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

      // 🔁 ACTUALIZAR jugadores para reflejar dinero actualizado
      const nuevos = await fetch(
        `http://localhost:8081/api/partidas/${partidaId}/jugadores`
      ).then((r) => r.json());
      setJugadores(nuevos);

      // 🔁 ACTUALIZAR opciones de construcción después de construir
      const opcionesRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/opciones-construccion?jugadorId=${jugadorActual.id}`
      );
      const opciones = await opcionesRes.json();
      setOpcionesConstruccion(opciones);

      setMostrarSelectorCasa(false);
    } catch (err) {
      console.error("❌ Error al construir casa:", err);
      alert("❌ Error al construir casa");
    }
  };

  const construirHotel = async (propiedadId) => {
    if (!jugadorActual || !partidaId) return;

    const confirmacion = window.confirm(
      "¿Quieres construir un hotel en esta propiedad?"
    );
    if (!confirmacion) return;

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

      // 🔁 Refrescar propiedades (para mostrar hoteles actualizados)
      const propsRes = await fetch(
        `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
      );
      const props = await propsRes.json();
      setPropiedadesJugador(props);

      // 🔁 Refrescar jugadores (para ver dinero actualizado)
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

      setMostrarSelectorHotel(false);
    } catch (err) {
      console.error("❌ Error al construir hotel:", err);
      alert("❌ Error al construir hotel");
    }
  };

  // 🟡 1. Primero calcula los grupos con hipoteca
  const gruposConHipoteca = new Set(
    propiedadesJugador
      .filter((p) => p.hipotecada)
      .map((p) => p.propiedad.grupoColor)
  );

  // 🟢 2. Luego calcula si hay alguna propiedad válida para construir casa
  const hayPropiedadesParaConstruirCasa = propiedadesJugador.some(
    (p) =>
      p.propiedad.tipo === "propiedad" &&
      Array.isArray(opcionesConstruccion.gruposConCasas) &&
      opcionesConstruccion.gruposConCasas.includes(p.propiedad.grupoColor) &&
      !gruposConHipoteca.has(p.propiedad.grupoColor) && // ❌ si hay hipoteca, no vale
      p.casas < 4 &&
      !p.hotel
  );

  const casillaColor = propiedadEnAccion
    ? casillasInfo.find((c) => c.id === propiedadEnAccion.propiedad.id)
        ?.color || "gris"
    : "gris";

  return (
    <div className="tablero-fondo">
      {mensajeLateral && (
        <div className="mensaje-lateral">{mensajeLateral}</div>
      )}
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

          // Buscar la propiedad dinámica asociada
          const propiedad = propiedadesEnPartida.find(
            (p) => p.propiedad.posicion === casilla.id
          );

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
              {/* Render de construcciones si existen */}
              {propiedad?.hotel ? (
                <div className="casillas-casas">
                  <img src="/public/hotel-monopoly.png" className="icono-hotel" />
                </div>
              ) : (
                <div className="casillas-casas">
                  {[...Array(propiedad?.casas || 0)].map((_, i) => (
                    <img
                      key={i}
                      src="/public/casa-monopoly.png"
                      className="icono-casa"
                    />
                  ))}
                </div>
              )}

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
      <div className="panel-inferior-jugador">
        <div className="info-jugador">
          <h4 className="etiqueta">NOMBRE JUGADOR</h4>
          <h3>{jugadorActual?.nombre}</h3>

          <h4 className="etiqueta">DINERO</h4>
          <p>🪙 {jugadorActual?.dinero}€</p>

          <button
            className="boton-propiedades"
            onClick={() => setMostrarPropiedades(!mostrarPropiedades)}
          >
            📜 Ver propiedades
          </button>
        </div>

        {mostrarPropiedades && (
          <div className="submenu-propiedades">
            <h4 className="titulo-submenu">Tus propiedades</h4>

            {/* CALLES */}
            <div className="seccion-propiedades">
              <h5>Calles</h5>
              {propiedadesFiltradas
                ?.filter((p) => p.propiedad.tipo === "propiedad")
                .map((prop) => {
                  const casilla = casillasInfo.find(
                    (c) => c.id === prop.propiedad.id
                  );
                  return (
                    <div
                      key={prop.id}
                      className={`tarjeta-propiedad-mini color-${casilla?.color}`}
                      onClick={() => setPropiedadEnAccion(prop)}
                    >
                      {prop.propiedad.nombre}{" "}
                      {prop.hipotecada && (
                        <span title="Propiedad hipotecada">🏠🔒</span>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* ESTACIONES */}
            <div className="seccion-propiedades">
              <h5>Estaciones</h5>
              {propiedadesFiltradas
                ?.filter((p) => p.propiedad.tipo === "estacion")
                .map((prop) => (
                  <div
                    key={prop.id}
                    className="tarjeta-propiedad-mini color-estacion"
                    onClick={() => setPropiedadEnAccion(prop)}
                  >
                    <span>
                      {prop.propiedad.nombre}
                      {prop.hipotecada && (
                        <span
                          className="icono-hipoteca"
                          title="Estación hipotecada"
                        >
                          {" "}
                          🏠🔒
                        </span>
                      )}
                    </span>
                  </div>
                ))}
            </div>

            {/* COMPAÑÍAS */}
            <div className="seccion-propiedades">
              <h5>Compañías</h5>
              {propiedadesFiltradas
                ?.filter(
                  (p) =>
                    p.propiedad.tipo === "compañia" ||
                    p.propiedad.tipo === "compania"
                )
                .map((prop) => (
                  <div
                    key={prop.id}
                    className="tarjeta-propiedad-mini color-compania"
                    onClick={() => setPropiedadEnAccion(prop)}
                  >
                    <span>
                      {prop.propiedad.nombre}
                      {prop.hipotecada && (
                        <span
                          className="icono-hipoteca"
                          title="Compañía hipotecada"
                        >
                          {" "}
                          🏠🔒
                        </span>
                      )}
                    </span>
                  </div>
                ))}
            </div>

            <div className="seccion-cartas">
              <h5>Cartas especiales</h5>
              {tieneTarjetaSalirCarcel ? (
                <div className="tarjeta-propiedad-mini">
                  🎟️ Salir de la cárcel
                </div>
              ) : (
                <div className="tarjeta-propiedad-mini sin-carta">
                  No tienes cartas
                </div>
              )}
            </div>
          </div>
        )}
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
        puedeConstruirCasa={hayPropiedadesParaConstruirCasa}
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

      {propiedadSeleccionada && !modoVenta && !mostrarRealizarVentas && (
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
          robarCarta={robarCarta}
        />
      )}

      {mostrarSelectorCasa && (
        <SelectorConstruccion
          propiedades={propiedadesJugador.filter(
            (p) =>
              p.propiedad.tipo === "propiedad" &&
              opcionesConstruccion.gruposConCasas.includes(
                p.propiedad.grupoColor
              ) &&
              !gruposConHipoteca.has(p.propiedad.grupoColor) &&
              p.casas < 4 &&
              !p.hotel
          )}
          tipo="casa"
          onSeleccionar={async (propiedadId) => {
            await construirCasa(propiedadId);
            setMostrarSelectorCasa(false);
          }}
          onCerrar={() => setMostrarSelectorCasa(false)}
        />
      )}
      {mostrarSelectorHotel && (
        <SelectorConstruccion
          propiedades={propiedadesJugador.filter(
            (p) =>
              p.propiedad.tipo === "propiedad" &&
              opcionesConstruccion.gruposConHotel.includes(
                p.propiedad.grupoColor
              ) &&
              !gruposConHipoteca.has(p.propiedad.grupoColor) &&
              p.hotel === false
          )}
          tipo="hotel"
          onSeleccionar={(id) => {
            construirHotel(id);
            setMostrarSelectorHotel(false);
          }}
          onCerrar={() => setMostrarSelectorHotel(false)}
        />
      )}

      {mostrarTarjetaReal && !mensajeEspecial && (
        <div className="popup-robar-carta">
          <h2>Roba una carta</h2>
          <button onClick={robarCarta} className="boton-robar-carta">
            Robar carta
          </button>
        </div>
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

      {propiedadEnAccion && (
        <div className="popup-acciones-propiedad">
          <h3 className={`titulo-propiedad color-${casillaColor}`}>
            {propiedadEnAccion.propiedad.nombre}
          </h3>
          <div className="botones-acciones-propiedad">
            <button
              onClick={() => {
                setPropiedadEnConfirmacion(propiedadEnAccion);
                setTipoAccion(
                  propiedadEnAccion.hipotecada ? "deshipotecar" : "hipotecar"
                );
              }}
            >
              {propiedadEnAccion.hipotecada
                ? "💰 Deshipotecar"
                : "🏦 Hipotecar"}
            </button>
            <button
              onClick={() => {
                const grupoColor = propiedadEnAccion.propiedad.grupoColor;

                const grupo = propiedadesJugador.filter(
                  (p) => p.propiedad.grupoColor === grupoColor
                );

                const tieneConstruccion = grupo.some(
                  (p) => p.casas > 0 || p.hotel
                );

                if (tieneConstruccion) {
                  alert(
                    "❌ No puedes subastar propiedades de un grupo con construcciones."
                  );
                  return;
                }

                setSubastaActiva(propiedadEnAccion);
                setPropiedadEnAccion(null);
              }}
            >
              🛎️ Subastar
            </button>
            <button
              onClick={() => {
                setModoVenta(true);
                setPropiedadSeleccionada(propiedadEnAccion); // ← Aquí debes pasar la propiedad correcta
                setMostrarTarjetaReal(false);
                setMostrarOpcionesVenta(true);
              }}
            >
              💸 Vender
            </button>
            <button onClick={() => setMostrarPopupTrueque(true)}>
              🤝 Trueque
            </button>
            <button onClick={venderCasa}>🏠 Vender casa</button>
            <button onClick={venderHotel}>🏨 Vender hotel</button>
            <button onClick={() => setPropiedadEnAccion(null)}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {subastaActiva && (
        <div className="popup-subasta">
          <h3
            className={`titulo-propiedad color-${
              casillasInfo.find((c) => c.id === subastaActiva.propiedad.id)
                ?.color || "gris"
            }`}
          >
            Subastar: {subastaActiva.propiedad.nombre}
          </h3>
          <p>Introduce un precio mínimo para lanzar la subasta:</p>
          <input
            type="number"
            min="1"
            value={precioMinimo}
            onChange={(e) => setPrecioMinimo(e.target.value)}
            placeholder="Precio mínimo (€)"
          />
          <div className="botones-acciones-propiedad">
            <button
              onClick={() => {
                setSubastaLanzada({
                  propiedad: subastaActiva.propiedad,
                  propiedadPartidaId: subastaActiva.id, // ✅ añadir esto
                  duenoId: jugadorActual.id,
                  minimo: parseInt(precioMinimo),
                  ofertas: [],
                });
                setSubastaActiva(null);
                setPrecioMinimo("");
                setMensajeBienvenida(
                  `🏁 Subasta lanzada: ${subastaActiva.propiedad.nombre} por mínimo ${precioMinimo}€`
                );
                setMostrarBienvenida(true);
                setTimeout(() => setMostrarBienvenida(false), 3500);
              }}
            >
              ✅ Lanzar subasta
            </button>
            <button
              onClick={() => {
                setSubastaActiva(null);
                setPrecioMinimo("");
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {subastaLanzada &&
        jugadorActual.id !== subastaLanzada.duenoId &&
        !subastaLanzada.ofertas.some(
          (oferta) => oferta.jugadorId === jugadorActual.id
        ) &&
        (console.log("🔁 Mostrar panel de puja para:", jugadorActual.nombre),
        (
          <div className="popup-subasta">
            <p
              style={{
                marginBottom: "10px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {jugadores.find((j) => j.id === subastaLanzada.duenoId)?.nombre ||
                "Un jugador"}{" "}
              ha lanzado esta propiedad a subasta con un precio mínimo de{" "}
              {subastaLanzada.minimo}€
            </p>
            <h3
              className={`titulo-propiedad color-${
                casillasInfo.find((c) => c.id === subastaLanzada.propiedad.id)
                  ?.color || "gris"
              }`}
            >
              Subasta: {subastaLanzada.propiedad.nombre}
            </h3>
            <p>Precio mínimo: {subastaLanzada.minimo}€</p>
            <input
              type="number"
              min={subastaLanzada.minimo + 1}
              value={precioMinimo}
              onChange={(e) => setPrecioMinimo(e.target.value)}
              placeholder="Tu oferta (€)"
            />
            <div className="botones-acciones-propiedad">
              <button
                onClick={() => {
                  const nuevaOferta = {
                    jugadorId: jugadorActual.id,
                    nombre: jugadorActual.nombre,
                    cantidad: parseInt(precioMinimo),
                  };
                  setSubastaLanzada((prev) => {
                    const actualizada = {
                      ...prev,
                      ofertas: [...prev.ofertas, nuevaOferta],
                    };
                    localStorage.setItem(
                      "subastaLanzada",
                      JSON.stringify(actualizada)
                    );
                    return actualizada;
                  });
                  setMensajeOferta("✅ Oferta enviada correctamente");
                  setTimeout(() => setMensajeOferta(""), 2500);

                  setPrecioMinimo("");
                }}
              >
                💶 Pujar
              </button>
            </div>
          </div>
        ))}

      {mostrarVentaAJugador && (
        <div className="popup popup-vender-jugador">
          <h2>¿A qué jugador deseas vender?</h2>
          <div className="jugadores-disponibles">
            <div className="bloque-cantidad">
              <label htmlFor="cantidadVenta">¿Por qué cantidad?</label>
              <input
                type="number"
                id="cantidadVenta"
                value={cantidadVenta}
                onChange={(e) => setCantidadVenta(e.target.value)}
                className="input-cantidad"
                min="1"
              />
            </div>
            {jugadores
              .filter((j) => j.id !== jugadorActual.id)
              .map((j) => (
                <button
                  key={j.id}
                  className="boton-jugador"
                  onClick={() => seleccionarJugadorVenta(j.id)}
                >
                  {j.nombre}
                </button>
              ))}
          </div>
          <button
            className="boton-cancelar"
            onClick={() => setMostrarVentaAJugador(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      {mostrarOpcionesVenta && (
        <div className="popup-venta popup-opciones">
          <h3 style={{ marginBottom: "15px" }}>
            ¿Cómo deseas vender{" "}
            <span style={{ fontWeight: "bold" }}>
              {propiedadSeleccionada?.nombre}
            </span>
            ?
          </h3>

          <button onClick={handleVentaBanco}>🏦 Vender al banco</button>

          <button
            onClick={() => {
              setMostrarVentaAJugador(true);
              setMostrarOpcionesVenta(false);
            }}
          >
            👤 Vender a un jugador
          </button>

          <button
            onClick={() => {
              setMostrarOpcionesVenta(false);
              setModoVenta(false); // ✅ salimos de modo venta
              setPropiedadSeleccionada(null); // ✅ limpiamos propiedad para evitar que aparezca popup
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      )}

      {propuestaRecibida && (
        <div className="popup-propuesta">
          <h3>📜 Nueva propuesta de compra</h3>
          <p>
            {propuestaRecibida.duenoNombre} te ofrece{" "}
            <strong>{propuestaRecibida.propiedadNombre}</strong> por{" "}
            <strong>{propuestaRecibida.cantidad}€</strong>.
          </p>
          <div className="botones-popup">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    "http://localhost:8081/api/propiedadPartida/transferir",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        propiedadId: propuestaRecibida.propiedadId,
                        compradorId: propuestaRecibida.compradorId,
                        vendedorId: propuestaRecibida.vendedorId,
                        cantidad: propuestaRecibida.cantidad,
                      }),
                    }
                  );

                  const mensaje = await res.text();
                  alert(mensaje);

                  // 🔁 refrescar jugadores y propiedades
                  const nuevos = await fetch(
                    `http://localhost:8081/api/partidas/${partidaId}/jugadores`
                  ).then((r) => r.json());
                  setJugadores(nuevos);

                  const props = await fetch(
                    `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
                  ).then((r) => r.json());
                  setPropiedadesJugador(props);

                  setPropiedadSeleccionada(null);
                  setMostrarTarjetaReal(false);
                  setModoVenta(false);

                  const casillaActual = casillasInfo[jugadorActual.posicion];
                  setPropiedadSeleccionada(casillaActual);
                  await fetch(
                    "http://localhost:8081/api/partidas/venta-pendiente",
                    {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        compradorId: propuestaRecibida.compradorId,
                      }),
                    }
                  );
                  localStorage.removeItem("ventaPendiente");
                  setPropuestaRecibida(null);
                } catch (err) {
                  console.error("❌ Error al aceptar propuesta:", err);
                  alert("Error al aceptar propuesta");
                }
              }}
            >
              ✅ Aceptar
            </button>
            <button
              onClick={async () => {
                await fetch(
                  "http://localhost:8081/api/partidas/venta-pendiente",
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      compradorId: propuestaRecibida.compradorId,
                    }),
                  }
                );
                localStorage.removeItem("ventaPendiente");
                setPropiedadSeleccionada(null);
                setMostrarTarjetaReal(false);
                setModoVenta(false);

                const casillaActual = casillasInfo[jugadorActual.posicion];
                setPropiedadSeleccionada(casillaActual);
                setPropuestaRecibida(null);
              }}
            >
              ❌ Rechazar
            </button>
          </div>
        </div>
      )}
      {mostrarPopupTrueque && (
        <PopupTrueque
          jugadores={jugadores}
          propiedades={propiedadesPartida}
          jugadorActual={jugadorActual}
          jugadorObjetivo={jugadorObjetivo}
          setJugadorObjetivo={setJugadorObjetivo}
          onClose={() => setMostrarPopupTrueque(false)}
        />
      )}

      {truequeRecibido && (
        <PopupTruequeRecibido
          trueque={truequeRecibido}
          propiedades={propiedadesPartida}
          onCerrar={() => setTruequeRecibido(null)}
          onRefrescar={cargarDatosPartida}
        />
      )}

      {mostrarPopupQuiebra && (
        <PopupQuiebra
          estado={estadoJugador}
          onEliminarse={handleEliminarse}
          onTransferir={handleTransferir}
          onIntentarPagar={handleIntentarPagar}
          abrirPopupRealizarVentas={abrirPopupRealizarVentas} // ✅ nuevo prop
        />
      )}

      {mostrarImagenEliminado && (
        <div className="imagen-quiebra-popup">
          <img
            src="/public/jugador-eliminado.png" // Usa esta ruta al colocar tu imagen
            alt="Jugador eliminado"
            className="imagen-quiebra"
          />
        </div>
      )}

      {mostrarModalEliminado && (
        <div className="modal-eliminado-overlay">
          <div className="modal-eliminado">
            <h2>⚠️ Propiedades y dinero transferidos</h2>
            <h1 className="texto-eliminado">Jugador eliminado</h1>
            <img
              src="/imagenes/eliminado-barcelona.png"
              alt="Jugador eliminado"
              className="imagen-modal-eliminado"
            />
            <button
              className="boton-confirmar-modal"
              onClick={async () => {
                await cargarDatosPartida();
                setMostrarPopupQuiebra(false);
                setEstadoJugador(null);
                setMostrarImagenEliminado(false);
                setMostrarModalEliminado(false);
              }}
            >
              ✅ Aceptar
            </button>
          </div>
        </div>
      )}

      {mostrarModalGanador && (
        <div className="modal-victoria-overlay">
          <div className="modal-victoria">
            <h2>🏆 ¡Victoria!</h2>
            <h1 className="texto-victoria">{ganador} ha ganado la partida</h1>
            <img
              src="/public/jugador-ganador.png"
              alt="Jugador ganador"
              className="imagen-modal-victoria"
            />
            <button
              className="boton-confirmar-modal"
              onClick={async () => {
                try {
                  if (!guardadaEnEstaSesion) {
                    await fetch(
                      `http://localhost:8081/api/partidas/${partidaId}/finalizar`,
                      {
                        method: "DELETE",
                      }
                    );
                  }
                } catch (error) {
                  console.error(
                    "❌ Error al finalizar la partida automáticamente",
                    error
                  );
                } finally {
                  setMostrarModalGanador(false);
                  window.location.href = "/";
                }
              }}
            >
              🔁 Finalizar Partida
            </button>
          </div>
        </div>
      )}

      {mostrarIntentarPagar && (
        <div className="modal-overlay">
          <div className="modal-intentar-pagar">
            <h2 className="modal-titulo">💰 Simular acciones de venta</h2>

            {propiedadesJugador.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "1rem" }}>
                No tienes propiedades disponibles.
              </p>
            ) : (
              <div className="contenedor-doble-columna">
                {/* 🧱 Columna izquierda: propiedades */}
                <div className="columna-propiedades-scroll">
                  <h3 className="subtitulo-submenu">
                    Selecciona una propiedad:
                  </h3>
                  <div className="lista-propiedades-scroll">
                    {propiedadesJugador.map((propiedad) => {
                      const grupoColor =
                        propiedad.propiedad?.grupoColor || "GRIS";
                      const color = grupoColor.toLowerCase().replace(/_/g, "-");
                      const colorClase = `color-${color}`;

                      return (
                        <div
                          key={propiedad.id}
                          className={`tarjeta-propiedad-mini ${colorClase}`}
                          onClick={() => {
                            setPropiedadSimulada(propiedad);
                            setMenuSimulacionActivo(true);
                          }}
                        >
                          {propiedad.propiedad?.nombre || propiedad.nombre}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 🧾 Columna derecha: acciones */}
                <div className="columna-acciones-scroll">
                  <h3 className="subtitulo-submenu">Acciones simuladas:</h3>
                  <div className="lista-acciones-scroll">
                    <ul className="lista-acciones">
                      {accionesSimuladas.map((a, i) => (
                        <li key={i}>
                          {a.label} — +{a.importe}€
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="resumen-deuda-fijo">
                    <p>💵 Dinero actual: {dineroActual}</p>
                    <p>💸 Deuda pendiente: {deudaPendiente}</p>
                    <p>📈 Dinero con acciones: {dineroSimulado}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              className="boton-cancelar-modal"
              onClick={() => {
                setMostrarIntentarPagar(false);
                setMostrarPopupQuiebra(true);
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {menuSimulacionActivo && propiedadSimulada && (
        <div className="popup-simulacion">
          <h4>{propiedadSimulada.propiedad?.nombre}</h4>

          {/* Solo mostrar si la propiedad no está hipotecada */}
          {!propiedadSimulada.hipotecada && (
            <button onClick={() => simularHipoteca(propiedadSimulada)}>
              🏦 Hipotecar
            </button>
          )}

          {/* Mostrar vender casa si tiene casas */}
          {propiedadSimulada.casas > 0 && (
            <button onClick={() => simularVentaCasa(propiedadSimulada)}>
              🏚️ Vender construcción
            </button>
          )}

          {/* Mostrar vender hotel si tiene hotel */}
          {propiedadSimulada.hotel && (
            <button onClick={() => simularVentaHotel(propiedadSimulada)}>
              🏨 Vender construcción
            </button>
          )}

          {/* Siempre puede vender la propiedad al banco */}
          <button onClick={() => simularVentaPropiedad(propiedadSimulada)}>
            🏷️ Vender propiedad
          </button>

          <button onClick={() => setMenuSimulacionActivo(false)}>
            ❌ Cancelar
          </button>
        </div>
      )}

      {mostrarRealizarVentas && (
        <PopupRealizarVentas
          jugadorActual={jugadorActual}
          propiedades={
            Array.isArray(propiedadesJugador) ? propiedadesJugador : []
          }
          setMostrarRealizarVentas={setMostrarRealizarVentas}
          deudaPendiente={deudaPendiente}
          setMostrarPopupQuiebra={setMostrarPopupQuiebra}
          propiedadEnAccion={propiedadEnAccion}
          onVenderConstruccion={venderConstruccion}
          onHipotecarPropiedad={hipotecarPropiedad}
          onVenderPropiedad={venderPropiedadAlBanco}
          setJugadores={setJugadores}
          setPropiedadesJugador={setPropiedadesJugador}
        />
      )}

      {mostrarPopupSubastaFinal && subastaLanzada?.propiedad && (
        <div className="popup-subasta">
          <h3
            className={`titulo-propiedad color-${
              casillasInfo.find((c) => c.id === subastaLanzada.propiedad.id)
                ?.color || "gris"
            }`}
          >
            Ofertas por: {subastaLanzada.propiedad.nombre}
          </h3>

          {/* 🔍 Aquí empieza el mapa de ofertas */}
          {subastaLanzada.ofertas.map((oferta, index) => {
            const jugador = jugadores.find((j) => j.id === oferta.jugadorId);
            const nombreMostrado =
              jugador?.nombre || `Jugador ${oferta.jugadorId}`;

            return (
              <div
                key={index}
                className="oferta-subasta"
                style={{ color: "black", marginBottom: "10px" }}
              >
                <p>
                  💰 <strong>{nombreMostrado}</strong> ofrece{" "}
                  <strong>{oferta.cantidad}€</strong>
                </p>
                <button onClick={() => aceptarOferta(oferta)}>
                  ✅ Aceptar esta oferta
                </button>
              </div>
            );
          })}

          <button
            style={{ marginTop: "20px" }}
            onClick={() => {
              setMostrarPopupSubastaFinal(false); // cerrar primero
              setTimeout(() => {
                setSubastaLanzada(null);
                localStorage.removeItem("subastaLanzada");
              }, 200); // prevenir error en render
            }}
          >
            ❌ Rechazar todas
          </button>
        </div>
      )}

      {mensajeOferta && <div className="mensaje-popup">🎯 {mensajeOferta}</div>}

      {propiedadEnConfirmacion && (
        <div className="popup-acciones-propiedad">
          <h3
            className={`titulo-propiedad color-${
              casillasInfo.find(
                (c) => c.id === propiedadEnConfirmacion.propiedad.id
              )?.color || "gris"
            }`}
          >
            {propiedadEnConfirmacion.propiedad.nombre}
          </h3>
          <p>
            ¿Estás seguro de que quieres{" "}
            {propiedadEnConfirmacion.hipotecada
              ? "deshipotecar "
              : "hipotecar "}
            esta propiedad por{" "}
            <strong>
              {propiedadEnConfirmacion.hipotecada
                ? Math.floor(propiedadEnConfirmacion.propiedad.precio * 0.55)
                : propiedadEnConfirmacion.propiedad.precio / 2}
              €
            </strong>
            ?
          </p>

          <div className="botones-acciones-propiedad">
            <button
              onClick={() => {
                hipotecarPropiedad(propiedadEnConfirmacion);
                setPropiedadEnConfirmacion(null);
                setPropiedadEnAccion(null);
              }}
            >
              ✅ Sí,{" "}
              {propiedadEnConfirmacion.hipotecada
                ? "deshipotecar"
                : "hipotecar"}
            </button>
            <button onClick={() => setPropiedadEnConfirmacion(null)}>
              ❌ Cancelar
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
      {alertaSuperior && (
        <div className="alerta-superior">{alertaSuperior}</div>
      )}
    </div>
  );
}
