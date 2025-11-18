package com.tarea4.tarea4.models;

// Direct Transfer Object para listar avisos con promedio de notas mas facilmente
// basicamente crear un objeto con los datos que quiero mostrar en la lista de avisos


import java.time.LocalDateTime;

public class AvisoListadoDTO {

    private Integer id;
    private LocalDateTime fechaPublicacion; 
    private String sector;
    private Integer cantidad;
    private String tipo;
    private Integer edad;
    private String comuna;
    private Double promedioNota;

    public AvisoListadoDTO(
            Integer id,
            LocalDateTime fechaPublicacion,  
            String sector,
            Integer cantidad,
            String tipo,
            Integer edad,
            String comuna,
            Double promedioNota
    ) {
        this.id = id;
        this.fechaPublicacion = fechaPublicacion;
        this.sector = sector;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.edad = edad;
        this.comuna = comuna;
        this.promedioNota = promedioNota;
    }

    public Integer getId() {
        return id;
    }

    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
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

    public String getComuna() {
        return comuna;
    }

    public Double getPromedioNota() {
        return promedioNota;
    }
}