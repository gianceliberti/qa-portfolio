import { test, expect } from "@playwright/test"; // el `request` fixture no necesita browser
import { API, getAuthToken } from "../api";
import { makeBooking } from "../factories";

/**
 * Suite de API (Día 8): estructura contract → ciclo de vida → auth.
 * Payloads sintéticos desde la misma factory que usa la UI.
 */
test.describe("API — bookings", () => {
  test("contract: POST devuelve 200 + el recurso con su forma", async ({
    request,
  }) => {
    const res = await request.post(`${API}/booking`, {
      headers: { Accept: "application/json" },
      data: makeBooking(),
    });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");
    expect(await res.json()).toMatchObject({
      bookingid: expect.any(Number),
      booking: { firstname: expect.any(String), totalprice: expect.any(Number) },
    });
  });

  test("ciclo de vida: create → update → delete → verify", async ({
    request,
  }) => {
    const token = await getAuthToken(request);
    const created = await request.post(`${API}/booking`, {
      headers: { Accept: "application/json" },
      data: makeBooking({ firstname: "Ada" }),
    });
    const id = (await created.json()).bookingid;

    // update (con token)
    const updated = await request.put(`${API}/booking/${id}`, {
      headers: { Accept: "application/json", Cookie: `token=${token}` },
      data: makeBooking({ firstname: "Grace" }),
    });
    expect(await updated.json()).toMatchObject({ firstname: "Grace" });

    // delete (con token) → verify que ya no existe
    const deleted = await request.delete(`${API}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect([200, 201, 204]).toContain(deleted.status());
    const gone = await request.get(`${API}/booking/${id}`);
    expect(gone.status()).toBe(404);
  });

  test("auth: DELETE sin token es rechazado (403)", async ({ request }) => {
    const created = await request.post(`${API}/booking`, {
      headers: { Accept: "application/json" },
      data: makeBooking(),
    });
    const id = (await created.json()).bookingid;
    const res = await request.delete(`${API}/booking/${id}`); // sin token
    expect(res.status()).toBe(403);
  });
});
