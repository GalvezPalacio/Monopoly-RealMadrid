# 🎮 Interfaz de Usuario

La interfaz del juego Monopoly está diseñada para ser clara, visual y dinámica. Se ha desarrollado usando React y CSS, 
con un enfoque modular y adaptable a cualquier resolución de pantalla.

## 🏁 Pantalla de inicio

- Presenta un título llamativo y opciones principales:  
  `➤ Empezar partida` | `➤ Crear jugadores` | `➤ Cargar partida`
- Fondo visual representando el universo del Monopoly Real Madrid.

📷 **Descripción de captura sugerida:**  
Una imagen con los botones mencionados, fondo con estilo y sin jugadores aún definidos.

---

## 👥 Creación de jugadores

- Formulario con campos:
  - Nombre del jugador
  - Selección de ficha (solo se muestran las disponibles)
- Al confirmar, el jugador aparece listado con su ficha.

📷 **Descripción de captura sugerida:**  
Vista del formulario con un jugador ya añadido y opciones de fichas.

---

## 🎲 Tablero de juego

- Imagen del tablero clásico de Monopoly, con casillas personalizadas (como *Calle de Caminando a Chamartín* o *Palco VIP*).
- Las fichas de los jugadores se mueven sobre el tablero al tirar los dados.
- Las casillas se posicionan con `gridArea`, respetando su distribución original.

📷 **Descripción de captura sugerida:**  
Tablero completo con fichas visibles, botones laterales (tirar dado, acciones, propiedades…).

---

## 📍 Popups de casillas

- **Propiedad**: muestra nombre, color, alquileres, estado (libre, hipotecada, con casas u hotel) y botones como "Comprar", 
"Pagar alquiler" o "Construir".

- **Suerte / Comunidad**: tarjeta horizontal con mensaje y diseño temático.
- **Impuesto / Grada / Cárcel / Salida**: se muestran de forma visual sin acciones si no es necesario.

📷 **Descripción de captura sugerida:**  
Popup de una propiedad como *Calle de ¡¡ Hasta El Final !!* mostrando todas sus opciones.

---

## 🧍 Panel lateral del jugador

- Muestra:
  - Dinero actual
  - Propiedades poseídas (en tarjetas pequeñas)
  - Botones disponibles según fase del turno: tirar dado, construir, hipotecar, finalizar turno…

📷 **Descripción de captura sugerida:**  
Panel completo de un jugador con propiedades y botones activos.

---

## 🎯 Diseño general

- Colores que reflejan el estilo del Monopoly clásico y el Real Madrid.
- Botones modernos, tarjetas con bordes redondeados, tipografía clara y diseño responsive.
- Interacciones fluidas entre componentes y retroalimentación visual inmediata (por ejemplo, al mover una ficha o aplicar una tarjeta).

---

