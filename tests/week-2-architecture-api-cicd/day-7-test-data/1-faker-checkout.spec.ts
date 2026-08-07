import { test, expect } from "@playwright/test";
import { makeCustomer } from "./factories";

/**
 * Test data-driven: el checkout de SauceDemo se completa con un cliente
 * SINTÉTICO generado por la factory. Cada corrida usa datos distintos, y no hay
 * ni un dato personal real hardcodeado.
 */
test("checkout con datos sintéticos (Faker + factory)", async ({ page }) => {
  const customer = makeCustomer(); // cliente aleatorio y realista

  // --- Preparación mínima por UI (login + un producto) ---
  await page.goto("/");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: "Sauce Labs Backpack" })
    .getByRole("button", { name: "Add to cart" })
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.getByRole("button", { name: "Checkout" }).click();

  // --- El formulario se llena con la DATA de la factory, no con strings fijos ---
  await page.getByPlaceholder("First Name").fill(customer.firstName);
  await page.getByPlaceholder("Last Name").fill(customer.lastName);
  await page.getByPlaceholder("Zip/Postal Code").fill(customer.postalCode);
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.locator('[data-test="total-label"]')).toContainText(
    "Total:"
  );
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page.getByText("Thank you for your order!")).toBeVisible();
});
