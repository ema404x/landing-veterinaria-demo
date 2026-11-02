import { describe, expect, it } from "vitest";
import { esBot, normalizarTelefono, validarTurno } from "../validate.js";

const VALIDO = {
  nombre: "  Ana   Pérez ",
  telefono: "+54 9 11 5555-0000",
  email: "Ana@Example.com",
  mascota: "Toby",
  servicio: "Vacunación",
  mensaje: "Prefiero a la tarde.",
  acepto: true,
};

describe("validarTurno", () => {
  it("acepta y normaliza un pedido completo", () => {
    const r = validarTurno(VALIDO);
    expect(r.ok).toBe(true);
    expect(r.valores).toMatchObject({ nombre: "Ana Pérez", telefono: "+5491155550000", email: "ana@example.com" });
  });

  it("acepta solo teléfono o solo email", () => {
    expect(validarTurno({ ...VALIDO, email: "" }).ok).toBe(true);
    expect(validarTurno({ ...VALIDO, telefono: "" }).ok).toBe(true);
  });

  it("pide al menos un medio de contacto", () => {
    const r = validarTurno({ ...VALIDO, telefono: "", email: "" });
    expect(r.errores.telefono).toMatch(/teléfono o un email/);
  });

  it("detecta teléfono y email inválidos", () => {
    const r = validarTurno({ ...VALIDO, telefono: "123", email: "ana@" });
    expect(r.errores.telefono).toBeTruthy();
    expect(r.errores.email).toBeTruthy();
  });

  it("exige nombre, mascota, servicio válido y consentimiento", () => {
    const r = validarTurno({ ...VALIDO, nombre: "A", mascota: " ", servicio: "Cirugía", acepto: false });
    expect(Object.keys(r.errores).sort()).toEqual(["acepto", "mascota", "nombre", "servicio"]);
  });

  it("recorta mensajes demasiado largos", () => {
    expect(validarTurno({ ...VALIDO, mensaje: "x".repeat(2000) }).valores.mensaje).toHaveLength(1000);
  });
});

describe("utilidades", () => {
  it("normaliza teléfonos", () => {
    expect(normalizarTelefono("(011) 4555-1234")).toBe("01145551234");
  });

  it("detecta bots por el campo trampa", () => {
    expect(esBot({ sitio_web: "http://spam.example" })).toBe(true);
    expect(esBot({ sitio_web: "" })).toBe(false);
  });
});
