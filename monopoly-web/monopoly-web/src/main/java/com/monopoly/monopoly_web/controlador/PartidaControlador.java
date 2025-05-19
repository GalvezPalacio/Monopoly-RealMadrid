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
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import com.monopoly.monopoly_web.servicio.PartidaServicio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/partidas")
@CrossOrigin(origins = "http://localhost:5173") // ajusta si usas otro puerto para el frontend
public class PartidaControlador {

    @Autowired
    private PartidaRepositorio partidaRepositorio;

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;

    private final PartidaServicio partidaServicio;

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    @Autowired
    public PartidaControlador(PartidaServicio partidaServicio) {
        this.partidaServicio = partidaServicio;
    }

    // Crear nueva partida
    @PostMapping
public Partida crearPartida(@RequestBody Partida partida) {
    partida.setFechaInicio(LocalDateTime.now());
    partida.setEnProgreso(true);
    partida.setGuardada(false);
    Partida partidaGuardada = partidaRepositorio.save(partida);

    // Crear PropiedadPartida para cada propiedad base
    List<Propiedad> propiedadesBase = propiedadRepositorio.findAll();
    for (Propiedad propiedad : propiedadesBase) {
        if (propiedad.getTipo().equals("propiedad") ||
            propiedad.getTipo().equals("estacion") ||
            propiedad.getTipo().equals("compania")) {

            PropiedadPartida pp = new PropiedadPartida();
            pp.setPartida(partidaGuardada);
            pp.setPropiedad(propiedad);
            pp.setCasas(0);
            pp.setHotel(false);
            pp.setHipotecada(false);
            pp.setDueno(null);

            propiedadPartidaRepositorio.save(pp);
        }
    }

    return partidaGuardada;
}

    // Listar todas las partidas y verificar si hay una partida activa
    @GetMapping
    public ResponseEntity<PartidasResponse> listarPartidas() {
        List<Partida> partidas = partidaRepositorio.findAll();
        boolean hayPartidaActiva = partidas.stream().anyMatch(Partida::isEnProgreso);
        return ResponseEntity.ok().body(new PartidasResponse(partidas, hayPartidaActiva));
    }

    // Eliminar una partida por ID
    @DeleteMapping("/{id}")
    public void eliminarPartida(@PathVariable Long id) {
        partidaRepositorio.deleteById(id);
    }

    @DeleteMapping("/{id}/finalizar")
    public ResponseEntity<Void> finalizarPartida(@PathVariable Long id) {
        partidaServicio.finalizarPartida(id);
        return ResponseEntity.noContent().build();
    }

    // Clase de respuesta personalizada
    public static class PartidasResponse {

        private List<Partida> partidas;
        private boolean hayPartidaActiva;

        public PartidasResponse(List<Partida> partidas, boolean hayPartidaActiva) {
            this.partidas = partidas;
            this.hayPartidaActiva = hayPartidaActiva;
        }

        public List<Partida> getPartidas() {
            return partidas;
        }

        public void setPartidas(List<Partida> partidas) {
            this.partidas = partidas;
        }

        public boolean isHayPartidaActiva() {
            return hayPartidaActiva;
        }

        public void setHayPartidaActiva(boolean hayPartidaActiva) {
            this.hayPartidaActiva = hayPartidaActiva;
        }
    }

    @GetMapping("/{id}/jugadores")
    public ResponseEntity<List<Jugador>> obtenerJugadoresDePartida(@PathVariable Long id) {
        List<Jugador> jugadores = jugadorRepositorio.findByPartidaId(id);
        return ResponseEntity.ok(jugadores);
    }

    @GetMapping("/guardadas")
    public ResponseEntity<List<Partida>> obtenerPartidasGuardadas() {
        List<Partida> guardadas = partidaRepositorio.findByGuardadaTrue();
        return ResponseEntity.ok(guardadas);
    }

    @PatchMapping("/{id}/guardar")
    public ResponseEntity<Partida> guardarPartida(
            @PathVariable Long id,
            @RequestParam String nombre
    ) {
        Optional<Partida> partidaOpt = partidaRepositorio.findById(id);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Partida partida = partidaOpt.get();
        partida.setGuardada(true);
        partida.setNombre(nombre);
        partidaRepositorio.save(partida);
        return ResponseEntity.ok(partida);
    }

    // ✅ NUEVO: marcar partida como en progreso y no guardada al continuar
    @PatchMapping("/{id}/continuar")
    public ResponseEntity<String> continuarPartida(@PathVariable Long id) {
        Optional<Partida> partidaOpt = partidaRepositorio.findById(id);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Partida partida = partidaOpt.get();
        partida.setGuardada(false);     // ← dejar de estar guardada
        partida.setEnProgreso(true);    // ← seguir en progreso
        partidaRepositorio.save(partida);

        return ResponseEntity.ok("Partida marcada como no guardada y en progreso");
    }
}
