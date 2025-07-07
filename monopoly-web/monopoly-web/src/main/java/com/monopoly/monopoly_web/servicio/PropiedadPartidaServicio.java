/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.modelo.Alquiler;
import com.monopoly.monopoly_web.modelo.CostesConstruccion;
import com.monopoly.monopoly_web.modelo.Jugador;
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropiedadPartidaServicio {

    @Autowired
    private JugadorRepositorio jugadorRepositorio;

    @Autowired
    private PropiedadRepositorio propiedadRepositorio;
    @Autowired
    private PropiedadPartidaRepositorio propiedadPartidaRepositorio;

    public List<PropiedadPartida> obtenerPorPartida(Partida partida) {
        return propiedadPartidaRepositorio.findByPartida(partida);
    }

    public Optional<PropiedadPartida> obtenerPorPartidaYPropiedad(Partida partida, Propiedad propiedad) {
        return propiedadPartidaRepositorio.findByPartidaAndPropiedad(partida, propiedad);
    }

    public PropiedadPartida guardar(PropiedadPartida propiedadPartida) {
        return propiedadPartidaRepositorio.save(propiedadPartida);
    }

    public void actualizarDueno(Partida partida, Propiedad propiedad, Jugador nuevoDueno) {
        Optional<PropiedadPartida> existente = obtenerPorPartidaYPropiedad(partida, propiedad);
        existente.ifPresent(pp -> {
            pp.setDueno(nuevoDueno);
            propiedadPartidaRepositorio.save(pp);
        });
    }

    // Puedes agregar más métodos según lo necesites (ej. construir casa, hipotecar, etc.)
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

        PropiedadPartida propiedadPartida = propiedadPartidaRepositorio
                .findByPartidaIdAndPropiedad_Id(jugador.getPartida().getId(), propiedadId)
                .orElseThrow(() -> new RuntimeException("PropiedadPartida no encontrada"));

        if (propiedadPartida.getDueno() == null || !propiedadPartida.getDueno().getId().equals(jugadorId)) {
            return "No puedes construir en esta propiedad. No es tuya.";
        }

        String grupoColor = propiedadPartida.getPropiedad().getGrupoColor();

        List<PropiedadPartida> grupo = propiedadPartidaRepositorio.findByDueno_Id(jugadorId).stream()
                .filter(pp -> pp.getPropiedad().getGrupoColor().equalsIgnoreCase(grupoColor))
                .toList();

        long totalEnGrupo = propiedadRepositorio.countByGrupoColor(grupoColor);
        if (grupo.size() < totalEnGrupo) {
            return "No puedes construir casas en este grupo. Aún no tienes todas las propiedades del color " + grupoColor + ".";
        }

        if (propiedadPartida.getCasas() >= 4 || propiedadPartida.isHotel()) {
            return "No se puede construir más en esta propiedad. Ya tiene 4 casas o un hotel.";
        }

        int casasActuales = propiedadPartida.getCasas();
        boolean rompeUniformidad = grupo.stream()
                .anyMatch(p -> p.getCasas() < casasActuales);

        if (rompeUniformidad) {
            return "No puedes construir aquí todavía. Debes construir de forma uniforme en todas las propiedades del grupo.";
        }

        int coste = CostesConstruccion.getCoste(grupoColor);
        if (jugador.getDinero() < coste) {
            return "No tienes suficiente dinero para construir una casa. Cuesta " + coste + "€.";
        }

        propiedadPartida.setCasas(casasActuales + 1);
        jugador.setDinero(jugador.getDinero() - coste);

        propiedadPartidaRepositorio.save(propiedadPartida);
        jugadorRepositorio.save(jugador);

        return "Casa construida en '" + propiedadPartida.getPropiedad().getNombre()
                + "'. Ahora tiene " + propiedadPartida.getCasas() + " casas.";
    }

    public String construirHotelEnPropiedad(Long jugadorId, Long propiedadId) {
        Jugador jugador = jugadorRepositorio.findById(jugadorId)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        PropiedadPartida propiedadPartida = propiedadPartidaRepositorio
                .findByPartidaIdAndPropiedad_Id(jugador.getPartida().getId(), propiedadId)
                .orElseThrow(() -> new RuntimeException("PropiedadPartida no encontrada"));

        if (propiedadPartida.getDueno() == null || !propiedadPartida.getDueno().getId().equals(jugadorId)) {
            return "No puedes construir hotel en esta propiedad. No es tuya.";
        }

        String grupoColor = propiedadPartida.getPropiedad().getGrupoColor();

        List<PropiedadPartida> grupo = propiedadPartidaRepositorio.findByDueno_Id(jugadorId).stream()
                .filter(pp -> grupoColor.equalsIgnoreCase(pp.getPropiedad().getGrupoColor()))
                .toList();

        long totalEnGrupo = propiedadRepositorio.countByGrupoColor(grupoColor);
        if (grupo.size() < totalEnGrupo) {
            return "No puedes construir hotel. No tienes todas las propiedades del grupo " + grupoColor + ".";
        }

        if (propiedadPartida.isHotel()) {
            return "Esta propiedad ya tiene un hotel.";
        }

        if (propiedadPartida.getCasas() != 4) {
            return "Solo puedes construir un hotel si esta propiedad tiene exactamente 4 casas.";
        }

        boolean todasCon4Casas = grupo.stream()
                .allMatch(p -> p.getCasas() == 4 || p.isHotel());

        if (!todasCon4Casas) {
            return "Todas las propiedades del grupo deben tener 4 casas para construir un hotel.";
        }

        int coste = CostesConstruccion.getCoste(grupoColor);
        if (jugador.getDinero() < coste) {
            return "No tienes suficiente dinero para construir el hotel. Cuesta " + coste + "€.";
        }

        propiedadPartida.setCasas(0);
        propiedadPartida.setHotel(true);
        jugador.setDinero(jugador.getDinero() - coste);

        propiedadPartidaRepositorio.save(propiedadPartida);
        jugadorRepositorio.save(jugador);

        return "Hotel construido con éxito en '" + propiedadPartida.getPropiedad().getNombre() + "'.";
    }

    public Map<String, List<String>> obtenerOpcionesConstruccion(Long jugadorId) {
        List<PropiedadPartida> propiedadesJugador = propiedadPartidaRepositorio.findByDuenoId(jugadorId);

        // Agrupar por grupoColor
        Map<String, List<PropiedadPartida>> grupos = propiedadesJugador.stream()
                .filter(pp -> pp.getPropiedad() != null && pp.getPropiedad().getGrupoColor() != null)
                .collect(Collectors.groupingBy(pp -> pp.getPropiedad().getGrupoColor()));

        List<String> gruposConCasas = new ArrayList<>();
        List<String> gruposConHotel = new ArrayList<>();

        for (Map.Entry<String, List<PropiedadPartida>> entry : grupos.entrySet()) {
            String grupo = entry.getKey();
            List<PropiedadPartida> propiedadesGrupo = entry.getValue();

            // Verificar si el jugador tiene todas las propiedades del grupo
            long totalEnGrupo = propiedadRepositorio.countByGrupoColor(grupo);
            if (propiedadesGrupo.size() < totalEnGrupo) {
                continue;
            }

            boolean todasCon4Casas = propiedadesGrupo.stream().allMatch(p -> p.getCasas() == 4);
            boolean todasConHotel = propiedadesGrupo.stream().allMatch(PropiedadPartida::isHotel);
            boolean algunaConMenosDe4 = propiedadesGrupo.stream().anyMatch(p -> p.getCasas() < 4);
            boolean tiene4CasasYSinHotel = propiedadesGrupo.stream().allMatch(p -> p.getCasas() == 4 || p.isHotel());

            if (todasConHotel) {
                // Ya tiene todos los hoteles → no se muestra en ningún grupo
                continue;
            } else if (tiene4CasasYSinHotel) {
                // Tiene 4 casas o hotel en todas, pero aún falta al menos 1 hotel → se puede construir hotel
                gruposConHotel.add(grupo);
            } else if (algunaConMenosDe4) {
                // Aún hay casas por construir
                gruposConCasas.add(grupo);
            }
        }

        Map<String, List<String>> resultado = new HashMap<>();
        resultado.put("gruposConCasas", gruposConCasas);
        resultado.put("gruposConHotel", gruposConHotel);
        return resultado;
    }

    public void devolverPropiedad(Long jugadorId, Long propiedadId) {
        PropiedadPartida propiedad = propiedadPartidaRepositorio.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

        if (!jugadorId.equals(propiedad.getDueno().getId())) {
            throw new RuntimeException("Esa propiedad no es tuya");
        }

        propiedad.setDueno(null);
        propiedad.setCasas(0);
        propiedad.setHotel(false);
        propiedad.setHipotecada(false);

        propiedadPartidaRepositorio.save(propiedad);
    }

    public int obtenerSumaDadosActual(Partida partida) {
        return partida.getUltimaTiradaDado1() + partida.getUltimaTiradaDado2();
    }

    public int calcularAlquiler(PropiedadPartida propiedad, int sumaDados) {
        String tipo = propiedad.getPropiedad().getTipo();

        if (tipo.equals("compania")) {
            int num = propiedadPartidaRepositorio.contarPorDuenoYTipo(
                    propiedad.getDueno().getId(),
                    propiedad.getPartida().getId(),
                    "compania"
            );
            return sumaDados * (num == 2 ? 10 : 4);
        }

        if (tipo.equals("estacion")) {
            int num = propiedadPartidaRepositorio.contarPorDuenoYTipo(
                    propiedad.getDueno().getId(),
                    propiedad.getPartida().getId(),
                    "estacion"
            );
            switch (num) {
                case 2:
                    return 100;
                case 3:
                    return 200;
                case 4:
                    return 400;
                default:
                    return propiedad.getPropiedad().getAlquiler() != null
                            ? propiedad.getPropiedad().getAlquiler().getBase()
                            : 25;
            }
        }

        // tipo "propiedad"
        Alquiler alquiler = propiedad.getPropiedad().getAlquiler();
        if (alquiler == null) {
            return 0;
        }

        if (propiedad.isHotel()) {
            return alquiler.getHotel();
        }

        return switch (propiedad.getCasas()) {
            case 1 ->
                alquiler.getCasa1();
            case 2 ->
                alquiler.getCasa2();
            case 3 ->
                alquiler.getCasa3();
            case 4 ->
                alquiler.getCasa4();
            default ->
                alquiler.getBase();
        };
    }
}
