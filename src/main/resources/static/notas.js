
// js para evaluar avisos y asignar notas

document.addEventListener("DOMContentLoaded", () => {
  let avisoSeleccionadoId = null;

  const panel = document.getElementById("panelEvaluar");
  const spanAvisoId = document.getElementById("evalAvisoId");
  const notaInput = document.getElementById("notaInput");
  const mensaje = document.getElementById("mensajeNota");
  const btnEnviar = document.getElementById("btnEnviarNota");
  const btnCancelar = document.getElementById("btnCancelarNota");

  //al hacer click en evaluar
  document.querySelectorAll(".btn-evaluar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      avisoSeleccionadoId = btn.dataset.avisoId;
      spanAvisoId.textContent = avisoSeleccionadoId;
      notaInput.value = "";
      mensaje.hidden = true;
      panel.style.display = "block";
    });
  });

  //enviar nota
  btnEnviar.addEventListener("click", () => {
    const valor = notaInput.value.trim();
    const notaInt = parseInt(valor, 10);

    if (isNaN(notaInt) || notaInt < 1 || notaInt > 7) {
      mensaje.hidden = false;
      mensaje.className = "error";
      mensaje.textContent = "La nota debe ser un número entero entre 1 y 7.";
      return;
    }

    fetch(`/api/avisos/${avisoSeleccionadoId}/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota: notaInt })
    })
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => {
        if (data.status === "ok") {
          //actualizar celda de nota
          const celdaNota = document.querySelector(
            `.col-nota[data-aviso-id="${avisoSeleccionadoId}"]`
          );
          celdaNota.textContent = data.promedio.toFixed(1);

          mensaje.hidden = false;
          mensaje.className = "success";
          mensaje.textContent = "Nota registrada correctamente.";
          panel.style.display = "none"; // si quieres cerrarlo
        } else {
          mensaje.hidden = false;
          mensaje.className = "error";
          mensaje.textContent = data.mensaje || "Error al guardar la nota.";
        }
      })
      .catch(err => {
        console.error(err);
        mensaje.hidden = false;
        mensaje.className = "error";
        mensaje.textContent = "Error de comunicación con el servidor.";
      });
  });

  //cancelar evaluación
  btnCancelar.addEventListener("click", () => {
    panel.style.display = "none";
  });
});