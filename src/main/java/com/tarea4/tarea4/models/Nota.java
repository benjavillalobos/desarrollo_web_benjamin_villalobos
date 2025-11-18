package com.tarea4.tarea4.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "nota", schema = "tarea2")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "aviso_id", nullable = false)
    private Integer avisoId;

    @Column(name = "nota", nullable = false)
    private Integer valor;

    public Nota() {
    }

    public Nota(Integer avisoId, Integer valor) {
        this.avisoId = avisoId;
        this.valor = valor;
    }

    public Integer getId() {
        return id;
    }

    public Integer getAvisoId() {
        return avisoId;
    }

    public void setAvisoId(Integer avisoId) {
        this.avisoId = avisoId;
    }

    public Integer getValor() {
        return valor;
    }

    public void setValor(Integer valor) {
        this.valor = valor;
    }
}