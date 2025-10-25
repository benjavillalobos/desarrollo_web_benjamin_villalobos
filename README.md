# Tarea 3 - Desarrollo Web

## Descripción
Esta tarea implementa la extensión del sistema de adopción de mascotas (Tarea 2), agregando:

- Sistema de **comentarios por aviso**, con validación y carga asíncrona usando `fetch`.
- Página de **estadísticas dinámicas** usando `Highcharts` y datos reales de la base de datos.
- Corrección de errores y mejoras de accesibilidad (la tarea anterior no funcionaba 100% las integraciones de base de datos con la pagina web)
- Interfaz en modo oscuro.

## Decisiones tomadas

- Mantener una estructura modular: `app.py` para rutas, `db.py` para manejo de base de datos.

- Validaciones en JS y backend.

- Se agregaron comentarios para mayor claridad en algunas funciones


## Requisitos

- Python 3.11+
- Flask 3.x
- MySQL 8
- Librerías listadas en `requirements.txt`

## Ejecución

```bash
# Activar entorno virtual
venv\Scripts\activate

# Correr aplicación
cd flask_app
flask run
```

Para hacer que funcionen las bases de datos localmente, usar MySQL Database Management en VSCode
