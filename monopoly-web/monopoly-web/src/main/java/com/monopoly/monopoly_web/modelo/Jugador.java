/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

/**
 *
 * @author gabri
 */
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Jugador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private int posicion;
    private int dinero = 1500;
    private boolean enCarcel;
    private boolean turno = false;
    private String ficha;

    @OneToMany(mappedBy = "dueno", fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Propiedad> propiedades;

    @ManyToOne
    @JoinColumn(name = "partida_id")
    private Partida partida;

    @Column(name = "turnos_en_carcel")
    private int turnosEnCarcel = 0;

    @Column(name = "tiene_tarjeta_salir_carcel")
    private boolean tieneTarjetaSalirCarcel = false;;

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

    public int getPosicion() {
        return posicion;
    }

    public void setPosicion(int posicion) {
        this.posicion = posicion;
    }

    public int getDinero() {
        return dinero;
    }

    public void setDinero(int dinero) {
        this.dinero = dinero;
    }

    public boolean isEnCarcel() {
        return enCarcel;
    }

    public void setEnCarcel(boolean enCarcel) {
        this.enCarcel = enCarcel;
    }

    public List<Propiedad> getPropiedades() {
        return propiedades;
    }

    public void setPropiedades(List<Propiedad> propiedades) {
        this.propiedades = propiedades;
    }

    public boolean isTurno() {
        return turno;
    }

    public void setTurno(boolean turno) {
        this.turno = turno;
    }

    public String getFicha() {
        return ficha;
    }

    public void setFicha(String ficha) {
        this.ficha = ficha;
    }

    public Partida getPartida() {
        return partida;
    }

    public void setPartida(Partida partida) {
        this.partida = partida;
    }

    public int getTurnosEnCarcel() {
        return turnosEnCarcel;
    }

    public void setTurnosEnCarcel(int turnosEnCarcel) {
        this.turnosEnCarcel = turnosEnCarcel;
    }

    public boolean isTieneTarjetaSalirCarcel() {
        return tieneTarjetaSalirCarcel;
    }

    public void setTieneTarjetaSalirCarcel(boolean tieneTarjetaSalirCarcel) {
        this.tieneTarjetaSalirCarcel = tieneTarjetaSalirCarcel;
    }
    

}
