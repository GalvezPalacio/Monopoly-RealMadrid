/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.CostesConstruccion;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class JuegoServicio {

    private final JugadorRepositorio jugadorRepositorio;
    private final PropiedadRepositorio propiedadRepositorio;

    public JuegoServicio(JugadorRepositorio jugadorRepositorio, PropiedadRepositorio propiedadRepositorio) {
        this.jugadorRepositorio = jugadorRepositorio;
        this.propiedadRepositorio = propiedadRepositorio;
    }

    public String construirGrupo(Long jugadorId, String grupoColor, int cantidad) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        List<Propiedad> grupo = propiedadRepositorio.findAll().stream()
                .filter(p -> grupoColor.equalsIgnoreCase(p.getGrupoColor()))
                .toList();

        List<Propiedad> delJugador = grupo.stream()
                .filter(p -> p.getDueno() != null && p.getDueno().getId().equals(jugadorId))
                .toList();

        if (grupo.isEmpty()) {
            return "No existe el grupo de color '" + grupoColor + "'.";
        }

        if (delJugador.size() < grupo.size()) {
            return "No puedes construir en " + grupoColor + ". Aún no tienes todas las propiedades de ese grupo.";
        }

        int precioCasa = CostesConstruccion.getCoste(grupoColor);
        int casasRestantes = cantidad;
        int casasConstruidas = 0;

        delJugador = delJugador.stream()
                .sorted(Comparator.comparingInt(Propiedad::getCasas))
                .toList();

        while (casasRestantes > 0) {
            boolean casaConstruida = false;

            for (Propiedad p : delJugador) {
                if (p.getCasas() < 4 && !p.isHotel()) {
                    int maxCasas = delJugador.stream().mapToInt(Propiedad::getCasas).max().orElse(0);
                    if (p.getCasas() <= maxCasas) {
                        if (jugador.getDinero() < precioCasa) {
                            return "No tienes suficiente dinero para continuar construyendo.";
                        }

                        p.setCasas(p.getCasas() + 1);
                        jugador.setDinero(jugador.getDinero() - precioCasa);
                        casasRestantes--;
                        casasConstruidas++;
                        casaConstruida = true;

                        if (casasRestantes == 0) {
                            break;
                        }
                    }
                }
            }

            if (!casaConstruida) {
                break;
            }

            delJugador = delJugador.stream()
                    .sorted(Comparator.comparingInt(Propiedad::getCasas))
                    .toList();
        }

        if (casasRestantes > 0) {
            return "Solo se construyeron " + casasConstruidas + " casas. No se pudieron construir todas respetando la distribución uniforme.";
        }

        jugadorRepositorio.save(jugador);
        propiedadRepositorio.saveAll(delJugador);

        return "Construcción completada: " + casasConstruidas + " casas en el grupo " + grupoColor + ".";
    }

    public String construirHotel(Long jugadorId, String grupoColor) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        List<Propiedad> grupo = propiedadRepositorio.findAll().stream()
                .filter(p -> grupoColor.equalsIgnoreCase(p.getGrupoColor()))
                .toList();

        List<Propiedad> delJugador = grupo.stream()
                .filter(p -> p.getDueno() != null && p.getDueno().getId().equals(jugadorId))
                .toList();

        if (grupo.isEmpty()) {
            return "No existe el grupo de color '" + grupoColor + "'.";
        }

        if (delJugador.size() < grupo.size()) {
            return "No puedes construir hotel en " + grupoColor + ". No tienes todas las propiedades del grupo.";
        }

        boolean todasCon4Casas = delJugador.stream()
                .allMatch(p -> p.getCasas() == 4 && !p.isHotel());

        if (!todasCon4Casas) {
            return "Todas las propiedades deben tener 4 casas y no tener hotel para construir uno.";
        }

        int coste = CostesConstruccion.getCoste(grupoColor);
        if (jugador.getDinero() < coste) {
            return "No tienes suficiente dinero para construir el hotel. Necesitas " + coste + "€.";
        }

        Propiedad objetivo = delJugador.get(0);
        objetivo.setCasas(0);
        objetivo.setHotel(true);
        jugador.setDinero(jugador.getDinero() - coste);

        jugadorRepositorio.save(jugador);
        propiedadRepositorio.save(objetivo);

        return "Hotel construido en '" + objetivo.getNombre() + "' del grupo " + grupoColor + ".";
    }

    public String construirCasaEnPropiedad(Long jugadorId, Long propiedadId) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        Propiedad propiedadElegida = propiedadRepositorio.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

        if (propiedadElegida.getDueno() == null || !propiedadElegida.getDueno().getId().equals(jugadorId)) {
            return "No puedes construir en esta propiedad. No es tuya.";
        }

        String grupoColor = propiedadElegida.getGrupoColor();

        List<Propiedad> grupo = propiedadRepositorio.findAll().stream()
                .filter(p -> grupoColor.equalsIgnoreCase(p.getGrupoColor()))
                .toList();

        List<Propiedad> delJugador = grupo.stream()
                .filter(p -> p.getDueno() != null && p.getDueno().getId().equals(jugadorId))
                .toList();

        if (delJugador.size() < grupo.size()) {
            return "No puedes construir casas en este grupo. Aún no tienes todas las propiedades del color " + grupoColor + ".";
        }

        if (propiedadElegida.getCasas() >= 4 || propiedadElegida.isHotel()) {
            return "No se puede construir más en esta propiedad. Ya tiene 4 casas o un hotel.";
        }

        int casasActuales = propiedadElegida.getCasas();
        boolean rompeUniformidad = delJugador.stream()
                .anyMatch(p -> p.getCasas() < casasActuales);

        if (rompeUniformidad) {
            return "No puedes construir aquí todavía. Debes construir de forma uniforme en todas las propiedades del grupo.";
        }

        int coste = CostesConstruccion.getCoste(grupoColor);
        if (jugador.getDinero() < coste) {
            return "No tienes suficiente dinero para construir una casa en esta propiedad. Cuesta " + coste + "€.";
        }

        propiedadElegida.setCasas(casasActuales + 1);
        jugador.setDinero(jugador.getDinero() - coste);

        propiedadRepositorio.save(propiedadElegida);
        jugadorRepositorio.save(jugador);

        return "Casa construida en '" + propiedadElegida.getNombre() + "'. Ahora tiene " + propiedadElegida.getCasas() + " casas.";
    }

    public String construirHotelEnPropiedad(Long jugadorId, Long propiedadId) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        Propiedad propiedadElegida = propiedadRepositorio.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

        // Comprobar que la propiedad es del jugador
        if (propiedadElegida.getDueno() == null || !propiedadElegida.getDueno().getId().equals(jugadorId)) {
            return "No puedes construir hotel en esta propiedad. No es tuya.";
        }

        String grupoColor = propiedadElegida.getGrupoColor();

        // Obtener todo el grupo y filtrar propiedades del jugador
        List<Propiedad> grupo = propiedadRepositorio.findAll().stream()
                .filter(p -> grupoColor.equalsIgnoreCase(p.getGrupoColor()))
                .toList();

        List<Propiedad> delJugador = grupo.stream()
                .filter(p -> p.getDueno() != null && p.getDueno().getId().equals(jugadorId))
                .toList();

        if (delJugador.size() < grupo.size()) {
            return "No puedes construir hotel. No tienes todas las propiedades del grupo " + grupoColor + ".";
        }

        if (propiedadElegida.isHotel()) {
            return "Esta propiedad ya tiene un hotel.";
        }

        if (propiedadElegida.getCasas() != 4) {
            return "Solo puedes construir un hotel si la propiedad tiene exactamente 4 casas.";
        }

        boolean todasCon4Casas = delJugador.stream()
                .allMatch(p -> p.getCasas() == 4 || p.isHotel());

        if (!todasCon4Casas) {
            return "Todas las propiedades del grupo deben tener 4 casas para construir un hotel.";
        }

        int coste = CostesConstruccion.getCoste(grupoColor);
        if (jugador.getDinero() < coste) {
            return "No tienes suficiente dinero para construir el hotel. Cuesta " + coste + "€.";
        }

        propiedadElegida.setCasas(0);
        propiedadElegida.setHotel(true);
        jugador.setDinero(jugador.getDinero() - coste);

        propiedadRepositorio.save(propiedadElegida);
        jugadorRepositorio.save(jugador);

        return "Hotel construido con éxito en '" + propiedadElegida.getNombre() + "'.";
    }

    public String reiniciarJuego() {
        List<Propiedad> propiedades = propiedadRepositorio.findAll();
        for (Propiedad p : propiedades) {
            p.setCasas(0);
            p.setHotel(false);
            p.setDueno(null);
            propiedadRepositorio.save(p);
        }

        List<Jugador> jugadores = jugadorRepositorio.findAll();
        for (Jugador j : jugadores) {
            j.setDinero(1500); // o el valor inicial que uses
            j.setPosicion(0);
            j.setEnCarcel(false);
            jugadorRepositorio.save(j);
        }

        return "Juego reiniciado correctamente.";
    }
}
