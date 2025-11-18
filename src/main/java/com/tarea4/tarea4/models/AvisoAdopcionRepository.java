package com.tarea4.tarea4.models;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Integer> {

    @Query("""
        SELECT new com.tarea4.tarea4.models.AvisoListadoDTO(
            a.id,
            a.fechaIngreso,
            a.sector,
            a.cantidad,
            a.tipo,
            a.edad,
            a.comuna.nombre,
            (SELECT AVG(n.valor) FROM Nota n WHERE n.avisoId = a.id)
        )
        FROM AvisoAdopcion a
        ORDER BY a.fechaIngreso DESC
    """)
    List<AvisoListadoDTO> findAvisosParaListado();
}
