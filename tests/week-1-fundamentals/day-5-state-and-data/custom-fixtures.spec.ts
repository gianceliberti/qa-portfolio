// Importamos el `test` EXTENDIDO (con nuestra fixture) desde fixtures.ts,
// en vez del `test` normal de "@playwright/test".
import { test, expect } from "./fixtures";

/**
 * Cómo se usa una fixture propia: el test pide `loggedInPage` en sus argumentos
 * y lo recibe ya listo. Fijate que en el cuerpo NO hay ni una línea de login:
 * toda esa "fontanería" vive en la fixture. El test queda enfocado solo en lo
 * que quiere verificar.
 */
test.describe("usando la fixture propia loggedInPage", () => {
  test("el test recibe la página ya logueada", async ({ loggedInPage }) => {
    // Sin login acá: la fixture ya nos dejó dentro. Directo a verificar.
    await expect(loggedInPage.getByText("Products")).toBeVisible();
  });

  test("puede operar de una sobre la app (agregar al carrito)", async ({
    loggedInPage,
  }) => {
    await loggedInPage
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: "Sauce Labs Backpack" })
      .getByRole("button", { name: "Add to cart" })
      .click();
    await expect(
      loggedInPage.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText("1");
  });
});
