/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import com.monopoly.monopoly_web.servicio.PropiedadPartidaServicio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/jugadores")
public class JugadorControlador {

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Autowired
    private PartidaRepositorio partidaRepositorio;

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;

    @Autowired
    private PropiedadPartidaServicio propiedadPartidaServicio;

    @GetMapping
    public List<Jugador> obtenerTodos() {
        return jugadorRepositorio.findAll();
    }

    @PostMapping
    public Jugador crearJugador(@RequestBody Map<String, Object> datos) {
        String nombre = (String) datos.get("nombre");
        String ficha = (String) datos.get("ficha");
        Object partidaObj = datos.get("partidaId");
        if (partidaObj == null) {
            throw new IllegalArgumentException("El campo 'partidaId' es obligatorio.");
        }
        Long partidaId = Long.valueOf(partidaObj.toString());

        Partida partida = partidaRepositorio.findById(partidaId)
                .orElseThrow(() -> new RuntimeException("Partida no encontrada"));

        Jugador jugador = new Jugador();
        jugador.setNombre(nombre);
        jugador.setFicha(ficha);
        jugador.setPartida(partida);

        // Valores por defecto
        jugador.setDinero(1500);
        jugador.setTurno(false);
        jugador.setPosicion(0);
        jugador.setEnCarcel(false);

        return jugadorRepositorio.save(jugador);
    }

    @PostMapping("/{id}/tirar")
    public String tirarDado(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (!jugador.isTurno()) {
            return "No es tu turno. Espera al siguiente.";
        }

        int dado = (int) (Math.random() * 6) + 1;
        int posicionActual = jugador.getPosicion();
        int nuevaPosicion = (posicionActual + dado) % 40;

        String mensajeExtra = "";

        if (posicionActual + dado >= 40) {
            jugador.setDinero(jugador.getDinero() + 200);
            mensajeExtra = "Has pasado por la casilla de salida. ¡Cobras 200€!\n";
        }

        jugador.setPosicion(nuevaPosicion);

        if (nuevaPosicion == 30) {
            jugador.setPosicion(10);
            jugador.setEnCarcel(true);
            jugador.setTurno(false);
            pasarTurnoAlSiguiente(jugador.getId());
            jugadorRepositorio.save(jugador);
            return mensajeExtra + "Has caído en 'Ir a la cárcel'. Vas directo a la casilla 10.";
        }

        if (nuevaPosicion == 4 || nuevaPosicion == 38) {
            jugador.setDinero(jugador.getDinero() - 100);
            mensajeExtra += "Has pagado 100€ en impuestos.\n";
        }

        if (nuevaPosicion == 2 || nuevaPosicion == 17 || nuevaPosicion == 33) {
            mensajeExtra += "Has caído en 'Caja de Comunidad'. Roba una carta.\n";
            mensajeExtra += com.monopoly.monopoly_web.servicio.util.GeneradorMensajesComunidad.obtenerMensajeAleatorio() + "\n";
        }

        if (nuevaPosicion == 7 || nuevaPosicion == 22 || nuevaPosicion == 36) {
            mensajeExtra += "Has caído en 'Suerte'. Roba una carta.\n";
            mensajeExtra += com.monopoly.monopoly_web.servicio.util.GeneradorMensajesSuerte.obtenerMensajeAleatorio() + "\n";
        }

        if (nuevaPosicion == 20) {
            mensajeExtra += "Estás descansando en el Parking gratuito.\n";
        }

        if (nuevaPosicion == 0) {
            mensajeExtra += "Has caído en la casilla de salida.\n";
        }

        if (nuevaPosicion == 10 && !jugador.isEnCarcel()) {
            mensajeExtra += "Estás de visita en la cárcel.\n";
        }

        Propiedad propiedad = propiedadRepositorio.findByPosicion(nuevaPosicion);
        if (propiedad != null) {
            if (propiedad.getDueno() == null) {
                mensajeExtra += "Cayó en " + propiedad.getNombre() + ". Puede comprarla por " + propiedad.getPrecio() + "€.";
            } else if (!propiedad.getDueno().getId().equals(jugador.getId())) {
                Map<String, Integer> alquileres = propiedad.getAlquiler();
                int alquiler = alquileres.getOrDefault("base", 0);
                jugador.setDinero(jugador.getDinero() - alquiler);
                Jugador dueno = propiedad.getDueno();
                dueno.setDinero(dueno.getDinero() + alquiler);
                jugadorRepositorio.save(dueno);
                mensajeExtra += "Cayó en " + propiedad.getNombre() + " y ha pagado " + alquiler + "€ al jugador " + dueno.getNombre() + ".";
            } else {
                mensajeExtra += "Cayó en " + propiedad.getNombre() + ", que ya es suya.";
            }
        }

        jugadorRepositorio.save(jugador);

        return mensajeExtra;
    }

//    @PostMapping("/{id}/comprar")
//    public String comprarPropiedad(@PathVariable Long id) {
//        Jugador jugador = jugadorRepositorio.findById(id)
//                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
//
//        int posicionActual = jugador.getPosicion();
//        Propiedad propiedad = propiedadRepositorio.findByPosicion(posicionActual);
//
//        if (propiedad == null) {
//            return "No hay ninguna propiedad en esta casilla.";
//        }
//
//        if (propiedad.getDueno() != null) {
//            return "Esta propiedad ya tiene dueño.";
//        }
//
//        if (jugador.getDinero() < propiedad.getPrecio()) {
//            return "No tienes suficiente dinero para comprar esta propiedad.";
//        }
//
//        jugador.setDinero(jugador.getDinero() - propiedad.getPrecio());
//        propiedad.setDueno(jugador);
//        propiedad.setPartida(jugador.getPartida()); // ✅ esta línea es clave
//
//        jugadorRepositorio.save(jugador);
//        propiedadRepositorio.save(propiedad);
//
//        return "Has comprado " + propiedad.getNombre() + " por " + propiedad.getPrecio() + "€.";
//    }
    @Transactional
    private void pasarTurnoAlSiguiente(Long idActual) {
        List<Jugador> jugadores = jugadorRepositorio.findAll();
        jugadores.sort(Comparator.comparingLong(Jugador::getId));

        for (int i = 0; i < jugadores.size(); i++) {
            if (jugadores.get(i).getId().equals(idActual)) {
                int siguiente = (i + 1) % jugadores.size();
                Jugador siguienteJugador = jugadores.get(siguiente);
                siguienteJugador.setTurno(true);
                jugadorRepositorio.save(siguienteJugador);
                break;
            }
        }
    }

//    @PostMapping("/{jugadorId}/construir-grupo")
//    public String construirGrupo(
//            @PathVariable Long jugadorId,
//            @RequestParam String grupoColor,
//            @RequestParam int cantidad) {
//        return propiedadPartidaServicio.construirGrupo(jugadorId, grupoColor, cantidad);
//    }
//
//    @PostMapping("/{jugadorId}/construir-hotel")
//    public String construirHotel(
//            @PathVariable Long jugadorId,
//            @RequestParam String grupoColor) {
//        return propiedadPartidaServicio.construirHotel(jugadorId, grupoColor);
//    }
//
//    @PostMapping("/{jugadorId}/construir-casa")
//    public String construirCasaEnPropiedad(
//            @PathVariable Long jugadorId,
//            @RequestParam Long propiedadId) {
//        return propiedadPartidaServicio.construirCasaEnPropiedad(jugadorId, propiedadId);
//    }
//
//    @PostMapping("/{jugadorId}/construir-hotel-propiedad")
//    public String construirHotelEnPropiedad(
//            @PathVariable Long jugadorId,
//            @RequestParam Long propiedadId) {
//        return propiedadPartidaServicio.construirHotelEnPropiedad(jugadorId, propiedadId);
//    }
    @GetMapping("/{jugadorId}/mis-propiedades")
    public List<Propiedad> obtenerPropiedadesJugador(@PathVariable Long jugadorId) {
        return propiedadRepositorio.findAll().stream()
                .filter(p -> p.getDueno() != null && p.getDueno().getId().equals(jugadorId))
                .toList();
    }

