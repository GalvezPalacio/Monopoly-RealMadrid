import "./SelectorConstructor.css";
import casillasInfo from "../datos/casillasInfo";

export default function SelectorConstruccion({
  propiedades,
  onSeleccionar,
  onCerrar,
  tipo,
}) {
  console.log("🧩 Propiedades en selector:", propiedades);

  return (
    <div className="selector-construccion-overlay">
      <div className="selector-construccion-popup">
        <h3>
          Elige una propiedad para construir{" "}
          {tipo === "hotel" ? "un hotel" : "una casa"}
        </h3>
        <div className="grid-propiedades">
          {propiedades
            .filter((p) => p?.propiedad) // Protección frente a undefined
            .map((p) => {
              const casilla = casillasInfo.find((c) => c.id === p.propiedad.id);
              const color = casilla?.color || "gris";

              return (
                <div
                  key={p.id}
                  className={`tarjeta-propiedad-construccion color-${color}`}
                  onClick={() => onSeleccionar(p.propiedad.id)}
                >
                  <span className="nombre-propiedad">{p.propiedad.nombre}</span>

                  <div className="edificaciones">
                    {tipo === "casa" &&
                      !p.hotel &&
                      [...Array(p.casas)].map((_, i) => (
                        <img
                          key={i}
                          src="/casa-monopoly.png"
                          alt="Casa"
                          className="icono-edificacion"
                        />
                      ))}

                    {tipo === "hotel" && p.hotel && (
                      <img
                        src="/hotel-monopoly.png"
                        alt="Hotel"
                        className="icono-edificacion hotel"
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <button className="cerrar-popup" onClick={onCerrar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
