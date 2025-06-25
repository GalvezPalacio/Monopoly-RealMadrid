/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 *
 * @author gabri
 */


    @Entity
    @Table(name = "alquileres")
    public class Alquiler {

        @Id
        @Column(name = "propiedad_id")
        private Long propiedadId;

        private String tipo; // 'propiedad' o 'estacion'

        private int base;
        private int casa1;
        private int casa2;
        private int casa3;
        private int casa4;
        private int hotel;

        // Getters y setters

    public Long getPropiedadId() {
        return propiedadId;
    }

    public void setPropiedadId(Long propiedadId) {
        this.propiedadId = propiedadId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getBase() {
        return base;
    }

    public void setBase(int base) {
        this.base = base;
    }

    public int getCasa1() {
        return casa1;
    }

    public void setCasa1(int casa1) {
        this.casa1 = casa1;
    }

    public int getCasa2() {
        return casa2;
    }

    public void setCasa2(int casa2) {
        this.casa2 = casa2;
    }

    public int getCasa3() {
        return casa3;
    }

    public void setCasa3(int casa3) {
        this.casa3 = casa3;
    }

    public int getCasa4() {
        return casa4;
    }

    public void setCasa4(int casa4) {
        this.casa4 = casa4;
    }

    public int getHotel() {
        return hotel;
    }

    public void setHotel(int hotel) {
        this.hotel = hotel;
    }
        
        
    }


