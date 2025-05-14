/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class PartidaServicio {

    private final PartidaRepositorio partidaRepositorio;
    private final JugadorRepositorio jugadorRepositorio;
    private final PropiedadRepositorio propiedadRepositorio;

    @Autowired
    private EntityManager entityManager;

    public PartidaServicio(PartidaRepositorio partidaRepositorio,
            JugadorRepositorio jugadorRepositorio,
            PropiedadRepositorio propiedadRepositorio) {
        this.partidaRepositorio = partidaRepositorio;
        this.jugadorRepositorio = jugadorRepositorio;
        this.propiedadRepositorio = propiedadRepositorio;
    }

    @Transactional
    public void finalizarPartida(Long id) {
        Optional<Partida> optionalPartida = partidaRepositorio.findById(id);
        if (optionalPartida.isEmpty()) {
            throw new EntityNotFoundException("Partida no encontrada con id: " + id);
        }

        Partida partida = optionalPartida.get();

        // Si está guardada, solo marcar como finalizada
        if (partida.isGuardada()) {
            partida.setEnProgreso(false);
            partidaRepositorio.save(partida);
            return;
        }

        // Si no está guardada, limpiar propiedades y borrar todo
        List<Propiedad> propiedades = propiedadRepositorio.findByPartida_Id(id);
        for (Propiedad p : propiedades) {
            p.setDueno(null);
            p.setCasas(0);
            p.setHotel(false);
            p.setPartida(null);
        }

        propiedadRepositorio.saveAll(propiedades);
        entityManager.flush();
        entityManager.clear();

        jugadorRepositorio.deleteByPartidaId(id);
        partidaRepositorio.deleteById(id);
    }
}
