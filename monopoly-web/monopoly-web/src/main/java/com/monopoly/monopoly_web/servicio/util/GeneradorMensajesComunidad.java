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

public class GeneradorMensajesComunidad {

    private static final List<String> mensajesPositivos = new ArrayList<>();
    private static final List<String> mensajesNegativos = new ArrayList<>();
    private static final Random random = new Random();

    static {
        // Positivos
        mensajesPositivos.add("🎓 Has ganado una beca de la Fundación Real Madrid. Ganas 100€.");
        mensajesPositivos.add("👕 Un aficionado rico compra toda tu colección de camisetas. Ganas 200€.");
        mensajesPositivos.add("📸 Te tomas una foto con Ancelotti. Te viralizas y Ganas 150€.");
        mensajesPositivos.add("👥 Puedes intercambiar una propiedad con otro jugador (si ambos están de acuerdo).");
        mensajesPositivos.add("🏅 El club te nombra 'socio del año'. Ganas Premio de 300€.");
        mensajesPositivos.add("📝 Participaste en una encuesta de socios. Ganas 90€.");
        mensajesPositivos.add("🧾 Recibes un vale de exención. En tu próxima multa, no pagas.");
        mensajesPositivos.add("💼 Trabajas en la tienda del Bernabéu. Ganas 110€.");
        mensajesPositivos.add("🎉 Avanza hasta “Palco VIP”. Disfruta del espectáculo.");
        mensajesPositivos.add("📖 Escribes un artículo sobre el Madrid y te lo publican. Ganas 130€.");

        // Negativos
        mensajesNegativos.add("🏫 Tu hijo entra en la escuela del Real Madrid. Pierdes matrícula: 150€.");
        mensajesNegativos.add("🚶‍♂️ Te mandan a “Vas a la grada”. Ve allí directamente.");
        mensajesNegativos.add("💸 Te roban fuera del estadio. Pierdes 100€.");
        mensajesNegativos.add("📉 Inviertes en cromos falsos de leyendas. Pierdes 200€.");
        mensajesNegativos.add("🔄 Devuelve una propiedad al banco (la que elijas si tienes y que no tenga construcción).");
        mensajesNegativos.add("🚗 Dejas el coche mal aparcado en Chamartín. Pierdes 80€.");
        mensajesNegativos.add("⚽ Fallas un penalti en la presentación de peñas. Pierdes 70€.");
        mensajesNegativos.add("⛔ Pierdes un turno por sanción del club. Mal comportamiento.");
        mensajesNegativos.add("🧾 Pagas cuota anual de socio. Pierdes 160€.");
        mensajesNegativos.add("🎆 Sanción por encender bengalas en el estadio. Pierdes 140€.");
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
