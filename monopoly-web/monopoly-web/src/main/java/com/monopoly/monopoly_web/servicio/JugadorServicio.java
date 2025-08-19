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
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JugadorServicio {

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Transactional
    public void pasarTurnoAlSiguiente(Long idActual) {
        Jugador jugadorActual = jugadorRepositorio.findById(idActual)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
        Long partidaId = jugadorActual.getPartida().getId();

        List<Jugador> jugadores = jugadorRepositorio.findByPartidaIdOrderById(partidaId);

        for (Jugador j : jugadores) {
            j.setTurno(false);
        }

        int actualIndex = -1;
        for (int i = 0; i < jugadores.size(); i++) {
            if (jugadores.get(i).getId().equals(idActual)) {
                actualIndex = i;
                break;
            }
        }

        int siguiente = (actualIndex + 1) % jugadores.size();
        Jugador jugadorSiguiente = jugadores.get(siguiente);

        while (jugadorSiguiente.isPierdeTurno()) {
            jugadorSiguiente.setPierdeTurno(false);
            siguiente = (siguiente + 1) % jugadores.size();
            jugadorSiguiente = jugadores.get(siguiente);
        }

        jugadorSiguiente.setTurno(true);
        jugadorRepositorio.saveAll(jugadores);
    }

    @Transactional
    public void pasarTurnoTrasEliminarJugador(Long partidaId) {
        List<Jugador> jugadores = jugadorRepositorio.findByPartidaIdOrderById(partidaId);
        if (jugadores.isEmpty()) {
            return;
        }

        // Buscar quién tiene turno actualmente (puede que nadie lo tenga si lo acabas de borrar)
        Jugador actualConTurno = jugadores.stream()
                .filter(Jugador::isTurno)
                .findFirst()
                .orElse(null);

        // Reiniciar todos los turnos por seguridad
        for (Jugador j : jugadores) {
            j.setTurno(false);
        }

        int siguienteIndex = 0;

        if (actualConTurno != null) {
            int index = jugadores.indexOf(actualConTurno);
            siguienteIndex = (index + 1) % jugadores.size();
        }

        Jugador siguienteJugador = jugadores.get(siguienteIndex);

        while (siguienteJugador.isPierdeTurno()) {
            siguienteJugador.setPierdeTurno(false);
            siguienteIndex = (siguienteIndex + 1) % jugadores.size();
            siguienteJugador = jugadores.get(siguienteIndex);
        }

        siguienteJugador.setTurno(true);
        jugadorRepositorio.saveAll(jugadores);
    }
}
