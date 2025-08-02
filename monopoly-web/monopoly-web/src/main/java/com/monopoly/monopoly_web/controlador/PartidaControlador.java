/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.dto.TruequeDTO;
import com.monopoly.monopoly_web.dto.VentaPendienteDTO;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import com.monopoly.monopoly_web.servicio.PartidaServicio;
import com.monopoly.monopoly_web.servicio.PropiedadPartidaServicio;
import com.monopoly.monopoly_web.servicio.TruequePendienteServicio;
import com.monopoly.monopoly_web.servicio.VentaPendienteServicio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
    private VentaPendienteServicio ventaPendienteServicio;

    @Autowired
    private PropiedadPartidaServicio propiedadPartidaServicio;

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    @Autowired
    private TruequePendienteServicio truequePendienteServicio;

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
            if (propiedad.getTipo().equals("propiedad")
                    || propiedad.getTipo().equals("estacion")
                    || propiedad.getTipo().equals("compania")) {

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

    @PostMapping("/venta-pendiente")
    public ResponseEntity<?> guardarVentaPendiente(@RequestBody VentaPendienteDTO dto) {
        Jugador vendedor = jugadorRepositorio.findById(dto.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        PropiedadPartida propiedadPartida = propiedadPartidaRepositorio.findById(dto.getPropiedadId())
                .orElseThrow(() -> new RuntimeException("PropiedadPartida no encontrada"));

        Propiedad propiedad = propiedadPartida.getPropiedad();

        dto.setDuenoNombre(vendedor.getNombre());
        dto.setPropiedadNombre(propiedad.getNombre());

        if (propiedadPartidaServicio.grupoTieneConstrucciones(propiedadPartida)) {
            return ResponseEntity.badRequest().body("No puedes vender una propiedad si hay construcciones en ella o en su grupo.");
        }

        ventaPendienteServicio.guardar(dto);
        return ResponseEntity.ok("Propuesta enviada");
    }

    @GetMapping("/venta-pendiente/{compradorId}")
    public ResponseEntity<?> obtenerVentaPendiente(@PathVariable Long compradorId) {
        VentaPendienteDTO dto = ventaPendienteServicio.obtenerSiEsPara(compradorId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/venta-pendiente")
    public ResponseEntity<?> borrarVentaPendiente(@RequestBody Map<String, Long> body) {
        Long compradorId = body.get("compradorId");
        ventaPendienteServicio.borrarSiEsDeComprador(compradorId);
        return ResponseEntity.ok("Propuesta eliminada");
    }

    @PostMapping("/api/partidas/confirmar-venta")
    public ResponseEntity<?> confirmarVenta(@RequestBody Map<String, Long> payload) {
        Long idPartida = payload.get("idPartida");

        Optional<Partida> partidaOpt = partidaRepositorio.findById(idPartida);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Partida partida = partidaOpt.get();
        VentaPendienteDTO venta = partida.getVentaPendiente();

        if (venta == null) {
            return ResponseEntity.badRequest().body("No hay propuesta");
        }

        PropiedadPartida propiedad = propiedadPartidaRepositorio.findById(venta.getPropiedadId())
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

        Jugador comprador = jugadorRepositorio.findById(venta.getCompradorId())
                .orElseThrow(() -> new RuntimeException("Comprador no encontrado"));
        Jugador vendedor = jugadorRepositorio.findById(venta.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // Transferir propiedad y dinero
        propiedad.setDueno(comprador);
        comprador.setDinero(comprador.getDinero() - venta.getCantidad());
        vendedor.setDinero(vendedor.getDinero() + venta.getCantidad());

        // Limpiar venta pendiente
        partida.setVentaPendiente(null);

        // Guardar todo
        jugadorRepositorio.save(comprador);
        jugadorRepositorio.save(vendedor);
        propiedadPartidaRepositorio.save(propiedad);
        partidaRepositorio.save(partida);

        return ResponseEntity.ok("Venta realizada correctamente");
    }

    @DeleteMapping("/api/partidas/cancelar-venta/{id}")

    public ResponseEntity<?> cancelarVenta(@PathVariable Long id) {
        Optional<Partida> partidaOpt = partidaRepositorio.findById(id);
        if (partidaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Partida partida = partidaOpt.get();
        partida.setVentaPendiente(null);
        partidaRepositorio.save(partida);

        return ResponseEntity.ok("Propuesta cancelada");
    }

    @PostMapping("/trueque-pendiente")
    public ResponseEntity<?> guardarTrueque(@RequestBody TruequeDTO dto) {
        truequePendienteServicio.guardar(dto);
        return ResponseEntity.ok("Propuesta de trueque enviada");
    }

    @GetMapping("/trueque-pendiente/{receptorId}")
    public ResponseEntity<?> obtenerTrueque(@PathVariable Long receptorId) {
        TruequeDTO dto = truequePendienteServicio.obtenerSiEsPara(receptorId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/trueque-pendiente/{ofertanteId}")
    public ResponseEntity<?> borrarTrueque(@PathVariable Long ofertanteId) {
        truequePendienteServicio.borrarSiEsDe(ofertanteId);
        return ResponseEntity.ok("Propuesta de trueque eliminada");
    }
}
