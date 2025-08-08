/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.monopoly.monopoly_web.controlador;

import com.monopoly.monopoly_web.dto.TruequeDTO;
import com.monopoly.monopoly_web.servicio.TruequePendienteServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author gabri
 */
@RestController
@RequestMapping("/api/trueque")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TruequeControlador {

    @Autowired
    private TruequePendienteServicio truequePendienteServicio;

    @PostMapping("/proponer")
    public ResponseEntity<?> proponerTrueque(@RequestBody TruequeDTO dto) {
        try {
            truequePendienteServicio.guardar(dto);
            return ResponseEntity.ok("Propuesta de trueque guardada correctamente.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/pendiente/{receptorId}")
    public ResponseEntity<?> obtenerTruequePendiente(@PathVariable Long receptorId) {
        TruequeDTO dto = truequePendienteServicio.obtenerSiEsPara(receptorId);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @DeleteMapping("/cancelar/{ofertanteId}")
    public ResponseEntity<?> cancelarTrueque(@PathVariable Long ofertanteId) {
        truequePendienteServicio.borrarSiEsDe(ofertanteId);
        return ResponseEntity.ok("Propuesta cancelada.");
    }
}
