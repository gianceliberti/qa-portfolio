import { test, expect } from "../fixtures/auth.fixture"; // ya logueado
import { InventoryPage } from "../pages/inventory.page";
import { CartPage } from "../pages/cart.page";

/**
 * Carrito: que los productos agregados aparezcan, se puedan quitar, y que
 * "seguir comprando" vuelva al catálogo.
 */
test.describe("Carrito", () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    await inventory.goto();
  });

  test("los productos agregados aparecen en el carrito", async () => {
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.addToCart("Sauce Labs Bike Light");
    await inventory.openCart();

    await expect(cart.items).toHaveCount(2);
    await expect(cart.itemNames).toHaveText([
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
    ]);
  });

  test("quitar un producto desde el carrito lo elimina", async () => {
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.addToCart("Sauce Labs Bike Light");
    await inventory.openCart();

    await cart.removeItem("Sauce Labs Backpack");
    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemNames).toHaveText(["Sauce Labs Bike Light"]);
  });

  test('"Continue Shopping" vuelve al catálogo', async ({ page }) => {
    await inventory.addToCart("Sauce Labs Backpack");
    await inventory.openCart();

    await cart.continueShopping();
    await expect(page).toHaveURL(/inventory/);
  });
});
