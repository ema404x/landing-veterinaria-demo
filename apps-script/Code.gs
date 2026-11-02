// Recibe los pedidos de turno de la landing y los guarda en la planilla.
// Opcional: avisa por email a la veterinaria en cada pedido nuevo.
// Instalación: en la planilla, Extensiones → Apps Script, pegá este código,
// Implementar → Nueva implementación → Aplicación web (ejecutar como: vos; acceso: cualquier usuario).
// Copiá la URL que termina en /exec en config.js (sheetsWebhookUrl).

const HOJA = "Turnos";
const EMAIL_AVISO = ""; // ej. "turnos@tu-veterinaria.com" — vacío para no enviar avisos
const SERVICIOS = ["Consulta clínica", "Vacunación", "Baño y peluquería", "Odontología", "Urgencia"];
const ENCABEZADO = ["Recibido", "Nombre", "Teléfono", "Email", "Mascota", "Servicio", "Mensaje", "Estado"];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    // Se vuelve a validar en el servidor: nunca confiar solo en el navegador.
    const texto = (v, max) => String(v || "").trim().slice(0, max);
    const fila = {
      nombre: texto(d.nombre, 80),
      telefono: texto(d.telefono, 20),
      email: texto(d.email, 120),
      mascota: texto(d.mascota, 60),
      servicio: texto(d.servicio, 40),
      mensaje: texto(d.mensaje, 1000),
    };
    if (fila.nombre.length < 2 || !fila.mascota || SERVICIOS.indexOf(fila.servicio) === -1 || (!fila.telefono && !fila.email)) {
      return respuesta({ ok: false, error: "Datos incompletos" });
    }

    // Evita que Sheets interprete el texto como fórmula.
    const seguro = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = libro.getSheetByName(HOJA) || libro.insertSheet(HOJA);
    if (hoja.getLastRow() === 0) hoja.appendRow(ENCABEZADO);
    hoja.appendRow([
      new Date(), seguro(fila.nombre), seguro(fila.telefono), seguro(fila.email),
      seguro(fila.mascota), fila.servicio, seguro(fila.mensaje), "Pendiente",
    ]);

    if (EMAIL_AVISO) {
      MailApp.sendEmail(EMAIL_AVISO, "Nuevo pedido de turno: " + fila.servicio,
        "Nombre: " + fila.nombre + "\nTeléfono: " + fila.telefono + "\nEmail: " + fila.email +
        "\nMascota: " + fila.mascota + "\nServicio: " + fila.servicio + "\nMensaje: " + fila.mensaje);
    }
    return respuesta({ ok: true });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
