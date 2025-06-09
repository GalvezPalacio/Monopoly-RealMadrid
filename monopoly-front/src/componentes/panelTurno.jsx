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
  onConstruirHotel,
  onTirarDesdeCarcel,
  onPagarCarcel,
  onUsarTarjetaCarcel
}) {
  if (!tieneElTurno) return null;

  // 🔒 Mostrar panel especial si el jugador está en la cárcel
  if (tieneElTurno.enCarcel) {
    return (
      <div className="panel-turno panel-carcel">
        <h2>⚠️ Estás en la grada</h2>
        <p>Elige cómo quieres intentar salir:</p>
        <div className="botones-turno">
          <button className="boton-dado" onClick={onTirarDesdeCarcel}>
            🎲 Tirar dado
          </button>
          <button className="boton-pagar" onClick={onPagarCarcel}>
            💰 Pagar 50€
          </button>
          {tieneElTurno.tieneTarjetaSalirCarcel && (
            <button className="boton-tarjeta" onClick={onUsarTarjetaCarcel}>
              🎴 Usar tarjeta
            </button>
          )}
        </div>
      </div>
    );
  }

  // 🔁 Panel normal si no está en la cárcel
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
          {typeof resultado === "object" && resultado.dado1 !== undefined ? (
            <p>
              <strong>Has sacado:</strong> {resultado.dado1} y {resultado.dado2} → Total: {resultado.suma}
            </p>
          ) : (
            <p><strong>Has sacado:</strong> {resultado}</p>
          )}

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