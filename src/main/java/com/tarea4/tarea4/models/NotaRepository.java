package com.tarea4.tarea4.models;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.avisoId = :avisoId")
    Double findPromedioByAvisoId(@Param("avisoId") Integer avisoId);
}