export default function PanelTurno({
  resultado,
  casilla,
  acciones,
  onTirarDado,
  onTerminarTurno,
  tieneElTurno,
  onComprar,
  opcionesConstruccion,
  onConstruirCasa,
  onConstruirHotel
}) {
  if (!tieneElTurno) return null;

  return (
    <div className="panel-turno">
      <div className="botones-turno">
        {resultado === null ? (
          <button className="boton-dado" onClick={onTirarDado}>
            🎲 Tirar dado
          </button>
        ) : (
          <>
            {acciones.includes("Comprar") && (
              <button className="boton-comprar" onClick={onComprar}>
                Comprar propiedad
              </button>
            )}

            {opcionesConstruccion?.gruposConCasas?.length > 0 && (
              <button className="boton-construir-casa" onClick={onConstruirCasa}>
                Construir casa
              </button>
            )}

            {opcionesConstruccion?.gruposConHotel?.length > 0 && (
              <button className="boton-construir-hotel" onClick={onConstruirHotel}>
                Construir hotel
              </button>
            )}

            <button className="boton-terminar-turno" onClick={onTerminarTurno}>
              Terminar turno
            </button>
          </>
        )}
      </div>

      {resultado !== null && (
        <div className="info-turno">
          <p><strong>Has sacado:</strong> {resultado}</p>
          <p><strong>Casilla:</strong> {casilla.nombre}</p>
          <p><strong>Tipo:</strong> {casilla.tipo}</p>

          {acciones.length > 0 && (
            <div className="acciones-turno">
              <p><strong>Acciones disponibles:</strong></p>
              <ul>
                {acciones.map((accion, i) => (
                  <li key={i}>{accion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}