/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.dto;

import com.monopoly.monopoly_web.modelo.PropiedadPartida;

/**
 *
 * @author gabri
 */
public class PropiedadPartidaRespuestaDTO {
    private PropiedadPartida propiedadPartida;
    private int estacionesDelDueno;
    private int companiasDelDueno;
    private int sumaDados;
    private int alquilerCalculado;

    public PropiedadPartida getPropiedadPartida() {
        return propiedadPartida;
    }

    public void setPropiedadPartida(PropiedadPartida propiedadPartida) {
        this.propiedadPartida = propiedadPartida;
    }

    public int getEstacionesDelDueno() {
        return estacionesDelDueno;
    }

    public void setEstacionesDelDueno(int estacionesDelDueno) {
        this.estacionesDelDueno = estacionesDelDueno;
    }

    public int getCompaniasDelDueno() {
        return companiasDelDueno;
    }

    public void setCompaniasDelDueno(int companiasDelDueno) {
        this.companiasDelDueno = companiasDelDueno;
    }

    public int getSumaDados() {
        return sumaDados;
    }

    public void setSumaDados(int sumaDados) {
        this.sumaDados = sumaDados;
    }

    public int getAlquilerCalculado() {
        return alquilerCalculado;
    }

    public void setAlquilerCalculado(int alquilerCalculado) {
        this.alquilerCalculado = alquilerCalculado;
    }
}
