// src/componentes/MiniTarjetaPropiedad.jsx
import React from "react";
import "./MiniTarjetaPropiedad.css"; // crea el CSS aparte

function obtenerRutaImagenMini(nombre) {
  if (!nombre) return "";
  const normalizado = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/calle de |compania|estacion de |d\. |el /g, "") // limpia texto
    .replace(/[^\w\s-]/g, "") // quita símbolos raros
    .trim()
    .replace(/\s+/g, "-");

  return `/imagenes-minitarjetas/${normalizado}.png`;
}

export default function MiniTarjetaPropiedad({ propiedad }) {
  if (!propiedad) return null;

  return (
    <div className="mini-tarjeta">
      <div className={`cabecera ${propiedad.color}`}>
        {propiedad.nombre.toUpperCase()}
      </div>
      <div
        className="imagen-mini"
        style={{
          backgroundImage: `url(${obtenerRutaImagenMini(propiedad.nombre)})`,
        }}
      ></div>
    </div>
  );
}
