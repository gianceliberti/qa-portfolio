import { test, expect } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * DÍA 5 — storageState (loguearse una vez) + aislamiento entre tests
 * ------------------------------------------------------------------
 * Idea: hacemos login UNA sola vez, guardamos el estado de sesión (cookies +
 * localStorage) en un archivo, y cada test arranca YA logueado cargando ese
 * archivo. Sin repetir el formulario de login en cada test = mucho más rápido.
 */

// Ruta donde guardaremos el estado de sesión. Va en .auth/ (ignorado por git:
// contiene tokens de sesión, nunca se commitea).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, ".auth", "user.json");

// beforeAll corre UNA vez antes de todos los tests de este archivo.
// Acá hacemos el login "caro" una sola vez y guardamos el resultado.
test.beforeAll(async ({ browser }) => {
  // Creamos un contexto temporal LIMPIO solo para loguearnos.
  // storageState: undefined es clave: este beforeAll hereda el storageState del
  // describe de abajo, pero ese archivo AÚN no existe (lo estamos por crear).
  // Forzamos "sin estado" para arrancar del login de cero y evitar el ENOENT.
  const context = await browser.newContext({ storageState: undefined });
  const page = await context.newPage();

  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/inventory/); // confirmamos que el login funcionó

  // storageState({ path }) vuelca cookies + localStorage a un archivo JSON.
  // Ese archivo ES la sesión guardada que reusarán los tests de abajo.
  await context.storageState({ path: authFile });
  await context.close(); // ya no necesitamos este contexto temporal
});

test.describe("reutilizando el login guardado (storageState)", () => {
  // test.use({ storageState }) le dice a Playwright: para CADA test de este
  // bloque, creá el contexto cargando esa sesión. Resultado: arrancan logueados.
  test.use({ storageState: authFile });

  test("arranca ya logueado, sin pasar por el formulario de login", async ({
    page,
  }) => {
    // Vamos DIRECTO a la página interna. Si no estuviéramos logueados, SauceDemo
    // nos patearía al login. Como cargamos la sesión, entramos derecho.
    await page.goto("/inventory.html");
    await expect(page.getByText("Products")).toBeVisible();
  });

  test("aislamiento A: el carrito arranca vacío", async ({ page }) => {
    await page.goto("/inventory.html");
    // El globito del carrito NO debe existir (0 items). Esto arranca limpio
    // porque el estado guardado se tomó con el carrito vacío.
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0
    );
  });

  test("aislamiento B: agrego al carrito y NO afecta al test A", async ({
    page,
  }) => {
    await page.goto("/inventory.html");
    // Verificamos que TAMBIÉN arranca vacío (no heredó nada de otro test)...
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(
      0
    );
    // ...agregamos un producto SOLO en el contexto de este test...
    await page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: "Sauce Labs Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    // ...y acá el carrito muestra "1". Pero el test A (que corre en su propio
    // contexto aislado) sigue viendo el carrito vacío. Cada test en su burbuja.
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
      "1"
    );
  });
});
