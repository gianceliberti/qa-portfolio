import { type APIRequestContext } from "@playwright/test";

/** Cliente/base de la API (Día 8). restful-booker: CRUD + auth reales. */
export const API = "https://restful-booker.herokuapp.com";

/** Token de auth (las operaciones que modifican datos lo exigen). */
export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${API}/auth`, {
    data: { username: "admin", password: "password123" },
  });
  return (await res.json()).token;
}
