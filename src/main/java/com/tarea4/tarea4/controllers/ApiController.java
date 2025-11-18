package com.tarea4.tarea4.controllers;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tarea4.tarea4.services.ApiService;

@RestController
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    // endpoint para agregar una nota a un aviso
    // espera un JSON como { "nota": numero int }
    // responde { "status": "ok", "promedio": numero double }
    @CrossOrigin(origins = "*") // o restringes a http://localhost:5000 si usas Flask
    @PostMapping("/api/avisos/{avisoId}/notas")
    public Map<String, Object> agregarNotaEndpoint(
        @PathVariable Integer avisoId,
        @RequestBody Map<String, Integer> body
    ) {
        Integer notaValor = body.get("nota");
        return apiService.agregarNota(avisoId, notaValor);
    }
}