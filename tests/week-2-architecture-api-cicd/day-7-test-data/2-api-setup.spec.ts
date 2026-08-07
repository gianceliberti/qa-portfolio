import { test, expect } from "@playwright/test";
import { makeBooking } from "./factories";

/**
 * Setup vía API + verificación + limpieza (idempotencia).
 *
 * Demostramos el ciclo de vida completo de un dato de prueba SIN tocar la UI:
 *   1. CREATE  — crear el recurso por API (rápido y confiable)
 *   2. VERIFY  — leerlo de vuelta para confirmar que existe
 *   3. CLEANUP — borrarlo, para no dejar basura (el test corre igual la 1ª y la 100ª vez)
 *
 * API pública de práctica: restful-booker (CRUD real).
 * Nota: en un proyecto real, el CLEANUP va en un afterEach/fixture para que
 * corra incluso si el test falla a la mitad.
 */
const API = "https://restful-booker.herokuapp.com";

test("setup vía API: crear → verificar → limpiar", async ({ request }) => {
  const booking = makeBooking(); // payload sintético desde la factory

  // 1. CREATE — crear el booking por API en vez de llenar un formulario.
  const created = await request.post(`${API}/booking`, {
    headers: { Accept: "application/json" },
    data: booking,
  });
  expect(created.ok()).toBeTruthy();

  const body = await created.json();
  const bookingId: number = body.bookingid;
  // La API devuelve lo que guardó: confirmamos que coincide con lo que enviamos.
  expect(body.booking).toMatchObject({
    firstname: booking.firstname,
    lastname: booking.lastname,
  });

  // 2. VERIFY — leer el recurso recién creado por su id.
  const fetched = await request.get(`${API}/booking/${bookingId}`);
  expect(fetched.ok()).toBeTruthy();
  expect(await fetched.json()).toMatchObject({
    firstname: booking.firstname,
    lastname: booking.lastname,
  });

  // 3. CLEANUP — borrar lo que creamos. Primero un token de auth, luego DELETE.
  const auth = await request.post(`${API}/auth`, {
    data: { username: "admin", password: "password123" },
  });
  const { token } = await auth.json();

  const deleted = await request.delete(`${API}/booking/${bookingId}`, {
    headers: { Cookie: `token=${token}` },
  });
  // restful-booker responde 201 al borrar OK; aceptamos los códigos de éxito.
  expect([200, 201, 204]).toContain(deleted.status());
});
