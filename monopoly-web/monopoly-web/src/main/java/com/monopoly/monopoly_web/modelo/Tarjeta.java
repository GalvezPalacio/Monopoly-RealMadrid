/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

/**
 *
 * @author gabri
 */
public class Tarjeta { 

    private String tipo;      // "suerte" o "comunidad"
    private String mensaje;   // Texto visible en el popup
    private int cantidad;     // Positivo o negativo, afecta dinero
    private int mover;        // Número de casillas a mover (puede ser negativo)
    private boolean carcel;   // Si debe ir a la cárcel
    private boolean pierdeTurno; // Si pierde un turno
    private boolean salirCarcel; // Si es carta de "salir de la cárcel"

    public Tarjeta(String tipo, String mensaje) {
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.cantidad = 0;
        this.mover = 0;
        this.carcel = false;
        this.pierdeTurno = false;
        this.salirCarcel = false;
    }

    // ✅ Setters para funcionalidad opcional
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public void setMover(int mover) {
        this.mover = mover;
    }

    public void setCarcel(boolean carcel) {
        this.carcel = carcel;
    }

    public void setPierdeTurno(boolean pierdeTurno) {
        this.pierdeTurno = pierdeTurno;
    }

    public void setSalirCarcel(boolean salirCarcel) {
        this.salirCarcel = salirCarcel;
    }

    // ✅ Getters
    public String getTipo() {
        return tipo;
    }

    public String getMensaje() {
        return mensaje;
    }

    public int getCantidad() {
        return cantidad;
    }

    public int getMover() {
        return mover;
    }

    public boolean isCarcel() {
        return carcel;
    }

    public boolean isPierdeTurno() {
        return pierdeTurno;
    }

    public boolean isSalirCarcel() {
        return salirCarcel;
    }
}
