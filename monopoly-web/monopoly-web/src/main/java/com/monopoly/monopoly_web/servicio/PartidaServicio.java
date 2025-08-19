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
import com.monopoly.monopoly_web.modelo.Partida;
import com.monopoly.monopoly_web.modelo.Propiedad;
import com.monopoly.monopoly_web.modelo.PropiedadPartida;
import com.monopoly.monopoly_web.repositorio.JugadorRepositorio;
import com.monopoly.monopoly_web.repositorio.PartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadPartidaRepositorio;
import com.monopoly.monopoly_web.repositorio.PropiedadRepositorio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.Comparator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class PartidaServicio {

    private final PartidaRepositorio partidaRepositorio;
    private final JugadorRepositorio jugadorRepositorio;
    private final PropiedadRepositorio propiedadRepositorio;
    private final PropiedadPartidaRepositorio propiedadPartidaRepositorio;
    @Autowired
    private JugadorServicio jugadorServicio;

    @Autowired
    private EntityManager entityManager;

    public PartidaServicio(PartidaRepositorio partidaRepositorio,
            JugadorRepositorio jugadorRepositorio,
            PropiedadRepositorio propiedadRepositorio,
            PropiedadPartidaRepositorio propiedadPartidaRepositorio) {
        this.partidaRepositorio = partidaRepositorio;
        this.jugadorRepositorio = jugadorRepositorio;
        this.propiedadRepositorio = propiedadRepositorio;
        this.propiedadPartidaRepositorio = propiedadPartidaRepositorio;
    }

    @Transactional
    public void finalizarPartida(Long id) {
        Optional<Partida> optionalPartida = partidaRepositorio.findById(id);
        if (optionalPartida.isEmpty()) {
            throw new EntityNotFoundException("Partida no encontrada con id: " + id);
        }

        Partida partida = optionalPartida.get();

        // Si está guardada, solo marcar como finalizada
        if (partida.isGuardada()) {
            partida.setEnProgreso(false);
            partidaRepositorio.save(partida);
            return;
        }

        // ✅ Resetear propiedadesPartida antes de borrar (buena práctica)
        List<PropiedadPartida> propiedadesPartida = propiedadPartidaRepositorio.findByPartida(partida);
        for (PropiedadPartida pp : propiedadesPartida) {
            pp.setCasas(0);
            pp.setHotel(false);
            pp.setHipotecada(false);
            pp.setDueno(null);
        }
        propiedadPartidaRepositorio.saveAll(propiedadesPartida);
        entityManager.flush();
        entityManager.clear();

        // ✅ Luego borrar registros (ya reseteados)
        propiedadPartidaRepositorio.deleteAll(propiedadesPartida);

        // ✅ Borrar jugadores asociados a la partida
        jugadorRepositorio.deleteByPartidaId(id);

        // ✅ Borrar la propia partida
        partidaRepositorio.deleteById(id);
    }

    @Transactional
    public void intentarPago(Jugador deudor, int cantidad, Jugador acreedor) {
        if (deudor.getDinero() >= cantidad) {
            // ✅ Puede pagar normalmente
            deudor.setDinero(deudor.getDinero() - cantidad);
            if (acreedor != null) {
                acreedor.setDinero(acreedor.getDinero() + cantidad);
                jugadorRepositorio.save(acreedor);
            }
            deudor.setEnQuiebra(false);
            deudor.setDeudaPendiente(0);
            deudor.setJugadorAcreedor(null);
        } else {
            // ❌ No puede pagar → entra en quiebra
            int deuda = cantidad - deudor.getDinero();
            deudor.setEnQuiebra(true);
            deudor.setDeudaPendiente(deuda);
            deudor.setJugadorAcreedor(acreedor); // puede ser null si la deuda es con el banco
        }

        jugadorRepositorio.save(deudor);
    }

    @Transactional
    public String transferirTodoAlAcreedor(Jugador deudor) {
        Jugador acreedor = deudor.getJugadorAcreedor();

        if (acreedor == null) {
            throw new IllegalStateException("No se puede transferir al banco. Solo se puede transferir todo si la deuda es con otro jugador.");
        }

        // Verificar que no hay construcciones
        List<PropiedadPartida> propiedades = propiedadPartidaRepositorio.findByDuenoId(deudor.getId());
        for (PropiedadPartida propiedad : propiedades) {
            if (propiedad.getCasas() > 0 || propiedad.isHotel()) {
                throw new IllegalStateException("Debes vender todas tus construcciones antes de transferir.");
            }
        }

        // Transferir propiedades al acreedor
        for (PropiedadPartida propiedad : propiedades) {
            propiedad.setDueno(acreedor);
        }
        propiedadPartidaRepositorio.saveAll(propiedades);

        // Transferir dinero al acreedor
        int dineroRestante = deudor.getDinero();
        acreedor.setDinero(acreedor.getDinero() + dineroRestante);
        deudor.setDinero(0);

        // Limpiar estado de quiebra del deudor
        deudor.setJugadorAcreedor(null);
        deudor.setEnQuiebra(false);
        deudor.setDeudaPendiente(0);

        jugadorRepositorio.save(acreedor);

        // Obtener partida y estado del turno antes de borrar al jugador
        Partida partida = deudor.getPartida();
        boolean teniaElTurno = deudor.isTurno();
        Long idDeudor = deudor.getId(); // Guardar ID antes de eliminar

        // Comprobar si solo queda un jugador antes de eliminar
        List<Jugador> jugadoresRestantesPrevios = jugadorRepositorio.findByPartidaIdOrderById(partida.getId());

        if (jugadoresRestantesPrevios.size() == 2) {
            // Se eliminará uno y quedará solo uno → hay ganador
            jugadorRepositorio.delete(deudor);
            partida.setEnProgreso(false);
            partidaRepositorio.save(partida);
            return "ganador:" + jugadoresRestantesPrevios.stream()
                    .filter(j -> !j.getId().equals(idDeudor))
                    .findFirst()
                    .map(Jugador::getNombre)
                    .orElse("Desconocido");
        }

// Eliminar al jugador primero
        Long partidaId = partida.getId();
        jugadorRepositorio.delete(deudor);

// Si tenía el turno, pasárselo a otro tras eliminarlo
        if (teniaElTurno) {
            jugadorServicio.pasarTurnoTrasEliminarJugador(partidaId);
        }

        return "eliminado";
    }

}
