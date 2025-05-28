/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Tarjeta;
import com.monopoly.monopoly_web.servicio.util.GeneradorMensajesComunidad;
import com.monopoly.monopoly_web.servicio.util.GeneradorMensajesSuerte;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class TarjetaServicio {

    public Tarjeta obtenerTarjetaAleatoria(String tipo) {
        String mensaje;

        if ("suerte".equalsIgnoreCase(tipo)) {
            mensaje = GeneradorMensajesSuerte.obtenerMensajeAleatorio();
        } else if ("comunidad".equalsIgnoreCase(tipo)) {
            mensaje = GeneradorMensajesComunidad.obtenerMensajeAleatorio();
        } else {
            throw new IllegalArgumentException("Tipo de tarjeta no válido: " + tipo);
        }

        Tarjeta tarjeta = new Tarjeta(tipo, mensaje);

        // Análisis del mensaje para funcionalidad
        if (mensaje.contains("Ganas")) {
            tarjeta.setCantidad(extraerCantidad(mensaje));
        } else if (mensaje.contains("Pierdes") || mensaje.contains("Multa")) {
            tarjeta.setCantidad(-extraerCantidad(mensaje));
        }

        if (mensaje.contains("Retrocede")) {
            tarjeta.setMover(-extraerMover(mensaje));
        } else if (mensaje.contains("Avanza")) {
            tarjeta.setMover(extraerMover(mensaje));
        }

        if (mensaje.contains("Ve directamente a la cárcel")) {
            tarjeta.setCarcel(true);
        }

        if (mensaje.contains("Pierdes un turno")) {
            tarjeta.setPierdeTurno(true);
        }

        if (mensaje.contains("Sal de la cárcel gratis")) {
            tarjeta.setSalirCarcel(true);
        }

        return tarjeta;
    }

    public String aplicarEfectoTarjeta(String mensaje, Jugador jugador, Tarjeta tarjeta) {

        if (mensaje.contains("Ganas")) {
            int cantidad = extraerCantidad(mensaje);
            jugador.setDinero(jugador.getDinero() + cantidad);
            return "💰 Has ganado " + cantidad + "€.";
        }

        if (mensaje.contains("Pierdes")) {
            int cantidad = extraerCantidad(mensaje);
            jugador.setDinero(jugador.getDinero() - cantidad);
            return "💸 Has perdido " + cantidad + "€.";
        }

        if (mensaje.contains("Retrocede")) {
            int casillas = extraerCantidad(mensaje);
            jugador.setPosicion(Math.max(0, jugador.getPosicion() - casillas));
            return "🔙 Retrocedes " + casillas + " casillas.";
        }

        if (mensaje.contains("Vas a la grada") || mensaje.contains("Ve directamente a la cárcel")) {
            jugador.setPosicion(10); // cárcel
            tarjeta.setPierdeTurno(true); // efecto opcional
            return "🚨 Has sido enviado a la grada. Pierdes el turno.";
        }

        if (mensaje.contains("Pierdes un turno")) {
            tarjeta.setPierdeTurno(true);
            return "⛔ Pierdes un turno.";
        }

        return "ℹ️ La tarjeta no tiene efecto automático.";
    }

    // 👇 Esta es la única versión que necesitas
    private int extraerCantidad(String mensaje) {
        Pattern pattern = Pattern.compile("(\\d+)[€]?");
        Matcher matcher = pattern.matcher(mensaje);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return 0;
    }

    private int extraerMover(String mensaje) {
        try {
            return Integer.parseInt(mensaje.replaceAll("[^\\d]", ""));
        } catch (Exception e) {
            return 0;
        }
    }
}
