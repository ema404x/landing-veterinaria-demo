// Validación del formulario de turnos. Se usa en el navegador y en los tests.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SERVICIOS = ["Consulta clínica", "Vacunación", "Baño y peluquería", "Odontología", "Urgencia"];

const limpiar = (v) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

// Normaliza un teléfono: deja dígitos y un "+" inicial.
export function normalizarTelefono(tel) {
  const t = limpiar(tel);
  const mas = t.startsWith("+") ? "+" : "";
  return mas + t.replace(/\D/g, "");
}

/**
 * @param {Record<string, unknown>} datos
 * @returns {{ ok: boolean, errores: Record<string, string>, valores: Record<string, string> }}
 */
export function validarTurno(datos) {
  const valores = {
    nombre: limpiar(datos.nombre),
    telefono: normalizarTelefono(datos.telefono),
    email: limpiar(datos.email).toLowerCase(),
    mascota: limpiar(datos.mascota),
    servicio: limpiar(datos.servicio),
    mensaje: typeof datos.mensaje === "string" ? datos.mensaje.trim().slice(0, 1000) : "",
  };
  const errores = {};

  if (valores.nombre.length < 2) errores.nombre = "Contanos tu nombre.";
  else if (valores.nombre.length > 80) errores.nombre = "El nombre es demasiado largo.";

  const digitos = valores.telefono.replace(/\D/g, "");
  if (!valores.telefono && !valores.email) {
    errores.telefono = "Dejanos un teléfono o un email para contactarte.";
  } else {
    if (valores.telefono && (digitos.length < 8 || digitos.length > 15)) errores.telefono = "Revisá el teléfono (8 a 15 dígitos).";
    if (valores.email && !EMAIL_RE.test(valores.email)) errores.email = "Revisá el email.";
  }

  if (!valores.mascota) errores.mascota = "¿Cómo se llama tu mascota?";
  if (!SERVICIOS.includes(valores.servicio)) errores.servicio = "Elegí un servicio.";
  if (datos.acepto !== true) errores.acepto = "Necesitamos tu permiso para contactarte.";

  return { ok: Object.keys(errores).length === 0, errores, valores };
}

// true si el campo trampa vino completo: lo llenó un bot.
export function esBot(datos) {
  return limpiar(datos.sitio_web) !== "";
}
