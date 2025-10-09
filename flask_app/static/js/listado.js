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