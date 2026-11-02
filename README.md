# Landing con turnos online — Veterinaria Patitas (demo)

> **Proyecto demo.** *Veterinaria Patitas* es un negocio ficticio.

Landing page para un negocio de servicios con **formulario de pedido de turnos conectado a Google Sheets**.
Cada pedido queda como una fila en la planilla (con estado "Pendiente") y, si se configura, llega un **aviso por email**.

Pensado para veterinarias, consultorios, peluquerías, estudios y cualquier negocio que hoy recibe consultas sueltas por WhatsApp.

## Qué incluye

- **Diseño responsive** (celular, tablet y escritorio) con modo oscuro automático.
- Secciones de **servicios**, **pedido de turno** y **preguntas frecuentes**.
- **Formulario con validación clara**: avisa qué falta, acepta teléfono o email y normaliza los datos.
- **Antispam sin captcha**: un campo trampa invisible frena a los bots sin molestar a las personas.
- **Validación doble**: en el navegador y otra vez en Google Apps Script antes de guardar.
- **Planilla segura**: evita que el texto se interprete como fórmula.
- **Sin servidor ni costos de hosting**: es un sitio estático (GitHub Pages, Netlify o Vercel gratis) más Google Sheets.
- **Modo demo**: si no se configura la planilla, el formulario valida pero no envía nada.

## Cómo probarlo

Abrí la carpeta con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Conectar a Google Sheets

1. Creá una planilla y abrí **Extensiones → Apps Script**.
2. Pegá el contenido de [`apps-script/Code.gs`](apps-script/Code.gs). Si querés avisos por email, completá `EMAIL_AVISO`.
3. **Implementar → Nueva implementación → Aplicación web** (ejecutar como: vos; acceso: cualquier usuario).
4. Pegá la URL que termina en `/exec` en [`config.js`](config.js).

## Adaptarlo a otro negocio

Textos y servicios en `index.html`, colores en las variables de `styles.css` y la lista de servicios en
`validate.js` y `apps-script/Code.gs`.

## Tecnologías

HTML · CSS · JavaScript (módulos ES, sin frameworks) · Google Apps Script · Vitest

## Tests

```bash
npm install
npm test
```
