from flask import Flask, request, render_template, redirect, url_for, session, flash, jsonify, request
from database import db
from datetime import datetime
from werkzeug.utils import secure_filename
from sqlalchemy import text
import os


UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.secret_key = "secret_key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000



#FUNCION PARA VALIDAR ERRORES DE FORM (ojala en un archivo a parte para no llenar app.py)
def validar_datos_backend(form, archivos):
    errores = []

    #ubicacion
    region = form.get("region", "").strip()
    comuna_id = form.get("comuna", "").strip()
    if not region:
        errores.append("Debe seleccionar una región.")
    if not comuna_id:
        errores.append("Debe seleccionar una comuna.")

    sector = form.get("sector", "").strip()
    if len(sector) > 100:
        errores.append("El sector no puede tener más de 100 caracteres.")

    #contacto
    nombre = form.get("nombre", "").strip()
    email = form.get("email", "").strip()
    telefono = form.get("telefono", "").strip()
    if len(nombre) < 3 or len(nombre) > 200:
        errores.append("El nombre debe tener entre 3 y 200 caracteres.")
    if not email or "@" not in email or len(email) > 100:
        errores.append("Debe ingresar un correo electrónico válido.")
    if telefono and not telefono.startswith("+") and "." not in telefono:
        errores.append("El teléfono debe tener el formato +XXX.XXXXXXXX.")

    #redes sociales
    redes = form.getlist("red")
    ids = form.getlist("red_id")
    for red, identificador in zip(redes, ids):
        identificador = identificador.strip()
        if red and (len(identificador) < 4 or len(identificador) > 50):
            errores.append(f"El identificador de {red} debe tener entre 4 y 50 caracteres.")

    #mascota
    tipo = form.get("tipo", "").strip()
    cantidad = form.get("cantidad", "").strip()
    edad = form.get("edad", "").strip()
    unidad = form.get("unidadEdad", "").strip()
    fecha_entrega = form.get("fechaEntrega", "").strip()

    if tipo not in ["gato", "perro"]:
        errores.append("Debe seleccionar el tipo de mascota.")
    try:
        cantidad = int(cantidad)
        if cantidad < 1:
            raise ValueError
    except ValueError:
        errores.append("Debe ingresar una cantidad válida.")

    try:
        edad = int(edad)
        if edad < 1:
            raise ValueError
    except ValueError:
        errores.append("Debe ingresar una edad válida.")

    if unidad not in ["meses", "años"]:
        errores.append("Debe seleccionar la unidad de edad.")

    from datetime import datetime, timedelta
    try:
        fecha_entrega_dt = datetime.fromisoformat(fecha_entrega)
        if fecha_entrega_dt < datetime.now() + timedelta(hours=3):
            errores.append("La fecha de entrega debe ser al menos 3 horas después de la actual.")
    except Exception:
        errores.append("Debe ingresar una fecha de entrega válida.")

    #fotos
    if not archivos or len(archivos) < 1:
        errores.append("Debe subir al menos una foto.")
    if len(archivos) > 5:
        errores.append("No puede subir más de 5 fotos.")

    return errores


# --- Auth routes ---

#PORTADA
@app.route("/", methods=["GET"])
def index():
    avisos = db.get_last_avisos(limit=5)
    return render_template("index.html", avisos=avisos)


#AGREGAR AVISO FORM
@app.route("/agregar", methods=["GET", "POST"])
def agregar_aviso():
    if request.method == "POST":
        fotos = request.files.getlist("fotos") if "fotos" in request.files else []
        errores = validar_datos_backend(request.form, fotos)

        if errores:
            #mostrar errores
            for err in errores:
                flash(err, "danger")
            #mantener datos del form
            regiones = db.get_regiones()
            comunas = db.get_comunas()
            return render_template("agregar.html", regiones=regiones, comunas=comunas)
        


        try:
            comuna_id = int(request.form.get("comuna"))
            sector = request.form.get("sector")
            nombre = request.form.get("nombre")
            email = request.form.get("email")
            celular = request.form.get("telefono")
            tipo = request.form.get("tipo")
            cantidad = int(request.form.get("cantidad"))
            edad = int(request.form.get("edad"))
            unidad = "a" if request.form.get("unidadEdad") == "años" else "m"
            fecha_entrega = datetime.fromisoformat(request.form.get("fechaEntrega"))
            descripcion = request.form.get("descripcion")

            #crear aviso principal
            aviso_id = db.create_aviso(
                comuna_id=comuna_id,
                sector=sector,
                nombre=nombre,
                email=email,
                celular=celular,
                tipo=tipo,
                cantidad=cantidad,
                edad=edad,
                unidad=unidad,
                fecha_entrega=fecha_entrega,
                descripcion=descripcion
            )

            #guardar fotos
            fotos = request.files.getlist("fotos")
            for foto in fotos:
                if foto and foto.filename:
                    ruta = os.path.join(app.config["UPLOAD_FOLDER"], foto.filename)
                    foto.save(ruta)
                    db.add_foto(ruta_archivo=ruta, nombre_archivo=foto.filename, aviso_id=aviso_id)

            #guardar contactos
            redes = request.form.getlist("red")
            ids = request.form.getlist("red_id")
            for nombre_red, identificador in zip(redes, ids):
                if nombre_red and identificador:
                    db.add_contacto(nombre_red.lower(), identificador, aviso_id)

            flash("Aviso agregado correctamente.", "success")
            return redirect(url_for("index"))

        except Exception as e:
            flash(f"Error al guardar el aviso: {str(e)}", "danger")

    regiones = db.get_regiones()
    comunas = db.get_comunas()
    return render_template("agregar.html", regiones=regiones, comunas=comunas)



