package com.tarea4.tarea4.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aviso_adopcion", schema = "tarea2")
public class AvisoAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "sector")
    private String sector;

    @Column(name = "tipo", nullable = false)
    private String tipo; 

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "edad", nullable = false)
    private Integer edad;

    @ManyToOne
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    public AvisoAdopcion() {
    }

    public Integer getId() {
        return id; 
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso; 
    }

    public String getSector() {
        return sector; 
    }

    public Integer getCantidad() {
        return cantidad; 
    }

    public String getTipo() {
        return tipo; 
    }

    public Integer getEdad() {
        return edad; 
    }

    public Comuna getComuna() {
        return comuna; 
    }

}
