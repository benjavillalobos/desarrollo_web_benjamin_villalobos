# Tarea 4 – Desarrollo Web

## Descripción
Esta tarea corresponde a la migración de parte del sistema de adopción de mascotas a **Spring Boot**, reemplazando la versión en Flask de Tarea 2/3.  
Se implementaron:

- Listado de avisos usando **Thymeleaf**, **DTOs** y **JPA**.  
- Cálculo del **promedio de notas** por aviso.  
- **API REST** para registrar notas (`/api/avisos/{id}/notas`).  
- Interfaz interactiva para evaluar avisos con **JavaScript + fetch()** (llamadas asíncronas).

## Decisiones tomadas
- Uso de un **DTO (`AvisoListadoDTO`)** para separar lógica de presentación de las entidades.  
- Validación de notas (1–7) tanto en frontend como en backend.  
- Separación clara entre controladores, servicios, repositorios, entidades y vistas.  
- Uso de Thymeleaf para formatear fechas, mostrar promedios y renderizar el listado.

## Requisitos
- Java 17+ (se utilizó Java 25)  
- Maven 3.x  
- Spring Boot 3.5+  
- MySQL 8  
- Configuración en `application.properties`

## Notas adicionales

- Se reutiliza la misma base de datos de Tarea 2 y 3 (tablas ya creadas), solo creando tablas para las notas.

- Se mantuvo una interfaz simple en modo oscuro.

- Se eliminó la paginación y los comentarios de la página de listado, para hacer más simple la implementación de la tarea en Spring Boot.
