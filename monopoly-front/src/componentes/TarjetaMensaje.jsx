import React from "react";
import "./TarjetaMensaje.css";

const TarjetaMensaje = ({ mensaje, tipo, onCerrar }) => {
  const imagenFondo =
    tipo === "comunidad"
      ? "/tarjeta-comunidad-popup.png"
      : "/tarjeta-suerte-popup.png";

  return (
    <div className="tarjeta-mensaje-overlay">
      <div className="tarjeta-mensaje-sola">
        <img src={imagenFondo} alt="Tarjeta" className="tarjeta-fondo-img" />
        <div className="tarjeta-mensaje-texto">{mensaje}</div>

        <button className="boton-cerrar-mensaje" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TarjetaMensaje;