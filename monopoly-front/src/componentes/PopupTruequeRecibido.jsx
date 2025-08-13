import React, { useMemo, useState } from "react";
import "./PopupTrueque.css";

export default function PopupTruequeRecibido({
  trueque,
  propiedades, // ← TODAS las PropiedadPartida de la partida
  onCerrar,
  onRefrescar, // ← para refrescar tablero tras aceptar
}) {
  const [cargando, setCargando] = useState(false);

  const nombreProp = (id) => {
    const p = propiedades?.find((x) => x.id === id);
    return p?.propiedad?.nombre || `Propiedad ${id}`;
  };

  const listaOfrecidas = useMemo(
    () => (trueque?.propiedadesOfrecidas || []).map((id) => nombreProp(id)),
    [trueque, propiedades]
  );
  const listaPedidas = useMemo(
    () => (trueque?.propiedadesPedidas || []).map((id) => nombreProp(id)),
    [trueque, propiedades]
  );

  const aceptar = async () => {
    try {
      setCargando(true);
      const r = await fetch(
        `http://localhost:8081/api/trueque/aceptar/${trueque.jugadorReceptorId}`,
        { method: "POST" }
      );
      const txt = await r.text();
      if (!r.ok) throw new Error(txt || "Error al aceptar el trueque");

      alert(txt || "✅ Trueque ejecutado con éxito");

      // ✅ Cierra el popup y limpia estado
      onCerrar();
      onRefrescar?.(); // solo si quieres recargar datos de partida
    } catch (e) {
      alert(e.message);
    } finally {
      setCargando(false);
    }
  };

  const rechazar = async () => {
    try {
      setCargando(true);
      const r = await fetch(
        `http://localhost:8081/api/trueque/rechazar/${trueque.jugadorOfertanteId}`,
        { method: "POST" } // ✅ era POST, no DELETE
      );
      const txt = await r.text();
      if (!r.ok) throw new Error(txt || "Error al rechazar el trueque");

      alert(txt || "❌ Propuesta rechazada");

      // ✅ Cierra el popup y limpia estado
      onCerrar();
      onRefrescar?.(); // solo si quieres recargar datos de partida
    } catch (e) {
      alert(e.message);
    } finally {
      setCargando(false);
    }
  };

  if (!trueque) return null;

  return (
    <div className="popup-trueque-recibido">
      <div className="contenedor-trueque">
        <h2>Propuesta de trueque</h2>

        <div className="seccion-ofrecidas">
          <h3>Te ofrecen</h3>
          <ul className="lista-ofrecidas">
            {listaOfrecidas.map((n, i) => (
              <li key={i} className="item-base">
                {n}
              </li>
            ))}
            {trueque.dineroOfrecido > 0 && (
              <li className="dinero-ofrecido">{trueque.dineroOfrecido} €</li>
            )}
            {trueque.ofreceTarjetaSalirCarcel && (
              <li>🎟️ Tarjeta “Salir de la cárcel”</li>
            )}
          </ul>
        </div>

        <hr />

        <div className="seccion-pedidas">
          <h3>Y piden a cambio</h3>
          <ul className="lista-pedidas">
            {listaPedidas.map((n, i) => (
              <li key={i} className="item-base">
                {n}
              </li>
            ))}
            {trueque.dineroPedido > 0 && (
              <li className="dinero-pedido">{trueque.dineroPedido} €</li>
            )}
            {trueque.pideTarjetaSalirCarcel && (
              <li>🎟️ Tu tarjeta “Salir de la cárcel”</li>
            )}
          </ul>
        </div>

        <div className="botones-finales">
          <button
            className="btn-proponer"
            onClick={aceptar}
            disabled={cargando}
          >
            ✅ Aceptar
          </button>
          <button
            className="btn-cancelar"
            onClick={rechazar}
            disabled={cargando}
          >
            ❌ Rechazar
          </button>
          <button
            className="btn-cancelar"
            onClick={onCerrar}
            disabled={cargando}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
