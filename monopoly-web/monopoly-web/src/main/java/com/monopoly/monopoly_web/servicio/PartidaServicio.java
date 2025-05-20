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
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
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
    private final PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    @Autowired
    private EntityManager entityManager;

    public PartidaServicio(PartidaRepositorio partidaRepositorio,
            JugadorRepositorio jugadorRepositorio,
            PropiedadRepositorio propiedadRepositorio,
            PropiedadPartidaRepositorio propiedadPartidaRepositorio) {
        this.partidaRepositorio = partidaRepositorio;
        this.jugadorRepositorio = jugadorRepositorio;
        this.propiedadRepositorio = propiedadRepositorio;
        this.propiedadPartidaRepositorio = propiedadPartidaRepositorio;
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

        // ✅ Resetear propiedadesPartida antes de borrar (buena práctica)
        List<PropiedadPartida> propiedadesPartida = propiedadPartidaRepositorio.findByPartida(partida);
        for (PropiedadPartida pp : propiedadesPartida) {
            pp.setCasas(0);
            pp.setHotel(false);
            pp.setHipotecada(false);
            pp.setDueno(null);
        }
        propiedadPartidaRepositorio.saveAll(propiedadesPartida);
        entityManager.flush();
        entityManager.clear();

        // ✅ Luego borrar registros (ya reseteados)
        propiedadPartidaRepositorio.deleteAll(propiedadesPartida);

        // ✅ Borrar jugadores asociados a la partida
        jugadorRepositorio.deleteByPartidaId(id);

        // ✅ Borrar la propia partida
        partidaRepositorio.deleteById(id);
    }

}
