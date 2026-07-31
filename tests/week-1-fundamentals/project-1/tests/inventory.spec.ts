// test EXTENDIDO: arranca YA logueado (storageState de la fixture del worker).
import { test, expect } from "../fixtures/auth.fixture";
import { InventoryPage } from "../pages/inventory.page";

/**
 * Catálogo: cantidad de productos, ordenamientos (filtros) y carrito.
 * Todos arrancan logueados sin repetir el login (gracias a la fixture).
 */
test.describe("Catálogo", () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventory = new InventoryPage(page);
    await inventory.goto();
  });

  test("muestra los 6 productos del catálogo", async () => {
    await expect(inventory.items).toHaveCount(6);
  });

  test("ordena por nombre A→Z", async () => {
    await inventory.sortBy("az");
    const nombres = await inventory.getNames();
    // Comparamos contra una copia ordenada alfabéticamente.
    expect(nombres).toEqual([...nombres].sort());
  });

  test("ordena por nombre Z→A", async () => {
    await inventory.sortBy("za");
    const nombres = await inventory.getNames();
    // Orden descendente = ordenar ascendente y dar vuelta.
    expect(nombres).toEqual([...nombres].sort().reverse());
  });

  test("ordena por precio de menor a mayor", async () => {
    await inventory.sortBy("lohi");
    const precios = await inventory.getPrices();
    expect(precios).toEqual([...precios].sort((a, b) => a - b));
  });

  test("ordena por precio de mayor a menor", async () => {
    await inventory.sortBy("hilo");
    const precios = await inventory.getPrices();
    expect(precios).toEqual([...precios].sort((a, b) => b - a));
  });

  test("agregar y quitar un producto actualiza el contador del carrito", async () => {
    await inventory.addToCart("Sauce Labs Backpack");
    await expect(inventory.cartBadge).toHaveText("1");

    await inventory.removeFromCart("Sauce Labs Backpack");
    // Al quedar en 0, el globito desaparece del DOM.
    await expect(inventory.cartBadge).toHaveCount(0);
  });
});
