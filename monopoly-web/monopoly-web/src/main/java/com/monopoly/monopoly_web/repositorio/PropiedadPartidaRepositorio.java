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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PropiedadPartidaRepositorio extends JpaRepository<PropiedadPartida, Long> {

    List<PropiedadPartida> findByPartida(Partida partida);

    Optional<PropiedadPartida> findByPartidaAndPropiedad(Partida partida, Propiedad propiedad);

    List<PropiedadPartida> findByDuenoId(Long duenoId);

    Optional<PropiedadPartida> findByPartidaIdAndPropiedad_Id(Long partidaId, Long propiedadId);

    List<PropiedadPartida> findByDueno_Id(Long jugadorId);

    List<PropiedadPartida> findByPartidaIdAndDuenoIsNull(Long partidaId);

    @Query("SELECT COUNT(p) FROM PropiedadPartida p WHERE p.dueno.id = :duenoId AND p.partida.id = :partidaId AND p.propiedad.tipo = :tipo")
    int contarPorDuenoYTipo(
            @Param("duenoId") Long duenoId,
            @Param("partidaId") Long partidaId,
            @Param("tipo") String tipo
    );

    // 🔧 Método adicional para buscar por posición correctamente
    @Query("SELECT pp FROM PropiedadPartida pp WHERE pp.partida.id = :partidaId AND pp.propiedad.posicion = :posicion")
    Optional<PropiedadPartida> findByPartidaIdAndPropiedadPosicion(
            @Param("partidaId") Long partidaId,
            @Param("posicion") int posicion
    );
}
