# Modelo de datos

El backend del juego Monopoly gestiona una serie de entidades que representan jugadores, partidas, propiedades y sus relaciones. 
A continuación se describen las principales:

---

## 📦 Entidades principales

### `Partida`
Representa una sesión de juego activa. Cada partida puede tener múltiples jugadores y un conjunto de propiedades asociadas.

**Campos principales:**
- `id`: identificador único
- `fechaCreacion`: fecha en que se inicia la partida
- `guardada`: booleano que indica si se ha guardado manualmente
- Relación: tiene muchos `Jugador` y muchas `PropiedadPartida`

---

### `Jugador`
Representa a cada persona que participa en la partida.

**Campos principales:**
- `id`: identificador del jugador
- `nombre`: nombre visible en la partida
- `dinero`: cantidad actual disponible
- `posicion`: casilla actual en el tablero
- `enCarcel`: booleano si está en la cárcel
- `partida`: referencia a la `Partida` en la que juega
- Relación: puede tener muchas `PropiedadPartida`

---

### `Propiedad`
Define cada casilla de tipo propiedad del tablero original. Es un catálogo fijo.

**Campos principales:**
- `id`: identificador único
- `nombre`: nombre de la propiedad
- `tipo`: puede ser `calle`, `estacion`, `compañia`
- `precio`, `hipoteca`, `costeCasa`, `costeHotel`
- `grupoColor`: para calles (ej. marrón, rojo, azul, etc.)

> Esta tabla es estática y no se modifica durante la partida.

---

### `PropiedadPartida`
Es la representación dinámica de una propiedad en una partida específica.

**Campos principales:**
- `id`
- `propiedad`: relación con `Propiedad` (estructura base)
- `partida`: relación con `Partida`
- `duenio`: jugador actual, si tiene dueño
- `casas`: número de casas construidas (0–4)
- `hotel`: booleano si tiene hotel
- `hipotecada`: booleano si está hipotecada

---

### `Tarjeta`
Representa una carta de Suerte o Comunidad.

**Campos principales:**
- `id`, `tipo`: `suerte` o `comunidad`
- `mensaje`: texto mostrado al jugador
- `accion`: tipo de acción (cobro, pago, mover, salir cárcel, etc.)

---

## 🔗 Relaciones

- Una `Partida` tiene muchos `Jugadores`
- Una `Partida` tiene muchas `PropiedadPartida`
- Una `PropiedadPartida` se basa en una `Propiedad`
- Un `Jugador` puede tener varias `PropiedadPartida`
- Una `Tarjeta` puede usarse durante una partida, pero no está ligada directamente en BDD (se usa por lógica)

---

Este modelo está pensado para permitir múltiples partidas activas a la vez, con independencia entre jugadores y propiedades, 
siguiendo el diseño clásico del juego Monopoly.
