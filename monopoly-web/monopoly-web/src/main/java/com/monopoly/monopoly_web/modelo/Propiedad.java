/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author gabri
 */
@Entity
public class Propiedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private int precio;
    private int posicion;

    private String grupoColor; // ej: Marrón, Azul, Verde...
    private int casas = 0;
    private boolean hotel = false;
    private String tipo;

    private String fondo;
    private int hipoteca;
    private int costeCasa;
    private int costeHotel;

    @ElementCollection
    @CollectionTable(name = "alquileres", joinColumns = @JoinColumn(name = "propiedad_id"))
    @MapKeyColumn(name = "tipo")
    @Column(name = "cantidad")
    private Map<String, Integer> alquiler = new HashMap<>();

    @ManyToOne
    @JoinColumn(name = "jugador_id")
    @JsonBackReference
    private Jugador dueno;

    @ManyToOne
    @JoinColumn(name = "partida_id")
    @JsonBackReference
    private Partida partida;

    public Partida getPartida() {
        return partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
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

    public int getPrecio() {
        return precio;
    }

    public void setPrecio(int precio) {
        this.precio = precio;
    }

    public Jugador getDueno() {
        return dueno;
    }

    public void setDueno(Jugador dueno) {
        this.dueno = dueno;
    }

    public int getPosicion() {
        return posicion;
    }

    public void setPosicion(int posicion) {
        this.posicion = posicion;
    }

    public String getGrupoColor() {
        return grupoColor;
    }

    public void setGrupoColor(String grupoColor) {
        this.grupoColor = grupoColor;
    }

    public int getCasas() {
        return casas;
    }

    public void setCasas(int casas) {
        this.casas = casas;
    }

    public boolean isHotel() {
        return hotel;
    }

    public void setHotel(boolean hotel) {
        this.hotel = hotel;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFondo() {
        return fondo;
    }

    public void setFondo(String fondo) {
        this.fondo = fondo;
    }

    public int getHipoteca() {
        return hipoteca;
    }

    public void setHipoteca(int hipoteca) {
        this.hipoteca = hipoteca;
    }

    public int getCosteCasa() {
        return costeCasa;
    }

    public void setCosteCasa(int costeCasa) {
        this.costeCasa = costeCasa;
    }

    public int getCosteHotel() {
        return costeHotel;
    }

    public void setCosteHotel(int costeHotel) {
        this.costeHotel = costeHotel;
    }

    public Map<String, Integer> getAlquiler() {
        return alquiler;
    }

    public void setAlquiler(Map<String, Integer> alquiler) {
        this.alquiler = alquiler;
    }
    

}
