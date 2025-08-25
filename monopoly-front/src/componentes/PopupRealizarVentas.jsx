import "./PopupRealizarVentas.css";
import React, { useState } from "react";

const PopupRealizarVentas = ({
  propiedades,
  jugadorActual,
  deudaPendiente,
  setMostrarRealizarVentas, // ✅ AÑADIR
  setMostrarPopupQuiebra,
  propiedadEnAccion,
  onVenderConstruccion,
  onVenderPropiedad,
  setJugadores,
  setPropiedadesJugador,
  onHipotecarPropiedad,
}) => {
  const [propiedadEnVenta, setPropiedadEnVenta] = useState(null);
  const dineroActual = jugadorActual?.dinero || 0;
  const puedePagarDeuda = jugadorActual?.dinero >= deudaPendiente;

  console.log("Propiedades recibidas:", propiedades);

  return (
    <div className="popup-overlay">
      <div className="popup-realizar-ventas">
        <h2>💰 Realizar acciones de venta</h2>
        <div className="contenido-popup-ventas">
          {/* Columna izquierda */}
          <div className="columna-propiedades-scroll">
            <h3 className="subtitulo-submenu">Propiedades</h3>
            <div className="lista-propiedades-scroll">
              {propiedades.map((p) => {
                const grupoColor = p.propiedad?.grupoColor || "GRIS";
                const colorClase =
                  "color-" + grupoColor.toLowerCase().replace(/_/g, "-");

                return (
                  <div
                    key={p.id}
                    className={`tarjeta-propiedad-mini ${colorClase}`}
                    onClick={() => setPropiedadEnVenta(p)}
                  >
                    {p.propiedad?.nombre || p.nombre}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="columna-acciones">
            <h3>Acciones</h3>

            {propiedadEnVenta ? (
              <>
                <p className="propiedad-seleccionada">
                  📍 Propiedad seleccionada:{" "}
                  <strong>
                    {propiedadEnVenta.propiedad?.nombre ||
                      propiedadEnVenta.nombre}
                  </strong>
                </p>

                <div className="botones-acciones">
                  {/* Vender construcción: solo si es tipo 'calle' y tiene casas o hotel */}
                  {(propiedadEnVenta?.tipo === "propiedad" ||
                    propiedadEnVenta?.propiedad?.tipo === "propiedad") &&
                    ((propiedadEnVenta?.hotel ?? 0) > 0 ||
                      (propiedadEnVenta?.casas ?? 0) > 0) && (
                      <button
                        onClick={() => onVenderConstruccion(propiedadEnVenta)}
                      >
                        🏠 Vender construcción
                      </button>
                    )}

                  {/* Vender propiedad: siempre disponible */}
                  {propiedadEnVenta.casas === 0 && !propiedadEnVenta.hotel && (
                    <button onClick={() => onVenderPropiedad(propiedadEnVenta)}>
                      🏷️ Vender propiedad
                    </button>
                  )}

                  {/* Hipotecar: solo si NO está hipotecada */}
                  {!propiedadEnVenta.hipotecada && (
                    <button
                      onClick={() => onHipotecarPropiedad(propiedadEnVenta)}
                    >
                      🏦 Hipotecar
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="instruccion">Selecciona una propiedad</p>
            )}

            <div className="resumen">
              <p>💶 Dinero: {dineroActual} €</p>
              <p>📉 Deuda pendiente: {deudaPendiente} €</p>
            </div>
          </div>
        </div>

        <button
          className="boton-cerrar"
          onClick={() => {
            setMostrarRealizarVentas(false);
            setMostrarPopupQuiebra(true);
          }}
        >
          {puedePagarDeuda && (
            <button
              className="boton-confirmar"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:8081/api/partidas/pagar-deuda?jugadorId=${jugadorActual.id}`,
                    { method: "POST" }
                  );

                  const mensaje = await res.text();
                  alert("✅ " + mensaje);

                  // Refrescar jugador y propiedades
                  const nuevos = await fetch(
                    `http://localhost:8081/api/partidas/${jugadorActual.partida.id}/jugadores`
                  ).then((r) => r.json());
                  setJugadores(nuevos);

                  const props = await fetch(
                    `http://localhost:8081/api/propiedadPartida/del-jugador?jugadorId=${jugadorActual.id}`
                  ).then((r) => r.json());
                  setPropiedadesJugador(props);

                  // Cierra el popup
                  setMostrarRealizarVentas(false);
                  setMostrarPopupQuiebra(false);
                } catch (err) {
                  console.error("❌ Error al pagar deuda:", err);
                  alert("❌ No se pudo pagar la deuda.");
                }
              }}
            >
              ✅ Pagar deuda
            </button>
          )}
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
};

export default PopupRealizarVentas;
