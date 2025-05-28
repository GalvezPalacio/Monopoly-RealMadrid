/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio.util;

/**
 *
 * @author gabri
 */
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class GeneradorMensajesSuerte {

    private static final List<String> mensajesPositivos = new ArrayList<>();
    private static final List<String> mensajesNegativos = new ArrayList<>();
    private static final Random random = new Random();

    static {
        // Mensajes positivos (ganas dinero)
        mensajesPositivos.add("💰 Has vendido camisetas de Bellingham. Ganas 200€.");
        mensajesPositivos.add("👮 Te libras de pagar impuestos la proxima vez que caigas. Disfruta tu inmunidad.");
        mensajesPositivos.add("🚂 Avanza hasta “Estación de Chamartín”. Si está libre, puedes comprarla.");
        mensajesPositivos.add("🏟️ Entradas revendidas en el Bernabéu. Ganas 250€.");
        mensajesPositivos.add("📺 Has firmado un contrato con Real Madrid TV. Ganas 120€.");
        mensajesPositivos.add("⚽ Ganas una apuesta por gol de Modrić. Ganas 80€.");
        mensajesPositivos.add("🧣 Vendiste bufandas en el Clásico. Ganas 180€.");
        mensajesPositivos.add("🏆 Te reparten parte del premio de la Champions. Ganas 300€.");
        mensajesPositivos.add("🛍️ Abres una tienda oficial en Chamartín. Ganas 200€.");
        mensajesPositivos.add("🎁 Sal de la cárcel gratis. Guarda esta tarjeta.");

        // Mensajes negativos (pierdes dinero)
        mensajesNegativos.add("🚑 Bellingham se lesiona. Pierdes 150€ en médicos.");
        mensajesNegativos.add("📉 Inviertes mal en NFTs del Madrid. Pierdes 200€.");
        mensajesNegativos.add("🥶 Te colaste en un palco sin entrada. Pierdes 100€.");
        mensajesNegativos.add("⚖️ Pierdes una demanda de marca. Pierdes 120€.");
        mensajesNegativos.add("💸 Compras entradas falsas del Clásico. Pierdes 180€.");
        mensajesNegativos.add("🏴‍☠️ Has comprado una camiseta pirata. Pierdes 90€.");
        mensajesNegativos.add("🎮 Pierdes un torneo de FIFA contra un culé. Pierdes 70€.");
        mensajesNegativos.add("🏃‍♂️ Te pasaste la puerta por la que entras al Bernabeu!!! Retrocede 3 casillas.");
        mensajesNegativos.add("🔁 Pierdes un turno animando en la grada fan. ¡Hala Madrid!");
        mensajesNegativos.add("🚔 Te han pillado haciendo reventa de entradas en los aledaños del bernabeu Ve directamente a la cárcel. No pases por la salida.");
    }

    public static String obtenerMensajeAleatorio(boolean positivo) {
        List<String> lista = positivo ? mensajesPositivos : mensajesNegativos;
        return lista.get(random.nextInt(lista.size()));
    }

    public static String obtenerMensajeAleatorio() {
        boolean positivo = random.nextBoolean();
        return obtenerMensajeAleatorio(positivo);
    }
}
