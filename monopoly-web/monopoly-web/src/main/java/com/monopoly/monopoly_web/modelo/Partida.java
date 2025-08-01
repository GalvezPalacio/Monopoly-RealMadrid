/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.dto.VentaPendienteDTO;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private LocalDateTime fechaInicio;

    private boolean enProgreso;

    @Column(nullable = false)
    private boolean guardada = false; // Por defecto no guardada

    private int ultimaTiradaDado1;
    private int ultimaTiradaDado2;

    @Embedded
    private VentaPendienteDTO ventaPendiente;

    // Constructor vacío
    public Partida() {
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public boolean isEnProgreso() {
        return enProgreso;
    }

    public void setEnProgreso(boolean enProgreso) {
        this.enProgreso = enProgreso;
    }

    public boolean isGuardada() {
        return guardada;
    }

    public void setGuardada(boolean guardada) {
        this.guardada = guardada;
    }

    public int getUltimaTiradaDado1() {
        return ultimaTiradaDado1;
    }

    public void setUltimaTiradaDado1(int ultimaTiradaDado1) {
        this.ultimaTiradaDado1 = ultimaTiradaDado1;
    }

    public int getUltimaTiradaDado2() {
        return ultimaTiradaDado2;
    }

    public void setUltimaTiradaDado2(int ultimaTiradaDado2) {
        this.ultimaTiradaDado2 = ultimaTiradaDado2;
    }

    public VentaPendienteDTO getVentaPendiente() {
        return ventaPendiente;
    }

    public void setVentaPendiente(VentaPendienteDTO ventaPendiente) {
        this.ventaPendiente = ventaPendiente;
    }

}
