/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

import com.monopoly.monopoly_web.dto.HipotecaDTO;
import com.monopoly.monopoly_web.dto.PropiedadPartidaRespuestaDTO;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import com.monopoly.monopoly_web.servicio.PropiedadPartidaServicio;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author gabri
 */
@RestController
@RequestMapping("/api/propiedadPartida")
public class PropiedadPartidaControlador {

    @Autowired
    private PropiedadPartidaServicio propiedadPartidaServicio;

    @Autowired
    private PartidaRepositorio partidaRepositorio;

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    @GetMapping("/partida/{partidaId}/posicion/{posicion}")
    public ResponseEntity<PropiedadPartidaRespuestaDTO> obtenerPropiedadPartida(
            @PathVariable Long partidaId,
            @PathVariable int posicion) {

        Partida partida = partidaRepositorio.findById(partidaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partida no encontrada"));

        Propiedad propiedad = propiedadRepositorio.findByPosicion(posicion);
        if (propiedad == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Propiedad no encontrada en esa posición");
        }

        PropiedadPartida propiedadPartida = propiedadPartidaServicio.obtenerPorPartidaYPropiedad(partida, propiedad)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PropiedadPartida no encontrada"));

        // Creamos y rellenamos el DTO
        PropiedadPartidaRespuestaDTO dto = new PropiedadPartidaRespuestaDTO();
        dto.setPropiedadPartida(propiedadPartida);

        if (propiedadPartida.getDueno() != null) {
            Long duenoId = propiedadPartida.getDueno().getId();

            int estaciones = propiedadPartidaRepositorio.contarPorDuenoYTipo(duenoId, partidaId, "estacion");
            int companias = propiedadPartidaRepositorio.contarPorDuenoYTipo(duenoId, partidaId, "compania");
            int sumaDados = propiedadPartidaServicio.obtenerSumaDadosActual(partida);
            int alquilerCalculado = propiedadPartidaServicio.calcularAlquiler(propiedadPartida, sumaDados);

            dto.setEstacionesDelDueno(estaciones);
            dto.setCompaniasDelDueno(companias);
            dto.setSumaDados(sumaDados);
            dto.setAlquilerCalculado(alquilerCalculado);
        }

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/comprar")
    public ResponseEntity<String> comprarPropiedad(@RequestBody Map<String, Object> datos) {
        Long jugadorId = Long.valueOf(datos.get("jugadorId").toString());
        Long partidaId = Long.valueOf(datos.get("partidaId").toString());
        int casillaId = Integer.parseInt(datos.get("casillaId").toString());

        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        Partida partida = partidaRepositorio.findById(partidaId)
                .orElseThrow(() -> new RuntimeException("Partida no encontrada"));

        Propiedad propiedad = propiedadRepositorio.findByPosicion(casillaId);
        if (propiedad == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay propiedad en esta casilla.");
        }

        Optional<PropiedadPartida> opt = propiedadPartidaServicio.obtenerPorPartidaYPropiedad(partida, propiedad);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró propiedadPartida.");
        }

        PropiedadPartida propiedadPartida = opt.get();

        if (propiedadPartida.getDueno() != null) {
            return ResponseEntity.badRequest().body("Esta propiedad ya tiene dueño.");
        }

        if (jugador.getDinero() < propiedad.getPrecio()) {
            return ResponseEntity.badRequest().body("No tienes suficiente dinero para comprar esta propiedad.");
        }

        jugador.setDinero(jugador.getDinero() - propiedad.getPrecio());
        jugadorRepositorio.save(jugador);

        propiedadPartida.setDueno(jugador);
        propiedadPartidaRepositorio.save(propiedadPartida);

        return ResponseEntity.ok("Has comprado " + propiedad.getNombre() + " por " + propiedad.getPrecio() + "€.");
    }

    @PostMapping("/construir-casa")
    public String construirCasaEnPropiedad(@RequestBody Map<String, Object> datos) {
        Long jugadorId = Long.valueOf(datos.get("jugadorId").toString());
        Long propiedadId = Long.valueOf(datos.get("propiedadId").toString());

        return propiedadPartidaServicio.construirCasaEnPropiedad(jugadorId, propiedadId);
    }

    @PostMapping("/construir-hotel")
    public String construirHotelEnPropiedad(@RequestBody Map<String, Object> datos) {
        Long jugadorId = Long.valueOf(datos.get("jugadorId").toString());
        Long propiedadId = Long.valueOf(datos.get("propiedadId").toString());

        return propiedadPartidaServicio.construirHotelEnPropiedad(jugadorId, propiedadId);
    }

    @GetMapping("/opciones-construccion")
    public ResponseEntity<Map<String, List<String>>> obtenerOpcionesConstruccion(@RequestParam Long jugadorId) {
        Map<String, List<String>> opciones = propiedadPartidaServicio.obtenerOpcionesConstruccion(jugadorId);
        return ResponseEntity.ok(opciones);
    }

    @GetMapping("/del-jugador")
    public List<PropiedadPartida> obtenerPropiedadesDelJugador(@RequestParam Long jugadorId) {
        return propiedadPartidaRepositorio.findByDuenoId(jugadorId);
    }

    @PostMapping("/devolver")
    public ResponseEntity<String> devolverPropiedad(@RequestBody Map<String, Long> datos) {
        Long jugadorId = datos.get("jugadorId");
        Long propiedadId = datos.get("propiedadId");

        propiedadPartidaServicio.devolverPropiedad(jugadorId, propiedadId);
        return ResponseEntity.ok("Propiedad devuelta correctamente.");
    }

    @PostMapping("/hipotecar")
    public ResponseEntity<String> hipotecar(@RequestBody HipotecaDTO dto) {
        try {
            propiedadPartidaServicio.hipotecar(dto.getJugadorId(), dto.getPropiedadId());
            return ResponseEntity.ok("✅ Propiedad hipotecada con éxito.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }
}
