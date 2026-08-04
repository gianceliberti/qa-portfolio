import { test, expect, type Page, type Locator } from "@playwright/test";

/**
 * ESTILO 1 — Page Object Model clásico (una clase por pantalla).
 * Los Page Objects exponen locators + acciones. NO tienen assertions adentro:
 * el test es el que verifica. (Los defino acá mismo para poder estudiarlos; en
 * un proyecto real vivirían en pages/.)
 */

// --- Page Object de la pantalla de login ---
class LoginPage {
  constructor(private readonly page: Page) {}

  goto() {
    return this.page.goto("/"); // baseURL = saucedemo
  }

  async login(user: string, pass: string) {
    await this.page.getByPlaceholder("Username").fill(user);
    await this.page.getByPlaceholder("Password").fill(pass);
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}

// --- Page Object del catálogo ---
class InventoryPage {
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  addToCart(product: string) {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: product })
      .getByRole("button", { name: "Add to cart" })
      .click();
  }
}

test("POM clásico: login y agregar al carrito", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventory = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await inventory.addToCart("Sauce Labs Backpack");

  // La ASERCIÓN vive en el test, nunca dentro del Page Object.
  await expect(inventory.cartBadge).toHaveText("1");
});
