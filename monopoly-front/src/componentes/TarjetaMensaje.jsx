import React from "react";
import "./TarjetaMensaje.css";

const TarjetaMensaje = ({ mensaje, tipo, onCerrar, onGuardar }) => {
  const imagenFondo =
    tipo === "comunidad"
      ? "/tarjeta-comunidad-popup.png"
      : "/tarjeta-suerte-popup.png";

  return (
    <div className="tarjeta-mensaje-overlay">
      <div className="tarjeta-mensaje-sola">
        <img src={imagenFondo} alt="Tarjeta" className="tarjeta-fondo-img" />
        <div className="tarjeta-mensaje-texto">{mensaje}</div>

        {mensaje === "🎁 Te libras de la cárcel. Guarda esta tarjeta." ? (
          <button className="boton-cerrar-mensaje" onClick={onGuardar}>
            Guardar
          </button>
        ) : (
          <button className="boton-cerrar-mensaje" onClick={onCerrar}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default TarjetaMensaje;
