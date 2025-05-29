/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.dto;

/**
 *
 * @author gabri
 */
public class DatosTarjeta {

    private String mensaje;
    private Long jugadorId;

    public DatosTarjeta() {
    }

    public DatosTarjeta(String mensaje, Long jugadorId) {
        this.mensaje = mensaje;
        this.jugadorId = jugadorId;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public Long getJugadorId() {
        return jugadorId;
    }

    public void setJugadorId(Long jugadorId) {
        this.jugadorId = jugadorId;
    }
}
