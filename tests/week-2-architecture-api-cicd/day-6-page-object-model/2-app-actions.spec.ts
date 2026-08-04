import { test, expect, type Page } from "@playwright/test";

/**
 * ESTILO 2 — App Actions (funciones simples, sin clases).
 * En vez de "objetos página", pensamos en ACCIONES del usuario: login(),
 * addToCart(). Cada una es una función que recibe la `page`. Menos ceremonia
 * que las clases; muy legible para flujos.
 */

async function login(page: Page, user: string, pass: string): Promise<void> {
  await page.goto("/");
  await page.getByPlaceholder("Username").fill(user);
  await page.getByPlaceholder("Password").fill(pass);
  await page.getByRole("button", { name: "Login" }).click();
}

async function addToCart(page: Page, product: string): Promise<void> {
  await page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: product })
    .getByRole("button", { name: "Add to cart" })
    .click();
}

test("app actions: login y agregar al carrito", async ({ page }) => {
  await login(page, "standard_user", "secret_sauce");
  await addToCart(page, "Sauce Labs Backpack");

  // La aserción, de nuevo, en el test.
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
    "1"
  );
});
