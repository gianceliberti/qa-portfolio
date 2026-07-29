import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * DÍA 3 — Locators: CSS frágil vs. roles robustos
 * ------------------------------------------------
 * Cargamos una pantalla de login LOCAL (un .html que controlamos nosotros)
 * para poder "cambiar las clases" y medir qué test se rompe.
 *
 * Hay 2 versiones idénticas para el usuario, con clases CSS distintas:
 *   - login-v1.html  → clases originales   (.login-submit, .login-input--user)
 *   - login-v2.html  → clases renombradas  (.auth-go, .field--username)
 *
 * Cómo correr:
 *   npx playwright test dia3 --project=chromium                  → usa v1
 *   APP_VERSION=v2 npx playwright test dia3 --project=chromium   → usa v2
 */

// __dirname no existe en módulos ESM; lo reconstruimos a partir de import.meta.url.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Elegimos qué versión del HTML cargar. Si no se pasa APP_VERSION, usamos "v1".
const version = process.env.APP_VERSION ?? "v1";

// Construimos una URL file:// apuntando al .html elegido.
const fixtureUrl =
  "file://" + path.join(__dirname, "fixtures", `login-${version}.html`);

// ─────────────────────────────────────────────────────────────
// ENFOQUE A — Locators CSS frágiles (❌ lo que NO hay que hacer)
// Depende de nombres de clase que existen para dar ESTILO, no para testear.
// ─────────────────────────────────────────────────────────────
test("CSS frágil: encuentra los campos por su clase", async ({ page }) => {
  await page.goto(fixtureUrl);

  // page.locator(".clase") busca por selector CSS. Estas clases son las de v1.
  // fill() escribe en el campo. Si la clase no existe (v2), fill() no encuentra
  // el elemento y falla por timeout: el test se ROMPE.
  await page.locator(".login-input--user").fill("standard_user");
  await page.locator(".login-input--pass").fill("secret_sauce");

  // El botón se busca por su clase ".login-submit". Verificamos que se vea.
  await expect(page.locator(".login-submit")).toBeVisible();
});

// ─────────────────────────────────────────────────────────────
// ENFOQUE B — Locators por rol/label robustos (✅ la forma correcta)
// Busca los elementos como los ve el USUARIO. No le importan las clases CSS.
// ─────────────────────────────────────────────────────────────
test("Roles robustos: encuentra los campos por rol y label", async ({
  page,
}) => {
  await page.goto(fixtureUrl);

  // getByLabel("Username") encuentra el input asociado a la etiqueta "Username".
  // El texto de la etiqueta NO cambió entre v1 y v2 → este locator sobrevive.
  await page.getByLabel("Username").fill("standard_user");
  await page.getByLabel("Password").fill("secret_sauce");

  // getByRole("button", { name: "Login" }) = "el botón que dice Login".
  // El rol (button) y el texto (Login) son iguales en v1 y v2 → sobrevive.
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

// ─────────────────────────────────────────────────────────────
// MEDICIÓN — ¿cuántos selectores se rompen tras renombrar las clases?
// Usamos expect.soft: NO corta en el primer fallo, sino que los junta todos
// y reporta el total. Así "medimos" cuántas roturas produce el cambio de clase.
// ─────────────────────────────────────────────────────────────
test("MEDICIÓN: contar roturas de los 3 selectores CSS", async ({ page }) => {
  await page.goto(fixtureUrl);

  // Cada expect.soft comprueba un selector CSS de v1. En v1 pasan los 3.
  // En v2 (clases renombradas) fallan los 3 → Playwright reporta 3 errores
  // en un solo test. Ese número ES la medición de fragilidad.
  await expect.soft(page.locator(".login-input--user")).toBeVisible();
  await expect.soft(page.locator(".login-input--pass")).toBeVisible();
  await expect.soft(page.locator(".login-submit")).toBeVisible();
});
