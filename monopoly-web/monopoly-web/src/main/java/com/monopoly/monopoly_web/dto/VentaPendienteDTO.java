/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.dto;

/**
 *
 * @author gabri
 */
public class VentaPendienteDTO {

    private Long propiedadId;
    private Long vendedorId;
    private Long compradorId;
    private int cantidad;
    private String duenoNombre;
    private String propiedadNombre;

    // Getters y setters
    public Long getPropiedadId() {
        return propiedadId;
    }

    public void setPropiedadId(Long propiedadId) {
        this.propiedadId = propiedadId;
    }

    public Long getVendedorId() {
        return vendedorId;
    }

    public void setVendedorId(Long vendedorId) {
        this.vendedorId = vendedorId;
    }

    public Long getCompradorId() {
        return compradorId;
    }

    public void setCompradorId(Long compradorId) {
        this.compradorId = compradorId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getDuenoNombre() {
        return duenoNombre;
    }

    public void setDuenoNombre(String duenoNombre) {
        this.duenoNombre = duenoNombre;
    }

    public String getPropiedadNombre() {
        return propiedadNombre;
    }

    public void setPropiedadNombre(String propiedadNombre) {
        this.propiedadNombre = propiedadNombre;
    }
    
    
}