#LISTADO DE AVISOS
@app.route("/listado", methods=["GET"])
def listado():
    page = int(request.args.get("page", 1))
    per_page = 5
    avisos, total = db.get_avisos_paginated(page, per_page)

    next_page = page + 1 if total > page * per_page else None
    prev_page = page - 1 if page > 1 else None

    return render_template("listado.html",
                           avisos=avisos,
                           page=page,
                           next_page=next_page,
                           prev_page=prev_page)



#DETALLE AVISO
@app.route("/aviso/<int:id>", methods=["GET"])
def detalle_aviso(id):
    aviso = db.get_aviso_by_id(id)
    if not aviso:
        flash("Aviso no encontrado.", "warning")
        return redirect(url_for("listado"))
    return render_template("detalle.html", aviso=aviso)


#COMENTARIOS AVISOS
#obtener comentarios en JSON
@app.route("/comentarios/<int:aviso_id>")
def mostrar_comentarios(aviso_id):
    comentarios = db.get_comentarios_by_aviso(aviso_id)
    data = []

    for c in comentarios:
        data.append({
            "id": c.id,
            "nombre": c.nombre,
            "texto": c.texto,
            "fecha": c.fecha.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify({"status": "ok", "data": data})

#insertar comentario desde JSON
@app.route("/agregar-comentario", methods=["POST"])
def agregar_comentario():
    nombre = (request.form.get("nombre") or "").strip()
    texto = (request.form.get("texto") or "").strip()
    aviso_id = (request.form.get("aviso_id") or "").strip()

    # Validaciones básicas
    if not aviso_id or not aviso_id.isdigit():
        return jsonify({"status": "error", "data": "ID de aviso inválido."}), 400

    aviso_id = int(aviso_id)

    if not nombre or len(nombre) < 3 or len(nombre) > 80:
        return jsonify({"status": "error", "data": "El nombre debe tener entre 3 y 80 caracteres."}), 400

    if not texto or len(texto) < 5 or len(texto) > 300:
        return jsonify({"status": "error", "data": "El comentario debe tener entre 5 y 300 caracteres."}), 400

    # Insertar en la base de datos
    db.add_comentario(nombre, texto, aviso_id)

    return jsonify({"status": "ok", "data": "Comentario agregado correctamente."})




#ESTADISTICAS
#html
@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")


#graficos datos json
@app.route("/api/estadisticas")
def api_estadisticas():
    session = db.SessionLocal()

    #grafico 1 avisos por dia
    por_dia = session.execute(text("""
        SELECT DATE(fecha_ingreso) AS fecha, COUNT(*) AS total
        FROM tarea2.aviso_adopcion
        GROUP BY DATE(fecha_ingreso)
        ORDER BY fecha;
    """)).mappings().all()

    #avisos portipo
    por_tipo = session.execute(text("""
        SELECT tipo, COUNT(*) AS total
        FROM tarea2.aviso_adopcion
        GROUP BY tipo;
    """)).mappings().all()

    #avisos por mes y tipo
    por_mes = session.execute(text("""
        SELECT 
            DATE_FORMAT(fecha_ingreso, '%Y-%m') AS mes,
            SUM(CASE WHEN LOWER(tipo) = 'perro' THEN 1 ELSE 0 END) AS perros,
            SUM(CASE WHEN LOWER(tipo) = 'gato' THEN 1 ELSE 0 END) AS gatos
        FROM aviso_adopcion
        WHERE fecha_ingreso IS NOT NULL
        GROUP BY DATE_FORMAT(fecha_ingreso, '%Y-%m')
        ORDER BY mes;
    """)).mappings().all()

    session.close()

    
    #de rowmapping a dict para jsonify
    por_dia = [dict(row) for row in por_dia]
    por_tipo = [dict(row) for row in por_tipo]

    #converitmos por mes manualmente para asegurarnos que los valores son int
    #aseguramos (me daba problemas para cuando los avisos eran 1)
    por_mes_lista = []
    for row in por_mes:
        por_mes_lista.append({
            "mes": row["mes"],
            "perros": int(row["perros"]), #decimal a int
            "gatos": int(row["gatos"])   #decimal a int
        })


    return jsonify({
        "por_dia": list(por_dia),
        "por_tipo": list(por_tipo),
        "por_mes": por_mes_lista
    })


# --- MAIN ---
if __name__ == "__main__":
    if not os.path.exists(app.config["UPLOAD_FOLDER"]):
        os.makedirs(app.config["UPLOAD_FOLDER"])
    app.run(debug=True)

if __name__ == "__main__":
    from database.db import get_regiones
    print("Primeras regiones:", [r.nombre for r in get_regiones()[:5]])
    if not os.path.exists(app.config["UPLOAD_FOLDER"]):
        os.makedirs(app.config["UPLOAD_FOLDER"])
    app.run(debug=True)




