//COMENTARIOS

// Validar comentario antes de enviar
const validarComentario = (nombre, texto) => {
    const nombreOk = nombre && nombre.trim().length >= 3 && nombre.trim().length <= 80;
    const textoOk = texto && texto.trim().length >= 5 && texto.trim().length <= 300;
    return nombreOk && textoOk;
};

// Cargar comentarios de un aviso
const cargarComentarios = (avisoId) => {
    const contenedor = document.getElementById("comentariosContainer");
    contenedor.innerHTML = "<p>Cargando comentarios...</p>";

    fetch(`${window.origin}/comentarios/${avisoId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
    })
    .then((resp) => resp.json())
    .then((data) => {
        if (data.status !== "ok" || data.data.length === 0) {
            contenedor.innerHTML = "<p><em>No hay comentarios todavía.</em></p>";
            return;
        }

        let lista = document.createElement("ul");
        lista.className = "lista-comentarios";

        data.data.forEach((c) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${c.nombre}</strong>
                <span class="fecha">${c.fecha}</span><br>
                <span>${c.texto}</span>
            `;
            lista.appendChild(li);
        });

        contenedor.innerHTML = "";
        contenedor.appendChild(lista);
    })
    .catch((error) => {
        console.error("Error al obtener comentarios:", error);
        contenedor.innerHTML = "<p>Error al cargar los comentarios.</p>";
    });
};

// Agregar nuevo comentario
const enviarComentario = (avisoId) => {
    const nombreInput = document.getElementById("comentarioNombre");
    const textoInput = document.getElementById("comentarioTexto");
    const mensaje = document.getElementById("mensajeComentario");
    const nombre = nombreInput.value.trim();
    const texto = textoInput.value.trim();

    // Validar antes de enviar
    if (!validarComentario(nombre, texto)) {
        mensaje.hidden = false;
        mensaje.className = "error";
        mensaje.textContent = "El nombre o el texto no son válidos.";
        return;
    }

    // Armar datos del formulario
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("texto", texto);
    formData.append("aviso_id", avisoId);

    fetch(`${window.origin}/agregar-comentario`, {
        method: "POST",
        body: formData,
        credentials: "include",
        cache: "no-cache",
    })
    .then((resp) => resp.json())
    .then((result) => {
        mensaje.hidden = false;
        if (result.status === "ok") {
            mensaje.className = "success";
            mensaje.textContent = "Comentario agregado correctamente.";
            nombreInput.value = "";
            textoInput.value = "";
            cargarComentarios(avisoId);
        } else {
            mensaje.className = "error";
            mensaje.textContent = result.data || "Error al enviar el comentario.";
        }
    })
    .catch((error) => {
        console.error("Error al enviar comentario:", error);
        mensaje.hidden = false;
        mensaje.className = "error";
        mensaje.textContent = "Error al conectar con el servidor.";
    });
};

// Configurar el formulario de comentarios
const configurarComentarios = (avisoId) => {
    const btnComentario = document.getElementById("btnEnviarComentario");
    if (!btnComentario) return;

    btnComentario.addEventListener("click", (e) => {
        e.preventDefault();
        enviarComentario(avisoId);
    });
};







// Mostrar detalle del aviso al hacer clic en una fila
const mostrarDetalle = (fila) => {
    const listado = document.getElementById("listado");
    const detalle = document.getElementById("detalle");
    const contenido = document.getElementById("detalleContenido");

    listado.style.display = "none";
    detalle.style.display = "block";

    const fotos = fila.dataset.fotos ? fila.dataset.fotos.split(",") : [];

    contenido.innerHTML = `
        <p><strong>Fecha Publicación:</strong> ${fila.dataset.fecha_pub}</p>
        <p><strong>Fecha Entrega:</strong> ${fila.dataset.fecha_ent}</p>
        <p><strong>Comuna:</strong> ${fila.dataset.comuna}</p>
        <p><strong>Sector:</strong> ${fila.dataset.sector}</p>
        <p><strong>Cantidad, Tipo y Edad:</strong> ${fila.dataset.cant_tipo}</p>
        <p><strong>Nombre Contacto:</strong> ${fila.dataset.nombre}</p>
        <p><strong>Contacto:</strong> ${fila.dataset.contactos || "Sin redes adicionales"}</p>
        <p><strong>Total Fotos:</strong> ${fotos.length}</p>
        <div id="fotosDetalle"></div>
    `;

    const fotosDiv = document.getElementById("fotosDetalle");
    fotos.forEach(nombreArchivo => {
        const img = document.createElement("img");
        img.src = `/static/uploads/${nombreArchivo}`;
        img.width = 320;
        img.height = 240;
        img.style.cursor = "pointer";
        img.style.margin = "5px";
        img.addEventListener("click", () => abrirModal(img.src));
        fotosDiv.appendChild(img);
    });

    // Cargar comentarios y configurar formulario al abrir el detalle
    const avisoId = fila.dataset.id;
    cargarComentarios(avisoId);
    configurarComentarios(avisoId);
};

// Abrir imagen en modal grande
const abrirModal = (src) => {
    const modal = document.createElement("div");
    modal.className = "modal-fondo";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Foto ampliada";
    img.width = 800;
    img.height = 600;

    const btnCerrar = document.createElement("button");
    btnCerrar.innerText = "Cerrar";
    btnCerrar.addEventListener("click", () => modal.remove());

    modal.appendChild(img);
    modal.appendChild(btnCerrar);
    document.body.appendChild(modal);
};


// Volver al listado
document.getElementById("btnVolverListado").addEventListener("click", () => {
    document.getElementById("detalle").style.display = "none";
    document.getElementById("listado").style.display = "block";
});

// Volver a la portada
document.getElementById("btnVolverPortada").addEventListener("click", () => {
    window.location.href = "/";
});

// Asignar evento de click a todas las filas
document.querySelectorAll("#tablaListado tbody tr").forEach(fila => {
    fila.addEventListener("click", () => mostrarDetalle(fila));
});