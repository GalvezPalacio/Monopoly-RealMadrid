/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

import com.monopoly.monopoly_web.dto.TruequeDTO;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author gabri
 */
@Service
public class TruequePendienteServicio {

    private final Map<Long, TruequeDTO> truequesPendientes = new ConcurrentHashMap<>();

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    public void guardar(TruequeDTO dto) {
        Long ofertanteId = dto.getJugadorOfertanteId();

        if (dto.getJugadorOfertanteId() == null || dto.getJugadorReceptorId() == null) {
            throw new IllegalStateException("Faltan datos del jugador.");
        }

        // No permitir duplicados
        if (truequesPendientes.values().stream()
                .anyMatch(t -> t.getJugadorOfertanteId().equals(dto.getJugadorOfertanteId()))) {
            throw new IllegalStateException("Ya existe una propuesta de trueque activa para este jugador.");
        }

        // Validar propiedades ofrecidas (tienen que ser del jugador y sin construcciones)
        for (Long propiedadId : dto.getPropiedadesOfrecidas()) {
            PropiedadPartida propiedad = propiedadPartidaRepositorio.findById(propiedadId)
                    .orElseThrow(() -> new RuntimeException("Propiedad ofrecida no encontrada."));

            if (!propiedad.getDueno().getId().equals(ofertanteId)) {
                throw new IllegalStateException("El jugador no es dueño de la propiedad ofrecida.");
            }

            if (propiedad.getCasas() > 0 || propiedad.isHotel()) {
                throw new IllegalStateException("No se puede ofrecer una propiedad con construcciones.");
            }
        }

        // Validar tarjeta salir de la cárcel
        if (dto.isOfreceTarjetaSalirCarcel()) {
            Jugador jugador = jugadorRepositorio.findById(ofertanteId)
                    .orElseThrow(() -> new RuntimeException("Jugador no encontrado."));

            if (!jugador.isTieneTarjetaSalirCarcel()) {
                throw new IllegalStateException("El jugador no tiene tarjeta de salir de la cárcel.");
            }
        }

        // Guardar nombre del ofertante para mostrarlo en la propuesta
        Jugador jugadorOfertante = jugadorRepositorio.findById(ofertanteId)
                .orElseThrow(() -> new RuntimeException("Jugador ofertante no encontrado."));
        dto.setJugadorOfertanteNombre(jugadorOfertante.getNombre());

        // Guardar propuesta
        truequesPendientes.put(dto.getJugadorReceptorId(), dto);
    }

    public TruequeDTO obtenerSiEsPara(Long receptorId) {
        return truequesPendientes.values().stream()
                .filter(t -> receptorId.equals(t.getJugadorReceptorId()))
                .findFirst()
                .orElse(null);
    }

    public void borrarSiEsDe(Long ofertanteId) {
        truequesPendientes.entrySet().removeIf(entry
                -> entry.getValue().getJugadorOfertanteId().equals(ofertanteId)
        );
    }

