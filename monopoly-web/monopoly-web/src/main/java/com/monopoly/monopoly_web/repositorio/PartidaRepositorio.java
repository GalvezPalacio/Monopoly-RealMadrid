/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.repositorio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Partida;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidaRepositorio extends JpaRepository<Partida, Long> {

    List<Partida> findByGuardadaTrue();
}
