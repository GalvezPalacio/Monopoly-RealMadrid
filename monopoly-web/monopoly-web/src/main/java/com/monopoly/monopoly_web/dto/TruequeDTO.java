/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.dto;

import java.util.List;

/**
 *
 * @author gabri
 */
public class TruequeDTO {

    private Long jugadorOfertanteId;
    private Long jugadorReceptorId;

    private List<Long> propiedadesOfrecidas; // IDs de propiedades del ofertante
    private boolean ofreceTarjetaSalirCarcel;
    private int dineroOfrecido;

    private List<Long> propiedadesPedidas; // IDs de propiedades del receptor
    private boolean pideTarjetaSalirCarcel;
    private int dineroPedido;
    
    // Getters y Setters

    public Long getJugadorOfertanteId() {
        return jugadorOfertanteId;
    }

    public void setJugadorOfertanteId(Long jugadorOfertanteId) {
        this.jugadorOfertanteId = jugadorOfertanteId;
    }

    public Long getJugadorReceptorId() {
        return jugadorReceptorId;
    }

    public void setJugadorReceptorId(Long jugadorReceptorId) {
        this.jugadorReceptorId = jugadorReceptorId;
    }

    public List<Long> getPropiedadesOfrecidas() {
        return propiedadesOfrecidas;
    }

    public void setPropiedadesOfrecidas(List<Long> propiedadesOfrecidas) {
        this.propiedadesOfrecidas = propiedadesOfrecidas;
    }

    public boolean isOfreceTarjetaSalirCarcel() {
        return ofreceTarjetaSalirCarcel;
    }

    public void setOfreceTarjetaSalirCarcel(boolean ofreceTarjetaSalirCarcel) {
        this.ofreceTarjetaSalirCarcel = ofreceTarjetaSalirCarcel;
    }

    public int getDineroOfrecido() {
        return dineroOfrecido;
    }

    public void setDineroOfrecido(int dineroOfrecido) {
        this.dineroOfrecido = dineroOfrecido;
    }

    public List<Long> getPropiedadesPedidas() {
        return propiedadesPedidas;
    }

    public void setPropiedadesPedidas(List<Long> propiedadesPedidas) {
        this.propiedadesPedidas = propiedadesPedidas;
    }

    public boolean isPideTarjetaSalirCarcel() {
        return pideTarjetaSalirCarcel;
    }

    public void setPideTarjetaSalirCarcel(boolean pideTarjetaSalirCarcel) {
        this.pideTarjetaSalirCarcel = pideTarjetaSalirCarcel;
    }

    public int getDineroPedido() {
        return dineroPedido;
    }

    public void setDineroPedido(int dineroPedido) {
        this.dineroPedido = dineroPedido;
    }
    
}
