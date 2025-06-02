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
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.modelo.Tarjeta;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import com.monopoly.monopoly_web.servicio.util.GeneradorMensajesComunidad;
import com.monopoly.monopoly_web.servicio.util.GeneradorMensajesSuerte;
import java.text.Normalizer;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TarjetaServicio {

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;

    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

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
            int nuevaPosicion = jugador.getPosicion() - casillas;
            if (nuevaPosicion < 0) {
                nuevaPosicion += 40; // tablero de 40 casillas (0 a 39)
            }
            jugador.setPosicion(nuevaPosicion);
            return "🔙 Retrocedes " + casillas + " casillas.";
        }

        if (mensaje.contains("Avanza a")) {
            String destino = extraerDestinoPorNombre(mensaje);
            int posicionDestino = buscarPosicionPorNombre(destino);
            if (posicionDestino != -1) {
                int posicionInicial = jugador.getPosicion();

                if (posicionDestino < posicionInicial) {
                    jugador.setDinero(jugador.getDinero() + 200); // pasar por salida
                }

                jugador.setPosicion(posicionDestino);
                return "🚀 Avanzas a " + destino + (posicionDestino < posicionInicial ? " y cobras 200€ por pasar por la salida." : ".");
            } else {
                return "⚠️ No se encontró la casilla destino: " + destino;
            }
        }

        if (mensaje.contains("Vas a la grada") || mensaje.contains("Ve directamente a la cárcel")) {
            jugador.setPosicion(10); // cárcel
            tarjeta.setPierdeTurno(true);
            return "🚨 Has sido enviado a la grada. Pierdes el turno.";
        }

        if (mensaje.contains("Pierdes un turno")) {
            tarjeta.setPierdeTurno(true);
            return "⛔ Pierdes un turno.";
        }

        if (mensaje.toLowerCase().contains("recibes una propiedad aleatoria")) {
            Long partidaId = jugador.getPartida().getId();
            System.out.println("🧩 ID de la partida del jugador: " + partidaId);

            List<PropiedadPartida> sinDueno = propiedadPartidaRepositorio
                    .findByPartidaIdAndDuenoIsNull(partidaId);

            System.out.println("🔍 Número de propiedades sin dueño encontradas: " + sinDueno.size());

            for (PropiedadPartida p : sinDueno) {
                System.out.println("➡️ Propiedad sin dueño - ID: " + p.getId()
                        + ", Propiedad ID: " + p.getPropiedad().getId()
                        + ", Nombre: " + p.getPropiedad().getNombre());
            }

            if (!sinDueno.isEmpty()) {
                PropiedadPartida propiedad = sinDueno.get(new Random().nextInt(sinDueno.size()));
                propiedad.setDueno(jugador);
                propiedadPartidaRepositorio.save(propiedad);
                return "🎁 Te han adjudicado " + propiedad.getPropiedad().getNombre()
                        + " [ID:" + propiedad.getPropiedad().getId() + "]";
            } else {
                System.out.println("⚠️ Lista vacía: no hay propiedades sin dueño.");
                return "⚠️ No quedan propiedades sin dueño.";
            }
        }

        return "ℹ️ La tarjeta no tiene efecto automático.";
    }

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

    private String extraerDestinoPorNombre(String mensaje) {
        int indice = mensaje.indexOf("Avanza a");
        if (indice != -1) {
            return mensaje.substring(indice + 9).trim();
        }
        return "";
    }

    private int buscarPosicionPorNombre(String mensaje) {
        // Normalizar mensaje: quitar tildes, comillas, pasar a minúsculas
        String normalizadoMensaje = Normalizer.normalize(mensaje, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[“”\"']", "") // quitar comillas raras
                .replaceAll("[^a-z0-9áéíóúüñ ]", ""); // eliminar signos de puntuación

        List<Propiedad> propiedades = propiedadRepositorio.findAll();
        for (Propiedad propiedad : propiedades) {
            String normalizadoNombre = Normalizer.normalize(propiedad.getNombre(), Normalizer.Form.NFD)
                    .replaceAll("\\p{M}", "")
                    .toLowerCase()
                    .replaceAll("[^a-z0-9áéíóúüñ ]", "");

            if (normalizadoMensaje.contains(normalizadoNombre)) {
                return propiedad.getPosicion();
            }
        }

        return -1;
    }
}
