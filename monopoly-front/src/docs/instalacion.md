# Instalación y Puesta en Marcha del Frontend

Esta sección explica cómo instalar y ejecutar el frontend del proyecto Monopoly temático del Real Madrid.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js y npm](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/) (recomendado)
- Git (opcional pero útil)

Puedes comprobar si Node.js y npm están instalados ejecutando:

```bash
node -v
npm -v
```

## Pasos para la Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd nombre-del-proyecto-frontend
```

> Si estás trabajando en local sin GitHub, simplemente abre la carpeta del frontend en VS Code.

### 2. Instalar las dependencias

```bash
npm install
```

Esto descargará todas las dependencias necesarias definidas en `package.json`.

### 3. Ejecutar la aplicación

```bash
npm start
```

Este comando iniciará el servidor de desarrollo y abrirá automáticamente la aplicación en tu navegador, normalmente en `http://localhost:3000`.

## Estructura esperada tras instalar

```bash
├── node_modules/
├── public/
├── src/
│   ├── componentes/
│   ├── estilos/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Notas

- Si deseas cambiar el puerto por defecto, puedes modificar el archivo de configuración de Vite o usar variables de entorno.
- En caso de errores, asegúrate de que todas las dependencias estén instaladas correctamente y que no haya conflictos de versiones.
