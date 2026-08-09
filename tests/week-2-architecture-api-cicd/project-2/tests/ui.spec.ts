import { test, expect } from "../fixtures";
import { makeCustomer } from "../factories";

/**
 * UI E2E con la arquitectura completa: los tests piden `inventoryPage` /
 * `checkoutPage` (Page Objects ya inyectados y logueados) y datos de `makeCustomer`.
 * Fijate que NO hay login ni construcción de POMs en el cuerpo — todo eso vive
 * en las fixtures.
 */
test.describe("UI — compra end-to-end", () => {
  test("compra un producto con datos sintéticos", async ({
    inventoryPage,
    checkoutPage,
  }) => {
    const customer = makeCustomer(); // datos distintos en cada corrida

    await inventoryPage.addToCart("Sauce Labs Backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.openCart();
    await checkoutPage.start();
    await checkoutPage.fillInformation(customer);

    await expect(checkoutPage.totalLabel).toContainText("Total:");
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toBeVisible();
  });

  test("el checkout exige el código postal (caso negativo)", async ({
    inventoryPage,
    checkoutPage,
  }) => {
    // Generamos un cliente pero le forzamos el código postal vacío con override.
    const customer = makeCustomer({ postalCode: "" });

    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();
    await checkoutPage.start();
    await checkoutPage.fillInformation(customer);

    await expect(checkoutPage.errorMessage).toContainText(
      "Postal Code is required"
    );
  });
});
