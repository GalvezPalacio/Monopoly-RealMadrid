import "./SelectorConstructor.css";
import casillasInfo from "../datos/casillasInfo";

export default function SelectorConstruccion({ propiedades, onSeleccionar, onCerrar }) {
  return (
    <div className="selector-construccion-overlay">
      <div className="selector-construccion-popup">
        <h3>Elige una propiedad para construir</h3>
        <div className="grid-propiedades">
          {propiedades.map((p) => {
            const casilla = casillasInfo.find(c => c.id === p.propiedad.id);
            const color = casilla?.color?.toLowerCase() || "gris";

            return (
              <div
                key={p.id}
                className={`tarjeta-propiedad-construccion color-${color}`}
                onClick={() => onSeleccionar(p.propiedad.id)}
              >
                <div className="contenido-propiedad">
                  <span className="nombre-propiedad">{p.propiedad.nombre}</span>

                  <div className="edificaciones">
                    {!p.hotel &&
                      [...Array(p.casas)].map((_, i) => (
                        <img
                          key={i}
                          src="/casa-monopoly.png"
                          alt="Casa"
                          className="icono-edificacion"
                        />
                      ))}
                    {p.hotel && (
                      <img
                        src="/hotel-monopoly.png"
                        alt="Hotel"
                        className="icono-edificacion"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  );
}