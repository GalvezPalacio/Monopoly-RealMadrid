import "./TarjetaPropiedad.css";

export default function TarjetaPropiedad({ propiedad, onClose }) {
  console.log("📦 Propiedad recibida:", propiedad);
  console.log("📦 propiedad.propiedad:", propiedad?.propiedad);
  if (!propiedad) return null;

  const datos = propiedad.propiedad || propiedad; // Fallback por si no viene anidado

  if (!datos) return null; // Si sigue sin datos, no renderiza nada

  // ================== TARJETAS DE ESQUINA ==================
  const esquinas = {
    salida: {
      imagen: "/casilla-salida.png",
      alt: "Casilla de salida",
    },
    "visita-carcel": {
      imagen: "/carcel-visita.png",
      alt: "Visita a la cárcel",
    },
    "palco-vip": {
      imagen: "/palco-vip.png",
      alt: "Palco VIP",
    },
    "vas-grada": {
      imagen: "/vas-a-la-grada.png",
      alt: "Vas a la grada",
    },
  };

  if (esquinas[datos.tipo]) {
    const { imagen, alt } = esquinas[datos.tipo];
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

  if (datos.tipo === "comunidad") {
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

  if (datos.tipo === "impuesto") {
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

  if (datos.tipo === "suerte") {
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

  if (datos.tipo === "compania") {
    return (
      <div className="popup-compania">
        <img
          src={datos.imagen || "/compania-generica.png"}
          alt={datos.nombre}
          className="imagen-compania"
        />
        <button className="cerrar-imagen" onClick={onClose}>
          Cerrar
        </button>
      </div>
    );
  }

  if (datos.tipo === "estacion") {
    return (
      <div className="popup-estacion">
        <img
          src={datos.imagen || "/estacion-generica.png"}
          alt={datos.nombre}
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
          backgroundImage: datos.fondo ? `url(${datos.fondo})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="overlay-carta" />

        <div className={`encabezado color-${datos.color}`}>{datos.nombre}</div>

        <div className="detalles-arriba">
          <p className="precio-grande">Precio: {datos.precio}€</p>
          <p>
            <span>Hipoteca:</span> <span>{datos.hipoteca}€</span>
          </p>
          <p>
            <span>Coste casa:</span> <span>{datos.costeCasa}€</span>
          </p>
          <p>
            <span>Coste hotel:</span> <span>{datos.costeHotel}€</span>
          </p>
        </div>

        <hr />

        <div className="detalles-abajo">
          <p>
            <span>Alquiler base:</span> <span>{datos.alquiler?.base}€</span>
          </p>
          <p>
            <span>Con 1 casa:</span> <span>{datos.alquiler?.casa1}€</span>
          </p>
          <p>
            <span>Con 2 casas:</span> <span>{datos.alquiler?.casa2}€</span>
          </p>
          <p>
            <span>Con 3 casas:</span> <span>{datos.alquiler?.casa3}€</span>
          </p>
          <p>
            <span>Con 4 casas:</span> <span>{datos.alquiler?.casa4}€</span>
          </p>
          <p>
            <span>Con hotel:</span> <span>{datos.alquiler?.hotel}€</span>
          </p>
        </div>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
