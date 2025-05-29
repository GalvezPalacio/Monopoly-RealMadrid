/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

import com.monopoly.monopoly_web.dto.DatosTarjeta;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Tarjeta;
import com.monopoly.monopoly_web.servicio.TarjetaServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import org.springframework.web.bind.annotation.RequestBody;

/**
 *
 * @author gabri
 */
@RestController
@RequestMapping("/api/tarjetas")
public class TarjetaControlador {

    private final TarjetaServicio tarjetaServicio;

    private final JugadorRepositorio jugadorRepositorio;

    public TarjetaControlador(TarjetaServicio tarjetaServicio, JugadorRepositorio jugadorRepositorio) {
        this.tarjetaServicio = tarjetaServicio;
        this.jugadorRepositorio = jugadorRepositorio;
    }

    @GetMapping("/{tipo}")
    public Tarjeta obtenerTarjeta(@PathVariable String tipo) {
        return tarjetaServicio.obtenerTarjetaAleatoria(tipo);
    }

    @PostMapping("/aplicar")
    public ResponseEntity<String> aplicarEfecto(@RequestBody DatosTarjeta datos) {
        Jugador jugador = jugadorRepositorio.findById(datos.getJugadorId())
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        Tarjeta tarjeta = new Tarjeta("temporal", datos.getMensaje());

        String resultado = tarjetaServicio.aplicarEfectoTarjeta(datos.getMensaje(), jugador, tarjeta);
        jugadorRepositorio.save(jugador);

        return ResponseEntity.ok(resultado);
    }
}
