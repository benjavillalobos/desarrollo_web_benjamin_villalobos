// Fotos de ejemplo
const fotosEjemplo = {
    1: ["img/img1.jpg"],
    2: ["img/img2.jpg"],
    3: ["img/img3.jpg"],
    4: ["img/img4.jpeg", "img/img6.jpg", "img/img7.jpeg"],
    5: ["img/img5.jpg", "img/img8.jpg"]
};

// Mostrar detalle de aviso
const mostrarDetalle = (fila) => {
    document.getElementById("listado").style.display = "none";
    const detalle = document.getElementById("detalle");
    detalle.style.display = "block";

    const celdas = fila.querySelectorAll("td");
    const dataId = fila.dataset.id;
    const contenido = document.getElementById("detalleContenido");

    // Genera contenido cuando seleccionamos un aviso
    contenido.innerHTML = `
        <p><bold>Fecha Publicación:</bold> ${celdas[0].innerText}</p>
        <p><bold>Fecha Entrega:</bold> ${celdas[1].innerText}</p>
        <p><bold>Comuna:</bold> ${celdas[2].innerText}</p>
        <p><bold>Sector:</bold> ${celdas[3].innerText}</p>
        <p><bold>Cantidad, Tipo y Edad:</bold> ${celdas[4].innerText}</p>
        <p><bold>Nombre Contacto:</bold> ${celdas[5].innerText}</p>
        <p><bold>Contacto:</bold> ${celdas[6].innerText}</p>
        <p><bold>Total Fotos:</bold> ${celdas[7].innerText}</p>
        <div id="fotosDetalle"></div>
    `;

    //foto cuando seleccionamos un aviso
    const fotosDiv = document.getElementById("fotosDetalle");
    fotosEjemplo[dataId].forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.width = 320;
        img.height = 240;
        img.style.cursor = "pointer";
        img.style.margin = "5px";
        img.addEventListener("click", () => abrirModal(src));
        fotosDiv.appendChild(img);
    });
};


// Abrir modal con foto ampliada
const abrirModal = (src) => {
    const modal = document.createElement("div");
    modal.className = "modal-fondo";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Foto ampliada";

    const btnCerrar = document.createElement("button");
    btnCerrar.innerText = "Cerrar";
    btnCerrar.addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    modal.appendChild(img);
    modal.appendChild(btnCerrar);
    document.body.appendChild(modal);
};

// Agregar evento click a cada fila de la tabla
document.querySelectorAll("#tablaListado tbody tr").forEach(fila => {
    fila.addEventListener("click", () => mostrarDetalle(fila));
});

//boton para volver a listado
document.getElementById("btnVolverListado").addEventListener("click", () => {
    document.getElementById("detalle").style.display = "none";
    document.getElementById("listado").style.display = "block";
});

//boton para volver a portada
document.getElementById("btnVolverPortada").addEventListener("click", () => {
    window.location.href = "index.html";
});