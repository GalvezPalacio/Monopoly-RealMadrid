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
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropiedadPartidaServicio {

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    public List<PropiedadPartida> obtenerPorPartida(Partida partida) {
        return propiedadPartidaRepositorio.findByPartida(partida);
    }

    public Optional<PropiedadPartida> obtenerPorPartidaYPropiedad(Partida partida, Propiedad propiedad) {
        return propiedadPartidaRepositorio.findByPartidaAndPropiedad(partida, propiedad);
    }

    public PropiedadPartida guardar(PropiedadPartida propiedadPartida) {
        return propiedadPartidaRepositorio.save(propiedadPartida);
    }

    public void actualizarDueno(Partida partida, Propiedad propiedad, Jugador nuevoDueno) {
        Optional<PropiedadPartida> existente = obtenerPorPartidaYPropiedad(partida, propiedad);
        existente.ifPresent(pp -> {
            pp.setDueno(nuevoDueno);
            propiedadPartidaRepositorio.save(pp);
        });
    }

    // Puedes agregar más métodos según lo necesites (ej. construir casa, hipotecar, etc.)
}
