/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.servicio;

/**
 *
 * @author gabri
 */
import com.monopoly.monopoly_web.dto.VentaPendienteDTO;
import org.springframework.stereotype.Component;

@Component
public class VentaPendienteServicio {

    private VentaPendienteDTO propuestaActual;

    public void guardar(VentaPendienteDTO dto) {
        this.propuestaActual = dto;
    }

    public VentaPendienteDTO obtenerSiEsPara(Long compradorId) {
        if (propuestaActual != null
                && propuestaActual.getCompradorId().equals(compradorId)) {
            return propuestaActual;
        }
        return null;
    }

    public void borrarSiEsDeComprador(Long compradorId) {
        if (propuestaActual != null && propuestaActual.getCompradorId().equals(compradorId)) {
            propuestaActual = null;
        }
    }
}
