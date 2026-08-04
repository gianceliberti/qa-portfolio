import { test as base, expect, type Page } from "@playwright/test";

/**
 * ESTILO 3 — Fixtures compuestas (Playwright inyecta cosas ya listas).
 * Definimos dos fixtures:
 *   - authedPage: una página YA logueada.
 *   - addToCart:  una acción lista para usar (que a su vez depende de authedPage).
 * El cuerpo del test queda lo más fino posible: ni login, ni locators.
 */

type Fixtures = {
  authedPage: Page;
  addToCart: (product: string) => Promise<void>;
};

const test = base.extend<Fixtures>({
  // Fixture que entrega la página ya logueada.
  authedPage: async ({ page }, use) => {
    await page.goto("/");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await use(page);
  },

  // Fixture que depende de authedPage y entrega una acción reutilizable.
  addToCart: async ({ authedPage }, use) => {
    await use(async (product: string) => {
      await authedPage
        .locator('[data-test="inventory-item"]')
        .filter({ hasText: product })
        .getByRole("button", { name: "Add to cart" })
        .click();
    });
  },
});

test("fixtures compuestas: agregar al carrito", async ({
  authedPage,
  addToCart,
}) => {
  // Sin login ni locators en el test: las fixtures ya lo resolvieron.
  await addToCart("Sauce Labs Backpack");
  await expect(
    authedPage.locator('[data-test="shopping-cart-badge"]')
  ).toHaveText("1");
});
