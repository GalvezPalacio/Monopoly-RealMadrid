# Anexos

En esta sección se incluyen materiales complementarios que han sido relevantes durante el desarrollo del proyecto. Estos anexos aportan contexto adicional, referencias y elementos visuales útiles para entender el proceso y el resultado final.

---

## 📌 Capturas de pantalla del proyecto

A continuación se listan las capturas más relevantes del funcionamiento de la aplicación:


- Página de inicio mostrando las opciones principales.
- Formulario de creación de jugadores y selección de fichas personalizadas.
- Tablero interactivo con fondo personalizado del Real Madrid.
- Movimiento de fichas y visualización del nombre de la casilla.
- Tarjetas dinámicas al caer en propiedades (con diseño tipo Monopoly).
- Tarjetas emergentes de Suerte y Comunidad.
- Ventana emergente con opciones al caer en una casilla.
- Mensajes visuales durante el turno (inicio, dado, acciones).
- Funcionalidades adicionales: construir casas y hoteles, pagar alquiler, guardar o finalizar partida.

*(Nota: las imágenes se pueden incluir directamente en este documento con sintaxis Markdown o bien adjuntarlas en una carpeta `img/` referenciada desde aquí).*

---

## 📦 Recursos y herramientas utilizadas

- Spring Boot 3.3.11
- MySQL Workbench
- NetBeans IDE
- Visual Studio Code
- React + Vite
- GitHub

---

## 📁 Estructura de carpetas del repositorio

```
/backend/
├── src/
│   └── main/
│       └── java/com/monopoly/monopoly_web/
│           ├── config/
│           ├── controlador/
│           ├── dto/
│           ├── modelo/
│           ├── repositorio/
│           └── servicio/
└── resources/

/frontend/
├── public/
├── src/
│   ├── componentes/
│   ├── estilos/
│   ├── vistas/
│   └── App.jsx
```

---

## 🧠 Notas personales

Durante el desarrollo del proyecto se han ido recogiendo aprendizajes y decisiones que han ayudado a mejorar el diseño y la funcionalidad. Algunos ejemplos:

- Separar la lógica dinámica de propiedades mediante una entidad `PropiedadPartida` para soportar múltiples partidas.
- Migrar el diseño de casillas al uso de `gridArea` para replicar la disposición real del tablero.
- Implementar tarjetas de acción con efectos personalizados y estilo visual atractivo.

---

## 📚 Fuentes y recursos consultados

- Documentación oficial de Spring Boot
- API de React y Vite
- GitHub y foros técnicos como Stack Overflow
- Diseño visual basado en el Monopoly clásico de Hasbro
