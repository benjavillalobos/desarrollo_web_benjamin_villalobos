package com.tarea4.tarea4.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tarea4.tarea4.models.AvisoAdopcionRepository;
import com.tarea4.tarea4.models.AvisoListadoDTO;


@Service
public class AppService {

    private final AvisoAdopcionRepository avisoRepository;

    public AppService(AvisoAdopcionRepository avisoRepository) {
        this.avisoRepository = avisoRepository;
    }

    public List<AvisoListadoDTO> getAvisosListado() {
        return avisoRepository.findAvisosParaListado();
    }
}
