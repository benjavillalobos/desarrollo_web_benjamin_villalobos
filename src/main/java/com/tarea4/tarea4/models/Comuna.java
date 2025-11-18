package com.tarea4.tarea4.models;

import jakarta.persistence.*;

@Entity
@Table(name = "comuna", schema = "tarea2")
public class Comuna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    public Comuna() {
    }
    public Integer getId() {
        return id; 
    }

    public String getNombre() {
        return nombre; 
    }

}
