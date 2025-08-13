import React, { useState, useEffect } from "react";
import "./PopupTrueque.css";

const PopupTrueque = ({
  jugadores,
  propiedades,
  jugadorActual,
  jugadorObjetivo,
  setJugadorObjetivo,
  onClose,
}) => {
  const handleCancelar = () => {
    setJugadorObjetivo(null); // ✅ limpiar el estado global
    onClose();
  };
  const misPropiedades = propiedades.filter(
    (p) => p.dueno?.id === jugadorActual.id
  );

  const [propiedadesOfrecidas, setPropiedadesOfrecidas] = useState([]);
  const [propiedadesPedidas, setPropiedadesPedidas] = useState([]);
  const [dineroOfrecido, setDineroOfrecido] = useState("");
  const [dineroPedido, setDineroPedido] = useState("");
  const [mostrarListaReceptor, setMostrarListaReceptor] = useState(false);
  const [mostrarListaPropias, setMostrarListaPropias] = useState(false);
  const [propiedadesReceptor, setPropiedadesReceptor] = useState([]);
  const [ofreceTarjeta, setOfreceTarjeta] = useState(false);
  const [pideTarjeta, setPideTarjeta] = useState(false);

  const jugadoresDisponibles = jugadores.filter(
    (j) => j.id !== jugadorActual.id
  );

  const manejarSeleccionJugador = (jugador) => {
    if (jugadorObjetivo?.id === jugador.id) {
      // Si ya está seleccionado, al pulsar otra vez lo deselecciona
      setJugadorObjetivo(null);
      setMostrarListaReceptor(false);
      setPropiedadesReceptor([]);
    } else {
      // Selecciona nuevo jugador
      setJugadorObjetivo(jugador);
      setMostrarListaReceptor(true);
    }
  };

  const proponerTrueque = async () => {
    if (!jugadorObjetivo || !jugadorObjetivo.id) {
      alert(
        "❌ Debes seleccionar un jugador receptor antes de proponer el trueque."
      );
      return;
    }

    const truequeDTO = {
      jugadorOfertanteId: jugadorActual.id,
      jugadorReceptorId: jugadorObjetivo.id,
      propiedadesOfrecidas,
      ofreceTarjetaSalirCarcel: ofreceTarjeta,
      dineroOfrecido: parseInt(dineroOfrecido) || 0,
      propiedadesPedidas,
      pideTarjetaSalirCarcel: pideTarjeta,
      dineroPedido: parseInt(dineroPedido) || 0,
    };

    console.log("📤 Enviando trueque:", truequeDTO); // ✅ AQUÍ VA

    try {
      const respuesta = await fetch(
        "http://localhost:8081/api/trueque/proponer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(truequeDTO),
        }
      );

      if (respuesta.ok) {
        alert("✅ Trueque propuesto con éxito");
        onClose(); // cierra el popup
      } else {
        const error = await respuesta.text();
        alert("❌ Error al proponer trueque: " + error);
      }
    } catch (error) {
      console.error("Excepción:", error);
      alert("❌ Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    console.log("🌀 useEffect disparado: jugadorObjetivo y propiedades");
    console.log("jugadorObjetivo:", jugadorObjetivo);
    console.log("propiedades:", propiedades);

    if (jugadorObjetivo) {
      const propsJugador = propiedades.filter((p) => {
        const esDelObjetivo = p.dueno?.id === jugadorObjetivo.id;

        console.log(
          `🔍 Evaluando propiedad ${p.id} -> dueño: ${
            p.dueno?.id
          } | objetivo: ${jugadorObjetivo.id} => ${
            esDelObjetivo ? "✅ SÍ" : "❌ NO"
          }`
        );

        return esDelObjetivo;
      });

      console.log("🎯 Propiedades del jugador objetivo:", propsJugador);

      setPropiedadesReceptor(propsJugador);
      setMostrarListaReceptor(true);
    } else {
      setPropiedadesReceptor([]);
      setMostrarListaReceptor(false);
    }
  }, [jugadorObjetivo, propiedades]);

  return (
    <div className="popup-trueque">
      <div className="contenedor-trueque">
        <h2>Trueque</h2>

        {/* BLOQUE OFRECIDAS */}
        <div className="seccion-ofrecidas">
          <h3>Propiedades ofrecidas</h3>
          <div className="lista-ofrecidas">
            {propiedadesOfrecidas.map((id) => {
              const prop = misPropiedades.find((p) => p.id === id);
              return (
                <div
                  key={id}
                  className={`item-base propiedad-item color-${
                    prop?.propiedad?.grupoColor?.toLowerCase() || ""
                  }`}
                >
                  {prop?.propiedad?.nombre || `Propiedad ${id}`}
                </div>
              );
            })}
            {dineroOfrecido && (
              <div className="dinero-ofrecido">{dineroOfrecido} €</div>
            )}
            {jugadorActual?.tieneTarjetaSalirCarcel && (
              <div className="checkbox-trueque">
                <label>
                  <input
                    type="checkbox"
                    checked={ofreceTarjeta}
                    onChange={(e) => setOfreceTarjeta(e.target.checked)}
                  />
                  Ofrecer tarjeta de “Salir de la cárcel”
                </label>
              </div>
            )}
          </div>

          <label>
            Dinero ofrecido (€):
            <input
              type="number"
              className="input-dinero"
              value={dineroOfrecido}
              onChange={(e) => setDineroOfrecido(e.target.value)}
            />
          </label>

          <button
            className="btn-propias"
            onClick={() => setMostrarListaPropias(!mostrarListaPropias)}
          >
            📦 Mis propiedades
          </button>
        </div>

        {mostrarListaPropias && (
          <div className="lista-propias">
            {misPropiedades.map((prop) => (
              <div
                key={prop.id}
                className={`item-base propiedad-item color-${
                  prop.propiedad?.grupoColor?.toLowerCase() || ""
                } ${
                  propiedadesOfrecidas.includes(prop.id) ? "seleccionada" : ""
                }`}
                onClick={() => {
                  if (propiedadesOfrecidas.includes(prop.id)) {
                    setPropiedadesOfrecidas(
                      propiedadesOfrecidas.filter((id) => id !== prop.id)
                    );
                  } else {
                    setPropiedadesOfrecidas([...propiedadesOfrecidas, prop.id]);
                  }
                }}
              >
                {prop.propiedad?.nombre || `Propiedad ${prop.id}`}
              </div>
            ))}
          </div>
        )}

        <hr />

        {/* BLOQUE PEDIDAS */}
        <div className="seccion-pedidas">
          <h3>Propiedades pedidas</h3>

          <div className="lista-pedidas">
            {/* Mostrar propiedades seleccionadas */}
            {propiedades
              .filter((prop) => propiedadesPedidas.includes(prop.id))
              .map((prop) => (
                <div
                  key={prop.id}
                  className={`item-base propiedad-item color-${
                    prop.propiedad?.grupoColor?.toLowerCase() || ""
                  }`}
                >
                  {prop.propiedad?.nombre || `Propiedad ${prop.id}`}
                </div>
              ))}

            {/* Mostrar dinero pedido si existe */}
            {dineroPedido && (
              <div className="dinero-pedido">{dineroPedido} €</div>
            )}
            {jugadorObjetivo?.tieneTarjetaSalirCarcel && (
              <div className="checkbox-trueque">
                <label>
                  <input
                    type="checkbox"
                    checked={pideTarjeta}
                    onChange={(e) => setPideTarjeta(e.target.checked)}
                  />
                  Pedir tarjeta de “Salir de la cárcel”
                </label>
              </div>
            )}
          </div>

          <label>
            Dinero pedido (€):
            <input
              type="number"
              className="input-dinero"
              value={dineroPedido}
              onChange={(e) => setDineroPedido(e.target.value)}
            />
          </label>

          <div className="botones-jugadores">
            {jugadoresDisponibles.map((j) => (
              <button
                key={j.id}
                className="btn-otro-jugador"
                onClick={() => manejarSeleccionJugador(j)}
              >
                🎯 {j.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* BLOQUE RECEPTOR */}
        {mostrarListaReceptor && jugadorObjetivo && (
          <div className="lista-receptor">
            {propiedadesReceptor.length === 0 ? (
              <div style={{ fontStyle: "italic", color: "gray" }}>
                Este jugador no tiene propiedades.
              </div>
            ) : (
              propiedadesReceptor.map((prop) => (
                <div
                  key={prop.id}
                  className={`item-base propiedad-item color-${
                    prop.propiedad?.grupoColor?.toLowerCase() || ""
                  } ${
                    propiedadesPedidas.includes(prop.id) ? "seleccionada" : ""
                  }`}
                  onClick={() => {
                    if (propiedadesPedidas.includes(prop.id)) {
                      setPropiedadesPedidas(
                        propiedadesPedidas.filter((id) => id !== prop.id)
                      );
                    } else {
                      setPropiedadesPedidas([...propiedadesPedidas, prop.id]);
                    }
                  }}
                >
                  {prop.propiedad?.nombre || `Propiedad ${prop.id}`}
                </div>
              ))
            )}
          </div>
        )}

        {/* BOTONES FINALES */}
        <div className="botones-finales">
          <button className="btn-proponer" onClick={proponerTrueque}>
            Proponer trueque
          </button>
          <button className="btn-cancelar" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupTrueque;
