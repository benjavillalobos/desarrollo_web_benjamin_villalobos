package com.tarea4.tarea4.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.tarea4.tarea4.models.Nota;
import com.tarea4.tarea4.models.NotaRepository;


@Service
public class ApiService {

    private final NotaRepository notaRepository;

    public ApiService(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    // agrega nota a aviso y retorna un map con status y nuevo promedio
    public Map<String, Object> agregarNota(Integer avisoId, Integer notaValor) {
        Map<String, Object> resultado = new HashMap<>();

        // validacion (nota de 1 a 7)
        if (notaValor == null || notaValor < 1 || notaValor > 7) {
            resultado.put("status", "error");
            resultado.put("mensaje", "La nota debe estar entre 1 y 7.");
            return resultado;
        }

        // crear y guardar la nota
        Nota nota = new Nota(avisoId, notaValor);
        notaRepository.save(nota);

        // calcular nuevo promedio
        Double promedio = notaRepository.findPromedioByAvisoId(avisoId);

        resultado.put("status", "ok");
        resultado.put("promedio", promedio);
        return resultado;
    }
}