    @GetMapping("/grupo")
    public List<Propiedad> obtenerPropiedadesPorGrupo(@RequestParam String grupoColor) {
        return propiedadRepositorio.findAll().stream()
                .filter(p -> grupoColor.equalsIgnoreCase(p.getGrupoColor()))
                .toList();
    }

    @GetMapping("/{jugadorId}")
    public Jugador obtenerJugador(@PathVariable Long jugadorId) {
        return jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
    }

    @GetMapping("/por-partida")
    public List<Jugador> obtenerPorPartida(@RequestParam Long partidaId) {
        return jugadorRepositorio.findByPartidaId(partidaId);
    }

    @PostMapping("/establecer-turno-inicial")
    public String establecerTurnoInicial(@RequestParam Long jugadorId, @RequestParam Long partidaId) {
        List<Jugador> jugadores = jugadorRepositorio.findByPartidaId(partidaId);

        for (Jugador jugador : jugadores) {
            jugador.setTurno(jugador.getId().equals(jugadorId));
            jugadorRepositorio.save(jugador);
        }

        return "Turno inicial asignado al jugador con ID " + jugadorId + " en la partida " + partidaId;
    }

    @PostMapping("/{id}/terminar-turno")
    public void terminarTurno(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        jugador.setTurno(false);
        jugadorRepositorio.save(jugador);

        Long partidaId = jugador.getPartida().getId();

        // Obtener jugadores de la misma partida
        List<Jugador> jugadores = jugadorRepositorio.findByPartidaId(partidaId);
        jugadores.sort(Comparator.comparing(Jugador::getId)); // Asegura orden

        // Buscar índice actual
        int actualIndex = -1;
        for (int i = 0; i < jugadores.size(); i++) {
            if (jugadores.get(i).getId().equals(id)) {
                actualIndex = i;
                break;
            }
        }

        // Calcular el siguiente jugador
        int siguienteIndex = (actualIndex + 1) % jugadores.size();
        Jugador siguiente = jugadores.get(siguienteIndex);
        siguiente.setTurno(true);
        jugadorRepositorio.save(siguiente);
    }

//    @GetMapping("/partida/{partidaId}/posicion/{posicion}")
//    public ResponseEntity<PropiedadPartida> obtenerPorPartidaYPosicion(@PathVariable Long partidaId, @PathVariable int posicion) {
//        Partida partida = partidaRepositorio.findById(partidaId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida no encontrada"));
//
//        Propiedad propiedad = propiedadRepositorio.findByPosicion(posicion);
//        if (propiedad == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propiedad no encontrada en esa posición");
//        }
//
//        return propiedadPartidaServicio.obtenerPorPartidaYPropiedad(partida, propiedad)
//                .map(ResponseEntity::ok)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PropiedadPartida no encontrada"));
//    }
}
