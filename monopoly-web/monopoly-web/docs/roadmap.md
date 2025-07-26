# 🗺️ Roadmap del Proyecto Monopoly Real Madrid

Este roadmap describe la evolución del desarrollo del proyecto Monopoly temático del Real Madrid, desde su concepción 
hasta su estado actual. Incluye las etapas clave, funcionalidades implementadas y mejoras previstas.

---

## ✅ Fases completadas

### 🔹 1. Diseño y planificación inicial
- Definición del objetivo: versión web de Monopoly personalizada.
- Selección de tecnologías: Spring Boot (backend) y React (frontend).
- Estructura inicial del repositorio (`backend/` y `frontend/` separados).
- Personalización de propiedades, estaciones y tarjetas.

### 🔹 2. Backend funcional
- Modelado de entidades: `Jugador`, `Propiedad`, `Partida`, `Tarjeta`, etc.
- Lógica de:
  - Creación y finalización de partidas.
  - Movimiento de fichas.
  - Compra, construcción, hipotecas.
  - Gestión de tarjetas de Suerte y Comunidad.
  - Alquileres y cobros automáticos.
- API REST documentada.

### 🔹 3. Frontend completo
- Tablero interactivo con imagen de fondo.
- Movimiento de fichas en tiempo real.
- Panel de jugador lateral con información detallada.
- Popups de propiedades y tarjetas.
- Construcción de casas y hoteles.
- Diseño responsivo, moderno y temático.

### 🔹 4. Persistencia de estado
- Guardado manual de partidas.
- Eliminación automática de partidas no guardadas.
- Relación entre propiedades y partidas (`PropiedadPartida`).

---

## 🚧 Mejoras en desarrollo o pendientes

### 🔄 Sistema de turnos mejorado
- Detección de dobles para repetir turno.
- Control de cárcel: pago, carta o tirar dobles.
- Eventos automáticos tras tirar los dados.

### 🧠 Lógica avanzada de tarjetas
- Efectos más variados (devolver propiedades, recibir construcciones, pagar a jugadores…).
- Condiciones dinámicas.

### 💾 Guardado y carga avanzada
- Lista de partidas guardadas.
- Continuación de partidas seleccionadas.

### 🎨 Personalización avanzada
- Selector de temas visuales.
- Nuevos tableros temáticos (Champions, Bernabéu, etc.).

---

## 🌟 Futuras ideas

- Modo multijugador online (vía WebSockets).
- Animaciones visuales más elaboradas.
- Ranking de partidas ganadas por jugador.
- Panel de administración de tarjetas y reglas.
- Exportación de partidas a PDF.

---

Este roadmap refleja una base sólida y profesional, con espacio para evolucionar hacia un producto más complejo, visual e interactivo.