    @Transactional
    public void aceptarTrueque(Long receptorId) {
        // 1) Localizar la propuesta destinada a este receptor
        TruequeDTO dto = obtenerSiEsPara(receptorId);
        if (dto == null) {
            throw new IllegalStateException("No hay un trueque pendiente para este jugador.");
        }

        Long ofertanteId = dto.getJugadorOfertanteId();

        // 2) Cargar jugadores desde BD
        Jugador ofertante = jugadorRepositorio.findById(ofertanteId)
                .orElseThrow(() -> new RuntimeException("Jugador ofertante no encontrado."));
        Jugador receptor = jugadorRepositorio.findById(receptorId)
                .orElseThrow(() -> new RuntimeException("Jugador receptor no encontrado."));

        // 3) Normalizar listas
        List<Long> propsOfrecidas = dto.getPropiedadesOfrecidas() != null
                ? dto.getPropiedadesOfrecidas() : Collections.emptyList();
        List<Long> propsPedidas = dto.getPropiedadesPedidas() != null
                ? dto.getPropiedadesPedidas() : Collections.emptyList();

        // 4) Validaciones de dinero
        int dineroOfrecido = Math.max(0, dto.getDineroOfrecido());
        int dineroPedido = Math.max(0, dto.getDineroPedido());
        if (ofertante.getDinero() < dineroOfrecido) {
            throw new IllegalStateException("El ofertante no tiene suficiente dinero para el trueque.");
        }
        if (receptor.getDinero() < dineroPedido) {
            throw new IllegalStateException("El receptor no tiene suficiente dinero para el trueque.");
        }

        // 5) Validaciones de propiedades (dueño actual y sin construcciones)
        for (Long propId : propsOfrecidas) {
            PropiedadPartida p = propiedadPartidaRepositorio.findById(propId)
                    .orElseThrow(() -> new RuntimeException("Propiedad ofrecida no encontrada: " + propId));
            if (p.getDueno() == null || !p.getDueno().getId().equals(ofertanteId)) {
                throw new IllegalStateException("Alguna propiedad ofrecida ya no pertenece al ofertante.");
            }
            if (p.getCasas() > 0 || p.isHotel()) {
                throw new IllegalStateException("No se puede truequear una propiedad ofrecida con construcciones.");
            }
        }
        for (Long propId : propsPedidas) {
            PropiedadPartida p = propiedadPartidaRepositorio.findById(propId)
                    .orElseThrow(() -> new RuntimeException("Propiedad pedida no encontrada: " + propId));
            if (p.getDueno() == null || !p.getDueno().getId().equals(receptorId)) {
                throw new IllegalStateException("Alguna propiedad pedida ya no pertenece al receptor.");
            }
            if (p.getCasas() > 0 || p.isHotel()) {
                throw new IllegalStateException("No se puede truequear una propiedad pedida con construcciones.");
            }
        }

        // 6) Validaciones de tarjeta "Salir de la cárcel"
        if (dto.isOfreceTarjetaSalirCarcel() && !ofertante.isTieneTarjetaSalirCarcel()) {
            throw new IllegalStateException("El ofertante ya no tiene la tarjeta de salir de la cárcel.");
        }
        if (dto.isPideTarjetaSalirCarcel() && !receptor.isTieneTarjetaSalirCarcel()) {
            throw new IllegalStateException("El receptor ya no tiene la tarjeta de salir de la cárcel.");
        }

        // 7) Transferencias de propiedades
        for (Long propId : propsOfrecidas) {
            PropiedadPartida p = propiedadPartidaRepositorio.findById(propId).orElseThrow();
            p.setDueno(receptor);                     // ajusta el setter si tu entidad usa otro nombre
            propiedadPartidaRepositorio.save(p);
        }
        for (Long propId : propsPedidas) {
            PropiedadPartida p = propiedadPartidaRepositorio.findById(propId).orElseThrow();
            p.setDueno(ofertante);                    // ajusta el setter si tu entidad usa otro nombre
            propiedadPartidaRepositorio.save(p);
        }

        // 8) Transferencias de dinero
        ofertante.setDinero(ofertante.getDinero() - dineroOfrecido + dineroPedido);
        receptor.setDinero(receptor.getDinero() + dineroOfrecido - dineroPedido);

        // 9) Transferencia de tarjeta(s)
        if (dto.isOfreceTarjetaSalirCarcel()) {
            ofertante.setTieneTarjetaSalirCarcel(false);
            receptor.setTieneTarjetaSalirCarcel(true);
        }
        if (dto.isPideTarjetaSalirCarcel()) {
            receptor.setTieneTarjetaSalirCarcel(false);
            ofertante.setTieneTarjetaSalirCarcel(true);
        }

        // 10) Persistir jugadores
        jugadorRepositorio.save(ofertante);
        jugadorRepositorio.save(receptor);

        // 11) Borrar la propuesta pendiente
        borrarSiEsDe(ofertanteId);
    }

    public void limpiarTodo() {
        truequesPendientes.clear();
    }
}
