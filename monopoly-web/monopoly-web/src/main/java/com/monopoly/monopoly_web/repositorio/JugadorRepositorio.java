/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.monopoly.monopoly_web.repositorio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Jugador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;
import java.util.List;

public interface JugadorRepositorio extends JpaRepository<Jugador, Long> {

    List<Jugador> findByPartidaId(Long partidaId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Jugador j WHERE j.partida.id = :partidaId")
    void deleteByPartidaId(Long partidaId);
}
