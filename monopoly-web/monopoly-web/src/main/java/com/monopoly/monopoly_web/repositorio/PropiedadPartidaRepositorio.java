/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.monopoly.monopoly_web.repositorio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PropiedadPartidaRepositorio extends JpaRepository<PropiedadPartida, Long> {

    List<PropiedadPartida> findByPartida(Partida partida);

    Optional<PropiedadPartida> findByPartidaAndPropiedad(Partida partida, Propiedad propiedad);

    List<PropiedadPartida> findByDuenoId(Long duenoId);

    Optional<PropiedadPartida> findByPartidaIdAndPropiedad_Id(Long partidaId, Long propiedadId);

    List<PropiedadPartida> findByDueno_Id(Long jugadorId);

    List<PropiedadPartida> findByPartidaIdAndDuenoIsNull(Long partidaId);

}
