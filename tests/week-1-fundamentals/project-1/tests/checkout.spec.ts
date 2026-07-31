import { test, expect } from "../fixtures/auth.fixture"; // ya logueado
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";

/**
 * Checkout: el happy path completo hasta la confirmación, y las validaciones
 * del formulario (los 3 campos obligatorios). Datos ficticios (nunca reales).
 */
test.describe("Checkout", () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  // Cada test arranca con un producto en el carrito, ya en el paso 1 del checkout.
  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    await inventory.goto();
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();
    await cart.checkout(); // nos deja en /checkout-step-one.html
  });

  test("happy path: completa la compra hasta la confirmación", async () => {
    await checkout.fillInformation("Jane", "Doe", "12345");
    // En el paso 2 (resumen) debe verse el total.
    await expect(checkout.totalLabel).toContainText("Total:");
    await checkout.finish();
    // Confirmación final de la orden.
    await expect(checkout.completeHeader).toBeVisible();
  });

  test("falta el nombre → error de campo obligatorio", async () => {
    await checkout.fillInformation("", "Doe", "12345");
    await expect(checkout.errorMessage).toContainText("First Name is required");
  });

  test("falta el apellido → error de campo obligatorio", async () => {
    await checkout.fillInformation("Jane", "", "12345");
    await expect(checkout.errorMessage).toContainText("Last Name is required");
  });

  test("falta el código postal → error de campo obligatorio", async () => {
    await checkout.fillInformation("Jane", "Doe", "");
    await expect(checkout.errorMessage).toContainText(
      "Postal Code is required"
    );
  });
});
