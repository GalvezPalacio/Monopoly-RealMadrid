## Funcionalidades del Backend

Esta sección resume las funcionalidades principales implementadas en el backend del juego, desarrolladas con Spring Boot y Java.

### Gestión de Partidas

- Creación de nuevas partidas.
- Guardado y recuperación de partidas anteriores.
- Eliminación de partidas no guardadas al finalizar.

### Control de Jugadores

- Registro de jugadores con nombre y ficha personalizada.
- Asociación de jugadores a partidas específicas.
- Gestión del turno de cada jugador.
- Almacenamiento del dinero actual de cada jugador.

### Propiedades y Construcciones

- Lógica para comprar propiedades y estaciones.
- Cálculo de alquiler según casas, hoteles, tipo de propiedad y dados.
- Construcción de casas y hoteles cumpliendo las reglas oficiales.
- Hipotecar o recuperar propiedades.

### Movimiento de Jugadores

- Movimiento según tirada de dados.
- Detección de dobles y gestión del turno extra.
- Transiciones entre casillas y activación de funciones según el tipo.

### Cartas y Eventos

- Lógica para robar cartas de Suerte y Comunidad.
- Aplicación de efectos como ganar/perder dinero, moverse, obtener tarjetas.
- Gestión de cartas como “Salir de la cárcel” o devolver propiedades.

### Fase de Turno

- Estructura por fases: tirar dados, ejecutar acción, construir, terminar turno.
- Avance ordenado entre jugadores.
- Control de repetición por dobles o penalizaciones.

### Alquiler y Finanzas

- Detección de propiedades con dueño.
- Cálculo dinámico del alquiler en función del estado de la propiedad.
- Descuento automático del dinero al jugador activo.
- Transferencia de dinero entre jugadores (pago de alquiler, subastas, etc).

### Cárcel

- Entrada a la cárcel (por casilla o carta).
- Salida pagando, con carta o sacando dobles.
- Control del número de turnos en prisión.

### Subastas 

- Posibilidad de subastar propiedades no compradas.
- Transferencia de propiedad al mejor postor.
- Descuento de dinero automático.

