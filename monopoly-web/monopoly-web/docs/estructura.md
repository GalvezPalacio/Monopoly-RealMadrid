# 🧱 Estructura del Proyecto

A continuación se documenta la estructura principal del proyecto `monopoly-web`, centrado en el desarrollo del backend con Java y Spring Boot. 
Esta organización está diseñada para mantener una arquitectura limpia, modular y fácil de escalar.

> ℹ️ **Nota**: Este backend forma parte de una aplicación completa desarrollada en paralelo con frontend en React (no incluido en este repositorio). 
La documentación se irá ampliando conforme avance el desarrollo.

---

## 📁 Raíz del proyecto

```bash
monopoly-web/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/monopoly/monopoly_web/
│   │   │       ├── config/           ← Configuraciones generales (seguridad, CORS, etc.)
│   │   │       ├── controlador/      ← Controladores REST (puntos de entrada de la API)
│   │   │       ├── dto/              ← Objetos de transferencia de datos (request/response)
│   │   │       ├── modelo/           ← Entidades JPA (tablas: jugador, propiedad, partida, etc.)
│   │   │       ├── repositorio/      ← Interfaces de acceso a base de datos (Spring Data JPA)
│   │   │       ├── servicio/         ← Interfaces de lógica de negocio
│   │   │       └── servicio.util/    ← Implementaciones de la lógica del juego
│   │   └── resources/                ← Archivos de configuración (application.properties)
│   └── test/                         ← Pruebas (pendiente de ampliar)
├── docs/                             ← Documentación profesional del proyecto
├── README.md                         ← Resumen general del proyecto y guía rápida
└── LICENSE                           ← Licencia del proyecto


## 🧩 Descripción de los paquetes principales

### 🗂️ `controlador/`
Contiene todos los controladores REST que definen los endpoints de la API.  
Desde aquí se gestionan acciones como crear jugadores, iniciar partida, lanzar dados, comprar propiedades, etc.

---

### 🗂️ `modelo/`
Define las entidades JPA que representan las tablas de la base de datos.  
Ejemplos de clases incluidas:

- `Jugador`: nombre, dinero, ficha, posición, etc.
- `Propiedad`: nombre, tipo, precio, color, etc.
- `Partida`: estado, turno actual, jugadores asociados.
- `PropiedadPartida`: relación entre propiedades y partida (dueño, casas, hipotecada, etc.)

---

### 🗂️ `servicio/` y `servicio.impl/`
Aquí se encuentra la lógica del juego.  
Por ejemplo: validaciones al construir casas, lógica de turnos, compra/venta de propiedades, ejecución de tarjetas, etc.

---

### 🗂️ `repositorio/`
Interfaces que extienden de `JpaRepository` y permiten acceder a la base de datos  
sin necesidad de escribir consultas SQL manuales.

---

### 🗂️ `dto/`
Modelos intermedios para transferir datos entre backend y frontend.  
Evitan exponer directamente las entidades JPA.

---

### 🗂️ `config/`
Contiene configuraciones globales como CORS, seguridad HTTP o beans necesarios  
para el correcto funcionamiento de la aplicación.

---

## 📦 Otras carpetas

### 🗂️ `resources/`
Contiene archivos como `application.properties` para la configuración del puerto,  
base de datos, seguridad y demás aspectos técnicos.

---

### 🗂️ `test/`
Pendiente de completar.  
Aquí se incluirán pruebas unitarias e integración para garantizar la estabilidad del backend.

---

### 🗂️ `docs/`
Carpeta dedicada a la documentación técnica y profesional.  
¡Estás leyendo uno de esos archivos! 😋

---

> 💡 **Este proyecto está en desarrollo activo.**  
> La estructura actual permite un mantenimiento ordenado y una evolución futura hacia funcionalidades más complejas como partidas simultáneas, 
estadísticas, ranking de jugadores o guardado automático.