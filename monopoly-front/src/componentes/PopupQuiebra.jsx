import React from "react";
import "./PopupQuiebra.css";

const PopupQuiebra = ({
  estado,
  onEliminarse,
  onTransferir,
  onIntentarPagar,
}) => {
  if (!estado?.enQuiebra) return null;

  return (
    <div className="popup-quiebra-overlay">
      <div className="popup-quiebra">
        <h2>💥 Estás en quiebra</h2>
        <p>
          Dinero actual: <strong>{estado.dinero} €</strong>
        </p>
        <p>
          Deuda pendiente: <strong>{estado.deudaPendiente} €</strong>
        </p>
        {estado.jugadorAcreedor && (
          <p>
            Debes pagar a: <strong>{estado.jugadorAcreedor}</strong>
          </p>
        )}

        <div className="botones-quiebra">
          <button onClick={onEliminarse}>❌ Eliminarse</button>
          {estado.jugadorAcreedor && (
            <button onClick={onTransferir}>
              💸 Transferir todo al acreedor
            </button>
          )}
          <button onClick={onIntentarPagar}>🔁 Simular ventas</button>
        </div>
      </div>
    </div>
  );
};

export default PopupQuiebra;
