/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.modelo;

/**
 *
 * @author gabri
 */
import java.util.Map;
import java.util.HashMap;

public class CostesConstruccion {

    public static final Map<String, Integer> COSTES_POR_COLOR = new HashMap<>();

    static {
        COSTES_POR_COLOR.put("MARRON", 50);
        COSTES_POR_COLOR.put("CELESTE", 50);
        COSTES_POR_COLOR.put("ROSA", 100);
        COSTES_POR_COLOR.put("NARANJA", 100);
        COSTES_POR_COLOR.put("ROJO", 150);
        COSTES_POR_COLOR.put("AMARILLO", 150);
        COSTES_POR_COLOR.put("VERDE", 200);
        COSTES_POR_COLOR.put("AZUL_OSCURO", 200);
    }

    public static int getCoste(String grupoColor) {
        return COSTES_POR_COLOR.getOrDefault(grupoColor.toUpperCase(), 100); // valor por defecto si hay error
    }
}
