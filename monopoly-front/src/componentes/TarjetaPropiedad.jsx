import "./TarjetaPropiedad.css";

export default function TarjetaPropiedad({ propiedad, onClose }) {
  if (!propiedad) return null;

  // ================== TARJETAS DE ESQUINA ==================
  const esquinas = {
    "salida": {
      imagen: "/casilla-salida.png",
      alt: "Casilla de salida"
    },
    "visita-carcel": {
      imagen: "/carcel-visita.png",
      alt: "Visita a la cárcel"
    },
    "palco-vip": {
      imagen: "/palco-vip.png",
      alt: "Palco VIP"
    },
    "vas-grada": {
      imagen: "/vas-a-la-grada.png",
      alt: "Vas a la grada"
    }
  };
if (esquinas[propiedad.tipo]) {
  const { imagen, alt } = esquinas[propiedad.tipo];
  return (
    <div className="popup-esquina">
      <div className="tarjeta-esquina">
        <img src={imagen} alt={alt} className="imagen-esquina" />
        <button className="boton-cerrar-esquina" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

  // ================== RESTO DE TARJETAS ==================

  if (propiedad.tipo === "comunidad") {
    return (
      <div className="popup-comunidad">
        <img
          className="imagen-comunidad-completa"
          src="/caja-comunidad.png"
          alt="Carta de comunidad"
        />
        <button className="cerrar-imagen" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  if (propiedad.tipo === "impuesto") {
    return (
      <div className="popup-impuesto">
        <img
          src="/impuesto-lujo.png"
          alt="Impuesto de lujo"
          className="imagen-impuesto-completa"
        />
        <button className="cerrar-imagen" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  if (propiedad.tipo === "suerte") {
    return (
      <div className="popup-suerte">
        <div className="contenido-suerte">
          <p className="texto-superior">¡Has caído en la casilla de SUERTE!</p>
          <img
            src="/tarjeta-suerte.png"
            alt="Tarjeta de Suerte"
            className="imagen-fondo-suerte"
          />
          <p className="texto-inferior">
            Coge una tarjeta para descubrir tu destino...
          </p>
          <button className="boton-cerrar-suerte" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (propiedad.tipo === "compania") {
    return (
      <div className="popup-compania">
        <img
          src={propiedad.imagen || "/compania-generica.png"}
          alt={propiedad.nombre}
          className="imagen-compania"
        />
        <button className="cerrar-imagen" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  if (propiedad.tipo === "estacion") {
    return (
      <div className="popup-estacion">
        <img
          src={propiedad.imagen || "/estacion-generica.png"}
          alt={propiedad.nombre}
          className="imagen-estacion"
        />
        <button className="cerrar-imagen" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  // ================== TARJETA DE PROPIEDAD ==================
  return (
    <div className="tarjeta-propiedad">
      <div
        className="carta"
        style={{
          backgroundImage: propiedad.fondo ? `url(${propiedad.fondo})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center 40px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div className="overlay-carta" />

        <div className={`encabezado color-${propiedad.color}`}>
          {propiedad.nombre}
        </div>

        <div className="detalles-arriba">
          <p className="precio-grande">Precio: {propiedad.precio}€</p>
          <p><span>Hipoteca:</span> <span>{propiedad.hipoteca}€</span></p>
          <p><span>Coste casa:</span> <span>{propiedad.costeCasa}€</span></p>
          <p><span>Coste hotel:</span> <span>{propiedad.costeHotel}€</span></p>
        </div>

        <hr />

        <div className="detalles-abajo">
          <p><span>Alquiler base:</span> <span>{propiedad.alquiler?.base}€</span></p>
          <p><span>Con 1 casa:</span> <span>{propiedad.alquiler?.casa1}€</span></p>
          <p><span>Con 2 casas:</span> <span>{propiedad.alquiler?.casa2}€</span></p>
          <p><span>Con 3 casas:</span> <span>{propiedad.alquiler?.casa3}€</span></p>
          <p><span>Con 4 casas:</span> <span>{propiedad.alquiler?.casa4}€</span></p>
          <p><span>Con hotel:</span> <span>{propiedad.alquiler?.hotel}€</span></p>
        </div>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}