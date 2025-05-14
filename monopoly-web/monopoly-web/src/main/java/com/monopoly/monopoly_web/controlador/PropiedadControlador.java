/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/propiedades")
public class PropiedadControlador {

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;

    // Obtener todas las propiedades
    @GetMapping
    public List<Propiedad> obtenerTodas() {
        return propiedadRepositorio.findAll();
    }

    // Crear una nueva propiedad
    @PostMapping
    public Propiedad crearPropiedad(@RequestBody Propiedad propiedad) {
        return propiedadRepositorio.save(propiedad);
    }
}
