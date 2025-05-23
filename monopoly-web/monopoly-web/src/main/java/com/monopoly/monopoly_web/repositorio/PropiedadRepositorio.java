/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.monopoly.monopoly_web.repositorio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Propiedad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropiedadRepositorio extends JpaRepository<Propiedad, Long> {

    List<Propiedad> findByGrupoColor(String grupoColor);

    Propiedad findByPosicion(int posicion);

    long countByGrupoColor(String grupoColor);

    List<Propiedad> findByDuenoId(Long duenoId);

    List<Propiedad> findByPartida_Id(Long partidaId);
}
