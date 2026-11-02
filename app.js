import { esBot, validarTurno } from "./validate.js";

const form = document.getElementById("form-turno");
const boton = document.getElementById("enviar");
const estado = document.getElementById("estado");
const CAMPOS = ["nombre", "telefono", "email", "mascota", "servicio", "acepto"];

function leerFormulario() {
  const fd = new FormData(form);
  return {
    nombre: fd.get("nombre"),
    telefono: fd.get("telefono"),
    email: fd.get("email"),
    mascota: fd.get("mascota"),
    servicio: fd.get("servicio"),
    mensaje: fd.get("mensaje"),
    sitio_web: fd.get("sitio_web"),
    acepto: document.getElementById("acepto").checked,
  };
}

function mostrarErrores(errores) {
  for (const campo of CAMPOS) {
    const input = document.getElementById(campo);
    const msg = document.getElementById(`error-${campo}`);
    msg.textContent = errores[campo] || "";
    input.setAttribute("aria-invalid", errores[campo] ? "true" : "false");
  }
  const primero = CAMPOS.find((c) => errores[c]);
  if (primero) document.getElementById(primero).focus();
}

function mostrarEstado(tipo, texto) {
  estado.innerHTML = "";
  const div = document.createElement("div");
  div.className = `msg ${tipo}`;
  div.textContent = texto;
  estado.appendChild(div);
}

async function enviar(valores) {
  const url = window.LANDING_CONFIG?.sheetsWebhookUrl;
  if (!url) return { demo: true };
  // Sin encabezado Content-Type: el navegador lo manda como text/plain y Apps Script no exige CORS previo.
  const res = await fetch(url, { method: "POST", body: JSON.stringify({ ...valores, origen: location.href }) });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "No se pudo guardar");
  return { demo: false };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  estado.innerHTML = "";
  const datos = leerFormulario();

  // A los bots se les muestra éxito sin enviar nada.
  if (esBot(datos)) {
    form.reset();
    return mostrarEstado("ok", "¡Listo! Te contactamos a la brevedad para confirmar el turno.");
  }

  const { ok, errores, valores } = validarTurno(datos);
  mostrarErrores(errores);
  if (!ok) return;

  boton.disabled = true;
  boton.textContent = "Enviando…";
  try {
    const { demo } = await enviar(valores);
    form.reset();
    mostrarEstado(
      "ok",
      demo
        ? `¡Gracias, ${valores.nombre}! (Modo demo: los datos se validaron pero no se enviaron a ningún lado.)`
        : `¡Gracias, ${valores.nombre}! Recibimos tu pedido de turno para ${valores.mascota} y te contactamos a la brevedad.`,
    );
  } catch {
    mostrarEstado("err", "No pudimos enviar tu pedido. Probá de nuevo en unos minutos.");
  } finally {
    boton.disabled = false;
    boton.textContent = "Pedir turno";
  }
});

// Limpia el error de un campo apenas el usuario lo corrige.
for (const campo of CAMPOS) {
  document.getElementById(campo).addEventListener("input", () => {
    document.getElementById(`error-${campo}`).textContent = "";
    document.getElementById(campo).setAttribute("aria-invalid", "false");
  });
}
