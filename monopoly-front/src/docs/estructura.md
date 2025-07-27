
# 🧱 Estructura del Proyecto Frontend

Este apartado describe cómo está organizado el proyecto del frontend del Monopoly temático del Real Madrid, implementado con React + Vite.

La estructura sigue buenas prácticas para mantener el código ordenado, modular y escalable.

## 📂 Estructura de Carpetas

```bash
monopoly-front/
├── public/               # Archivos públicos accesibles desde el navegador (imágenes del tablero, fichas, etc.)
│   └── tablero-monopoly.jpg
├── src/
│   ├── componentes/      # Componentes React reutilizables y personalizados (tarjetas, paneles, tablero, etc.)
│   │   ├── TarjetaPropiedad.jsx
│   │   ├── PanelJugador.jsx
│   │   ├── TableroConFondo.jsx
│   │   └── ...
│   ├── datos/            # Archivos de configuración o datos estáticos como info de casillas
│   │   └── casillasInfo.js
│   ├── pages/            # Páginas principales de la app (Inicio, Partida, etc.)
│   │   ├── Inicio.jsx
│   │   ├── Partida.jsx
│   │   └── ...
│   ├── App.jsx           # Componente principal que gestiona rutas y lógica global
│   ├── main.jsx          # Punto de entrada de la aplicación
│   └── index.css         # Estilos base, tailwind y personalizados
├── .gitignore
├── index.html            # HTML base de la aplicación
├── package.json          # Dependencias y scripts
└── vite.config.js        # Configuración específica de Vite
```

## 🧩 Lógica Modular

El proyecto está diseñado en módulos visuales y funcionales. Cada componente representa una parte del tablero o una funcionalidad concreta (ficha, panel lateral, tarjetas, etc.), facilitando la lectura y mantenimiento del código.

## 🎨 Diseño Visual

Se utiliza Tailwind CSS junto a estilos personalizados para crear un aspecto moderno, limpio y temático. El tablero se construye con CSS Grid sobre una imagen de fondo y los elementos interactivos se posicionan con coordenadas absolutas y `grid-area`.

## 🧪 Desarrollo y Pruebas

Durante el desarrollo, se utiliza Vite para tener recarga rápida, y Git para control de versiones. El proyecto puede visualizarse en local abriendo terminal y poniendo:

```bash
npm install
npm run dev
```

---

> Esta estructura modular permite una fácil ampliación del juego (subastas, animaciones, nuevas reglas...) manteniendo un código limpio y bien documentado.
