export default function PanelTurno({
  resultado,
  casilla,
  acciones,
  onTirarDado,
  onTerminarTurno,
  tieneElTurno,
  onComprar
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