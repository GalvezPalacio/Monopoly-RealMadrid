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

        // No permitir duplicados
        if (truequesPendientes.containsKey(ofertanteId)) {
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

        // Guardar propuesta
        truequesPendientes.put(ofertanteId, dto);
    }

    public TruequeDTO obtenerSiEsPara(Long receptorId) {
        return truequesPendientes.values().stream()
                .filter(t -> t.getJugadorReceptorId().equals(receptorId))
                .findFirst()
                .orElse(null);
    }

    public void borrarSiEsDe(Long ofertanteId) {
        truequesPendientes.remove(ofertanteId);
    }
}
