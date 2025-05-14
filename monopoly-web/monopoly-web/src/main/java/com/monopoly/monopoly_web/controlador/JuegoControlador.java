/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.servicio.JuegoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/juego")
public class JuegoControlador {

    @Autowired
    private JuegoServicio juegoServicio;

    @PostMapping("/reiniciar")
    public String reiniciarJuego() {
        return juegoServicio.reiniciarJuego();
    }
}
