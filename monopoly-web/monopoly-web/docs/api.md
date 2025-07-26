# API – Endpoints principales

Esta sección documenta los endpoints REST disponibles en el backend del juego Monopoly. Todos los endpoints están bajo el dominio:

http://localhost:8080/


> Las rutas pueden estar protegidas por roles según el tipo de usuario (jugador o administrador).

---

## 🎮 Jugadores

### `GET /jugadores/partida/{idPartida}`
Obtiene la lista de jugadores que participan en una partida.

### `POST /jugadores`
Crea un nuevo jugador y lo asocia a una partida.

**Body (JSON):**
```json
{
  "nombre": "Jugador 1",
  "partidaId": 1
}

```

## 🧠 Partidas

### `POST /partidas`  
Crea una nueva partida y devuelve su ID.

---

### `DELETE /partidas/finalizar/{idPartida}`  
Finaliza una partida. Si no está guardada, se elimina junto con sus datos.

---

### `PUT /partidas/guardar/{idPartida}`  
Marca una partida como “guardada” para que no se borre al finalizar.

## 🏠 Propiedades

### `GET /propiedades/partida/{idPartida}`  
Devuelve las propiedades dinámicas de la partida (`PropiedadPartida`).

---

### `PUT /propiedades/construir-casa/{idPropiedadPartida}`  
Construye una casa en la propiedad indicada (si cumple condiciones).

---

### `PUT /propiedades/construir-hotel/{idPropiedadPartida}`  
Construye un hotel si la propiedad tiene 4 casas y cumple condiciones.

## 🃏 Tarjetas (Suerte / Comunidad)

### `GET /tarjetas/robar/{tipo}`  
Roba una tarjeta aleatoria del tipo indicado (`suerte` o `comunidad`).

---

### `POST /tarjetas/aplicar`  
Aplica el efecto de la tarjeta robada sobre un jugador.

**Body (JSON):**
```json
{
  "idJugador": 1,
  "idTarjeta": 3
}

```

## 🎲 Juego

### `POST /juego/tirar-dado/{idJugador}`  
Genera una tirada de dados, actualiza la posición del jugador y devuelve la nueva casilla.

> Para más detalles sobre las estructuras y relaciones internas, consulta `modelo-datos.md`.
