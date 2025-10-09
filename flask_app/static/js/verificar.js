
// Cargar regiones al select
const cargarRegiones = () => {
    const regionSelect = document.getElementById("region");
    region_comuna.regiones.forEach(region => {
        let option = document.createElement("option");
        option.value = region.nombre;
        option.textContent = region.nombre;
        regionSelect.appendChild(option);
    });
}

// Cargar comunas según región seleccionada
const cargarComunas = () => {
    const comunaSelect = document.getElementById("comuna");
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

    const regionSeleccionada = document.getElementById("region").value;
    const region = region_comuna.regiones.find(r => r.nombre === regionSeleccionada);

    if (region) {
        region.comunas.forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna.nombre;
            option.textContent = comuna.nombre;
            comunaSelect.appendChild(option);
        });
    }
}

const prellenarFechaEntrega = () => {
    const input = document.getElementById("fechaEntrega");
    const now = new Date();
    now.setHours(now.getHours() + 3); // añadir 3 horas

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // meses empiezan en 0
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    const valor = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    input.value = valor;
    input.min = valor;
};


// Validaciones individuales
const validarUbicacion = (form) => {
    const errores = [];
    if (!form.region.value) errores.push("Debe seleccionar una región.");
    if (!form.comuna.value) errores.push("Debe seleccionar una comuna.");
    if (form.sector.value.trim().length > 100) errores.push("El sector no puede tener más de 100 caracteres.");
    return errores;
}

const validarContacto = (form) => {
    const errores = [];
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const telefono = form.telefono.value.trim();
    const redes = form.querySelectorAll('select[name="red"]');
    const ids = form.querySelectorAll('input[name="red_id"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre.length < 3 || nombre.length > 200)
        errores.push("El nombre debe tener entre 3 y 200 caracteres.");

    if (!email || !emailRegex.test(email) || email.length > 100)
        errores.push("Debe ingresar un correo electrónico válido.");

    if (telefono && !/^\+\d{3}\.\d{8}$/.test(telefono))
        errores.push("El teléfono debe tener el formato +XXX.XXXXXXXX.");

    redes.forEach((redSelect, i) => {
        const red = redSelect.value;
        const id = ids[i]?.value.trim() || "";
        if (red && (id.length < 4 || id.length > 50)) {
            errores.push(`El ID o URL para ${red} debe tener entre 4 y 50 caracteres.`);
        }
    });


    return errores;
}

const validarMascota = (form) => {
    const errores = [];
    const cantidad = parseInt(form.cantidad.value);
    const edad = parseInt(form.edad.value);

    if (!form.tipo.value) errores.push("Debe seleccionar el tipo de mascota.");
    if (!cantidad || cantidad < 1) errores.push("Debe indicar una cantidad válida.");
    if (!edad || edad < 1) errores.push("Debe indicar una edad válida.");
    if (!form.unidadEdad.value) errores.push("Debe seleccionar la unidad de edad.");

    if (!form.fechaEntrega.value) {
        errores.push("Debe seleccionar la fecha de entrega.");
    } else {
        const fechaSeleccionada = new Date(form.fechaEntrega.value);
        const ahora = new Date();
        ahora.setHours(ahora.getHours() + 3);
        if (fechaSeleccionada < ahora) {
            errores.push("La fecha de entrega debe ser al menos 3 horas después de la actual.");
        }
    }

    return errores;
};

const validarFotos = (form) => {
    const errores = [];
    const fotos = form.querySelectorAll('input[type="file"]');
    if (fotos.length < 1 || fotos.length > 5)
        errores.push("Debe subir entre 1 y 5 fotos.");
    return errores;
}

// validacion general
const validarFormulario = (evento) => {
    evento.preventDefault();
    const form = evento.target;
    const errores = [
        ...validarUbicacion(form),
        ...validarContacto(form),
        ...validarMascota(form),
        ...validarFotos(form)
    ];

    const valBox = document.getElementById("val-box");
    const valMsg = document.getElementById("val-msg");
    const valList = document.getElementById("val-list");

    if (errores.length > 0) {
        //muestra errores
        valBox.className = "error"; //estilo para css
        valBox.hidden = false;
        valMsg.textContent = "Corrige los siguientes errores:";
        valList.innerHTML = "";
        errores.forEach(error => {
            const li = document.createElement("li");
            li.textContent = error;
            valList.appendChild(li);
        });
    } else {
        // Confirmación antes de enviar
        valBox.className = "success"; //estilo para css
        valBox.hidden = false;
        valMsg.textContent = "¿Está seguro que desea agregar este aviso de adopción?";
        valList.innerHTML = "";

        //crea botones si y no
        const btnSi = document.createElement("button");
        btnSi.textContent = "Sí, estoy seguro";
        btnSi.type = "button";
        btnSi.addEventListener("click", () => {
           form.submit(); //enviar el formulario
        });
        const btnNo = document.createElement("button");
        btnNo.textContent = "No, no estoy seguro, quiero volver al formulario";
        btnNo.type = "button";
        btnNo.addEventListener("click", () => {
            valBox.hidden = true; // oculta el mensaje y mantiene el formulario
        });

        valList.appendChild(btnSi);
        valList.appendChild(btnNo);
    }
};


// Agregar más fotos (máximo 5)
const agregarFotoExtra=() => {
    const fotosActuales = document.querySelectorAll('input[type="file"]').length;
    if (fotosActuales >= 5) return;

    const nuevaFoto = document.createElement("input");
    nuevaFoto.type = "file";
    nuevaFoto.name = "fotos";
    nuevaFoto.accept = "image/*";

    const contenedor = document.getElementById("agregarFoto").parentElement;
    contenedor.appendChild(document.createElement("br"));
    contenedor.appendChild(nuevaFoto);
}

// Agregar más redes sociales (máximo 5)
const agregarRedExtra=() => {
    const redesActuales = document.querySelectorAll('select[name="red"]').length;
    if (redesActuales >= 5) return;

    const contenedor = document.getElementById("agregarRed").parentElement;

    // Crear nuevo select
    const nuevaRed = document.createElement("select");
    nuevaRed.name = "red";
    nuevaRed.innerHTML = `
        <option value="">Seleccione</option>
        <option>WhatsApp</option>
        <option>Telegram</option>
        <option>X</option>
        <option>Instagram</option>
        <option>TikTok</option>
        <option>Otra</option>
    `;

    // Crear nuevo input
    const nuevoId = document.createElement("input");
    nuevoId.type = "text";
    nuevoId.name = "red_id";
    nuevoId.placeholder = "ID o URL (min. 4, max. 50)";

    // Insertar en el DOM
    contenedor.appendChild(document.createElement("br"));
    contenedor.appendChild(nuevaRed);
    contenedor.appendChild(nuevoId);

}

cargarRegiones();
cargarComunas();
document.getElementById("region").addEventListener("change", cargarComunas);
document.getElementById("agregarFoto").addEventListener("click", agregarFotoExtra);
document.getElementById("agregarRed").addEventListener("click", agregarRedExtra);
document.forms["myForm"].addEventListener("submit", validarFormulario);
prellenarFechaEntrega();