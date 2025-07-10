/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Alquiler;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
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
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

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
    public ResponseEntity<Map<String, Object>> tirarDado(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (!jugador.isTurno()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No es tu turno. Espera al siguiente."));
        }

        int dado1 = 4;
        int dado2 = 6;
        int suma = dado1 + dado2;

        Partida partida = jugador.getPartida();
        partida.setUltimaTiradaDado1(dado1);
        partida.setUltimaTiradaDado2(dado2);
        partidaRepositorio.save(partida); // ✅ importante

        if (dado1 == dado2) {
            jugador.setDoblesSeguidos(jugador.getDoblesSeguidos() + 1);
        } else {
            jugador.setDoblesSeguidos(0);
        }

        if (jugador.getDoblesSeguidos() >= 3) {
            jugador.setEnCarcel(true);
            jugador.setTurnosEnCarcel(0);
            jugador.setPosicion(10);
            jugador.setDoblesSeguidos(0);
            jugador.setTurno(false);
            jugadorRepositorio.save(jugador);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "🎲 Has sacado dobles 3 veces seguidas. Vas directo a la grada.",
                    "carcel", true
            ));
        }

        int posicionActual = jugador.getPosicion();
        int nuevaPosicion = (posicionActual + suma) % 40;
        boolean pasoPorSalida = (posicionActual + suma) >= 40;

        String mensajeExtra = "";

        if (pasoPorSalida) {
            jugador.setDinero(jugador.getDinero() + 200);
            mensajeExtra += "Has pasado por la casilla de salida. ¡Cobras 200€!\n";
        }

        jugador.setPosicion(nuevaPosicion);

        if (nuevaPosicion == 30) {
            return ResponseEntity.ok(Map.of("mensaje", "CARCEL_DIRECTA"));
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

        Long partidaId = jugador.getPartida().getId();
        Propiedad propiedad = propiedadRepositorio.findByPosicion(nuevaPosicion);

        if (propiedad != null) {
            Optional<PropiedadPartida> opt = propiedadPartidaRepositorio
                    .findByPartidaIdAndPropiedad_Id(partidaId, propiedad.getId());

            if (opt.isPresent()) {
                PropiedadPartida propiedadPartida = opt.get();
                Jugador dueno = propiedadPartida.getDueno();

                if (dueno != null && !dueno.getId().equals(jugador.getId()) && !propiedadPartida.isHipotecada()) {
                    int alquiler = propiedadPartidaServicio.calcularAlquiler(propiedadPartida, suma);
                    String detalleConstruccion = "";

                    String tipo = propiedadPartida.getPropiedad().getTipo();

                    if (tipo.equals("propiedad")) {
                        if (propiedadPartida.isHotel()) {
                            detalleConstruccion = " porque tiene un hotel";
                        } else if (propiedadPartida.getCasas() > 0) {
                            switch (propiedadPartida.getCasas()) {
                                case 1 ->
                                    detalleConstruccion = " porque tiene 1 casa";
                                case 2 ->
                                    detalleConstruccion = " porque tiene 2 casas";
                                case 3 ->
                                    detalleConstruccion = " porque tiene 3 casas";
                                case 4 ->
                                    detalleConstruccion = " porque tiene 4 casas";
                                default ->
                                    detalleConstruccion = " sin construcciones";
                            }
                        } else {
                            detalleConstruccion = " sin construcciones";
                        }
                    } else if (tipo.equals("estacion")) {
                        int numEstaciones = propiedadPartidaRepositorio.contarPorDuenoYTipo(dueno.getId(), partidaId, "estacion");
                        detalleConstruccion = " porque tiene " + numEstaciones + " estación" + (numEstaciones > 1 ? "es" : "");
                    } else if (tipo.equals("compania")) {
                        int numCompanias = propiedadPartidaRepositorio.contarPorDuenoYTipo(dueno.getId(), partidaId, "compania");
                        detalleConstruccion = " porque tiene " + numCompanias + " compañía" + (numCompanias > 1 ? "s" : "") + " y sacaste " + suma;
                    }

                    jugador.setDinero(jugador.getDinero() - alquiler);
                    dueno.setDinero(dueno.getDinero() + alquiler);

                    jugadorRepositorio.save(dueno);

                    mensajeExtra += "Has caído en " + propiedadPartida.getPropiedad().getNombre()
                            + ", propiedad de " + dueno.getNombre()
                            + ". Le pagas " + alquiler + "€" + detalleConstruccion + ".\n";
                }
            }
        }

        // 💾 Guardar SIEMPRE el jugador al final, incluso si no cae en propiedad
        jugadorRepositorio.save(jugador);

        if (dado1 == dado2) {
            mensajeExtra += "🎲 Has sacado dobles. Vuelves a tirar.";
        } /* else {
            jugador.setTurno(false);
            jugadorRepositorio.save(jugador);
            List<Jugador> jugadores = jugadorRepositorio.findByPartidaIdOrderById(partidaId);
            boolean siguiente = false;
            for (Jugador j : jugadores) {
                if (siguiente) {
                    j.setTurno(true);
                    jugadorRepositorio.save(j);
                    break;
                }
                if (j.getId().equals(jugador.getId())) {
                    siguiente = true;
                }
            }
            if (siguiente && jugadores.stream().noneMatch(Jugador::isTurno)) {
                jugadores.get(0).setTurno(true);
                jugadorRepositorio.save(jugadores.get(0));
            }
        } */

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("dado1", dado1);
        resultado.put("dado2", dado2);
        resultado.put("suma", suma);
        resultado.put("mensaje", "Has sacado un " + dado1 + " y un " + dado2 + ". Total: " + suma + ".\n" + mensajeExtra);

        return ResponseEntity.ok(resultado);
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
        Jugador jugadorActual = jugadorRepositorio.findById(idActual)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
        Long partidaId = jugadorActual.getPartida().getId();

        List<Jugador> jugadores = jugadorRepositorio.findByPartidaIdOrderById(partidaId);

        // Quitar turno a todos
        for (Jugador j : jugadores) {
            j.setTurno(false);
        }

        // Buscar índice del jugador actual
        int actualIndex = -1;
        for (int i = 0; i < jugadores.size(); i++) {
            if (jugadores.get(i).getId().equals(idActual)) {
                actualIndex = i;
                break;
            }
        }

        // Asignar turno al siguiente jugador
        int siguiente = (actualIndex + 1) % jugadores.size();
        Jugador jugadorSiguiente = jugadores.get(siguiente);

// 🔁 Saltar jugadores que pierden turno
        while (jugadorSiguiente.isPierdeTurno()) {
            jugadorSiguiente.setPierdeTurno(false); // quitar penalización
            siguiente = (siguiente + 1) % jugadores.size();
            jugadorSiguiente = jugadores.get(siguiente);
        }

// ✅ Asignar turno solo al jugador válido
        jugadorSiguiente.setTurno(true);

// 💾 Guardar todo
        jugadorRepositorio.saveAll(jugadores);
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
    public ResponseEntity<String> terminarTurno(@PathVariable Long id) {
        pasarTurnoAlSiguiente(id); // ✅ Llama al método bueno directamente
        return ResponseEntity.ok("Turno terminado correctamente.");
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
    @PostMapping("/{id}/enviarACarcel")
    public String enviarACarcel(@PathVariable Long id) {
        System.out.println("🔔 Llamada a enviarACarcel para jugador " + id);
        Jugador jugador = jugadorRepositorio.findById(id).get();
        jugador.setPosicion(10);
        jugador.setEnCarcel(true);
        jugador.setTurno(false);
        jugadorRepositorio.save(jugador);
        pasarTurnoAlSiguiente(jugador.getId());
        return "Has sido enviado a la grada. Turno del siguiente jugador.";
    }

    @PostMapping("/{id}/tirarDesdeCarcel")
    public ResponseEntity<Map<String, Object>> tirarDesdeCarcel(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (!jugador.isTurno() || !jugador.isEnCarcel()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "No puedes tirar desde la cárcel."));
        }

        int dado1 = (int) (Math.random() * 6) + 1;
        int dado2 = (int) (Math.random() * 6) + 1;
        int suma = dado1 + dado2;

        String mensaje = "Has sacado un " + dado1 + " y un " + dado2 + ". Total: " + suma + ".\n";

        if (dado1 == dado2) {
            jugador.setEnCarcel(false);
            jugador.setTurnosEnCarcel(0);
            int nuevaPos = (jugador.getPosicion() + suma) % 40;
            jugador.setPosicion(nuevaPos);
            // 👇 ¡NO quites el turno aquí!
            // jugador.setTurno(false);
            // pasarTurnoAlSiguiente(jugador.getId());

            jugadorRepositorio.save(jugador);

            mensaje += "🎉 Has sacado dobles y sales de la grada. Avanzas " + suma + " casillas.";

            return ResponseEntity.ok(Map.of(
                    "dado1", dado1,
                    "dado2", dado2,
                    "suma", suma,
                    "mensaje", mensaje,
                    "salio", true
            ));
        } else {
            // 😕 No saca dobles: acumular turnos
            int nuevosTurnos = jugador.getTurnosEnCarcel() + 1;
            jugador.setTurnosEnCarcel(nuevosTurnos);
            mensaje += "No has sacado dobles. Turnos encerrado: " + nuevosTurnos + ".\n";

            if (nuevosTurnos >= 3) {
                // 😤 Tercer turno → pagar, salir y mover
                jugador.setDinero(jugador.getDinero() - 50);
                jugador.setEnCarcel(false);
                jugador.setTurnosEnCarcel(0);
                int nuevaPos = (jugador.getPosicion() + suma) % 40;
                jugador.setPosicion(nuevaPos);
                jugador.setTurno(false);
                jugadorRepositorio.save(jugador);
                pasarTurnoAlSiguiente(jugador.getId());

                mensaje += "😤 Has cumplido 3 turnos. Pagas 50€ y sales. Avanzas " + suma + " casillas.";

                return ResponseEntity.ok(Map.of(
                        "dado1", dado1,
                        "dado2", dado2,
                        "suma", suma,
                        "mensaje", mensaje,
                        "salio", true
                ));
            } else {
                // 😐 Sigue en la cárcel, no se mueve
                jugador.setTurno(false);
                jugadorRepositorio.save(jugador);
                pasarTurnoAlSiguiente(jugador.getId());

                return ResponseEntity.ok(Map.of(
                        "dado1", dado1,
                        "dado2", dado2,
                        "suma", suma,
                        "mensaje", mensaje,
                        "salio", false
                ));
            }
        }
    }

    @PostMapping("/{id}/salirPagando")
    public ResponseEntity<Map<String, Object>> salirPagando(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (!jugador.isTurno() || !jugador.isEnCarcel()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "❌ No puedes usar esta opción ahora."));
        }

        if (jugador.getDinero() < 50) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "❌ No tienes suficiente dinero para pagar."));
        }

        jugador.setDinero(jugador.getDinero() - 50);
        jugador.setEnCarcel(false);
        jugador.setTurnosEnCarcel(0);
        jugadorRepositorio.save(jugador);

        return ResponseEntity.ok(Map.of(
                "mensaje", "💰 Has pagado 50€ para salir de la grada.",
                "salio", true
        ));
    }

    @PostMapping("/{id}/guardarTarjetaSalirCarcel")
    public ResponseEntity<String> guardarTarjetaSalirCarcel(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        jugador.setTieneTarjetaSalirCarcel(true);
        jugadorRepositorio.save(jugador);

        return ResponseEntity.ok("Tarjeta 'Salir de la cárcel' guardada.");
    }

    @PostMapping("/{id}/usarTarjetaSalirCarcel")
    public ResponseEntity<String> usarTarjetaSalirCarcel(@PathVariable Long id) {
        Jugador jugador = jugadorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        if (!jugador.isEnCarcel() || !jugador.isTieneTarjetaSalirCarcel()) {
            return ResponseEntity.badRequest().body("No estás en la cárcel o no tienes tarjeta.");
        }

        jugador.setEnCarcel(false);
        jugador.setTieneTarjetaSalirCarcel(false);
        jugador.setTurnosEnCarcel(0);
        jugadorRepositorio.save(jugador);

        return ResponseEntity.ok("Has usado tu tarjeta y salido de la cárcel.");
    }

    @PostMapping("/{jugadorId}/perder-turno")
    public ResponseEntity<String> perderTurno(@PathVariable Long jugadorId) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        jugador.setPierdeTurno(true);
        jugadorRepositorio.save(jugador);
        return ResponseEntity.ok("🔁 El jugador perderá su próximo turno.");
    }
}
