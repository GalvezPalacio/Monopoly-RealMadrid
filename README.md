# 🏟️ Monopoly Web - Edición Real Madrid

Este es un proyecto web completo basado en el juego de mesa Monopoly, totalmente personalizado con temática del Real Madrid. Incluye lógica de juego real, gestión por turnos, subastas, cartas de suerte y comunidad, y muchas otras funcionalidades.

---

## ⚙️ Tecnologías utilizadas

### Backend
- Java 17
- Spring Boot 3
- MySQL (vía MySQL Workbench)
- IDE: NetBeans

### Frontend
- React.js
- JavaScript
- HTML y CSS
- IDE: Visual Studio Code

---

## 🎮 Funcionalidades implementadas

- ✅ Juego por turnos
- ✅ Movimiento con dados
- ✅ Tablero visual con casillas personalizadas
- ✅ Gestión de jugadores y fichas (selección única)
- ✅ Sistema de propiedades dinámicas por partida
- ✅ Construcción de casas y hoteles según reglas oficiales
- ✅ Lógica de cartas Suerte y Comunidad con efectos reales
- ✅ Subastas completas (ofertas, aceptación, transferencia)
- ✅ Cárcel: entrada, salida por dobles, carta o pago
- ✅ Alquileres (calculados según casas, hoteles, estaciones, compañías)
- ✅ Interfaz visual moderna con tarjetas, paneles y animaciones
- ✅ Guardado de partidas manual
- ✅ Eliminación automática de partidas no guardadas al finalizar
- ✅ Tablero con imagen de fondo y fichas animadas

---

## 🧩 Estructura del proyecto

- `/backend/`: aplicación Spring Boot con entidades, controladores, servicios y lógica del juego.
- `/frontend/`: aplicación React con todos los componentes del tablero, panel de jugador y tarjetas dinámicas.
- `/src/main/resources/`: contiene `application.properties`, configuración de conexión y mensajes.
- `/public/`: imagen de tablero, íconos de fichas y estilos base en React.
- Base de datos en MySQL con las tablas: `jugador`, `partida`, `propiedad`, `propiedad_partida`, `tarjeta`, etc.

---

## 🛠️ Cómo ejecutar el proyecto

### Backend (Java + Spring Boot)

1. Abrir el proyecto en **NetBeans**
2. Configurar tu conexión a MySQL en `application.properties`
3. Ejecutar la clase `MonopolyApplication.java` click derecho y run file


### Frontend (React)

1. Abrir la carpeta del frontend en **Visual Studio Code**
2. Ejecutar los siguientes comandos:

abrir terminal
```bash
npm run dev
```
---

## 📌 Estado actual

El juego es completamente funcional en navegador, con lógica de turno, subastas, tarjetas y acciones según reglas oficiales del Monopoly.  
Seguimos implementando lógica para dejar el juego completamente funcional.
Ahora mismo solo es en local, se tiene pensado poder configurar el juego online con varios servidores.

---

## 👨‍💻 Autor

Desarrollado por **GabryDev** ([`@GalvezPalacio`](https://github.com/GalvezPalacio)) como proyecto personal y académico del Ciclo DAM.
Si deseas usar este código o contribuir, por favor respeta los términos de la licencia.

---

## 📄 Licencia

Este proyecto será publicado bajo la licencia **MIT**. Puedes copiar, modificar y usar el código siempre que menciones al autor original.  
Consulta el archivo [`LICENSE`](LICENSE) (pendiente de añadir) para más detalles.

> ⚠️ **Este código no debe ser reutilizado sin atribución. Si lo usas, da crédito.**

---
