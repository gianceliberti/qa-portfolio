import { test, expect } from "@playwright/test";
import { API, makeBooking, getAuthToken } from "./helpers/api";

/**
 * API testing como código, con la estructura profesional:
 * Contract → Happy path / ciclo de vida → Auth → Errores.
 * Sin browser: todo con el `request` fixture.
 */

// ─────────────────────────────────────────────────────────────
// CONTRACT — ¿la respuesta tiene el status, headers y forma correctos?
// ─────────────────────────────────────────────────────────────
test.describe("Contract", () => {
  test("POST /booking devuelve 200, JSON, y el recurso con su forma", async ({
    request,
  }) => {
    const res = await request.post(`${API}/booking`, {
      headers: { Accept: "application/json" },
      data: makeBooking(),
    });

    expect(res.status()).toBe(200); // status correcto
    expect(res.headers()["content-type"]).toContain("application/json"); // header

    const body = await res.json();
    // La "forma" del contrato: un id numérico + el booking con sus tipos.
    expect(body).toMatchObject({
      bookingid: expect.any(Number),
      booking: {
        firstname: expect.any(String),
        lastname: expect.any(String),
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
      },
    });
  });

  test("GET /booking devuelve una colección (lista de ids)", async ({
    request,
  }) => {
    const res = await request.get(`${API}/booking`);
    expect(res.ok()).toBeTruthy();
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty("bookingid");
  });
});

// ─────────────────────────────────────────────────────────────
// CICLO DE VIDA — create → update → deactivate → verify.
// Patrón de aprovisionamiento de un recurso (usuarios, reservas, etc.).
// ─────────────────────────────────────────────────────────────
test.describe("Ciclo de vida (aprovisionamiento de un recurso)", () => {
  test("create → update → deactivate → verify", async ({ request }) => {
    const token = await getAuthToken(request); // update/delete exigen auth
    const original = makeBooking({ firstname: "Ada" });
    let id = 0;

    await test.step("CREATE — dar de alta el recurso", async () => {
      const res = await request.post(`${API}/booking`, {
        headers: { Accept: "application/json" },
        data: original,
      });
      expect(res.status()).toBe(200);
      id = (await res.json()).bookingid;
    });

    await test.step("READ — verificar que existe con los datos correctos", async () => {
      const res = await request.get(`${API}/booking/${id}`);
      expect(res.ok()).toBeTruthy();
      expect(await res.json()).toMatchObject({ firstname: "Ada" });
    });

    await test.step("UPDATE — modificar el recurso (con token)", async () => {
      const res = await request.put(`${API}/booking/${id}`, {
        headers: { Accept: "application/json", Cookie: `token=${token}` },
        data: makeBooking({ firstname: "Grace", lastname: original.lastname }),
      });
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({ firstname: "Grace" });
    });

    await test.step("DEACTIVATE — dar de baja (delete, con token)", async () => {
      const res = await request.delete(`${API}/booking/${id}`, {
        headers: { Cookie: `token=${token}` },
      });
      expect([200, 201, 204]).toContain(res.status());
    });

    await test.step("VERIFY — confirmar que ya no existe (404)", async () => {
      const res = await request.get(`${API}/booking/${id}`);
      expect(res.status()).toBe(404);
    });
  });
});

// ─────────────────────────────────────────────────────────────
// AUTH — sin token te rechaza; con token te deja.
// ─────────────────────────────────────────────────────────────
test.describe("Auth", () => {
  test("POST /auth devuelve un token", async ({ request }) => {
    const token = await getAuthToken(request);
    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(0);
  });

  test("DELETE sin token es rechazado (403)", async ({ request }) => {
    // Creamos uno para intentar borrarlo sin credenciales.
    const created = await request.post(`${API}/booking`, {
      headers: { Accept: "application/json" },
      data: makeBooking(),
    });
    const id = (await created.json()).bookingid;

    const res = await request.delete(`${API}/booking/${id}`); // sin Cookie/token
    expect(res.status()).toBe(403); // Forbidden
  });
});

// ─────────────────────────────────────────────────────────────
// ERRORES Y EDGE CASES — códigos de error correctos.
// ─────────────────────────────────────────────────────────────
test.describe("Errores", () => {
  test("GET de un id inexistente devuelve 404", async ({ request }) => {
    const res = await request.get(`${API}/booking/99999999`);
    expect(res.status()).toBe(404);
  });
});
