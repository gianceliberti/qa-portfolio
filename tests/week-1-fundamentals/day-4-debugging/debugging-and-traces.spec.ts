import { test, expect } from "@playwright/test";

/**
 * DÍA 4 — Debugging y trazas
 * --------------------------
 * Un flujo de compra COMPLETO en SauceDemo, organizado con test.step() para
 * que el reporte y la traza se lean como un crash report: un árbol de pasos
 * plegable en vez de 20 acciones sueltas.
 *
 * Herramientas de debugging (para practicar sobre este archivo):
 *   npx playwright test day-4 --ui                 → modo UI (ver paso a paso)
 *   npx playwright test day-4 --debug              → Playwright Inspector (pausá y avanzá)
 *   PWDEBUG=1 npx playwright test day-4            → igual que --debug, por env var
 *   npx playwright test day-4 --trace on           → fuerza grabar la traza
 *   npx playwright show-trace <ruta/trace.zip>     → abrí la traza a inspeccionar
 *   npx playwright codegen https://www.saucedemo.com → descubrir selectores (explorar)
 *
 * Nota: usamos page.goto("/") porque el baseURL (saucedemo.com) está en el config.
 */

const USER = "standard_user";
const PASS = "secret_sauce";

test("compra end-to-end: login → carrito → checkout → confirmación", async ({
  page,
}) => {
  // test.step(nombre, async () => {...}) agrupa las acciones internas bajo un
  // nombre. En el reporte/traza aparece como un nodo plegable: si el test falla,
  // ves EN QUÉ PASO se rompió antes de abrir el detalle. Cada step lleva await
  // porque devuelve una promesa (espera a que su bloque termine).

  await test.step("Iniciar sesión", async () => {
    await page.goto("/"); // "/" = baseURL (https://www.saucedemo.com)
    await page.getByPlaceholder("Username").fill(USER);
    await page.getByPlaceholder("Password").fill(PASS);
    await page.getByRole("button", { name: "Login" }).click();
    // Verificamos que el login funcionó antes de seguir: si esto falla, el
    // reporte marca el fallo DENTRO de "Iniciar sesión", no en un paso posterior.
    await expect(page).toHaveURL(/inventory/);
  });

  await test.step("Agregar 2 productos al carrito", async () => {
    // Reusamos el patrón robusto del Día 3: acotar por tarjeta de producto y
    // buscar el botón por su rol/nombre (no por clase CSS frágil).
    for (const producto of ["Sauce Labs Backpack", "Sauce Labs Bike Light"]) {
      await page
        .locator('[data-test="inventory-item"]')
        .filter({ hasText: producto })
        .getByRole("button", { name: "Add to cart" })
        .click();
    }
    // El globito del carrito debe mostrar "2".
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(
      "2"
    );
  });

  await test.step("Ir al carrito y verificar los ítems", async () => {
    // El ícono del carrito es un link; lo abrimos y comprobamos que estén los 2.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart/);
    // Cada fila del carrito es un [data-test="inventory-item"]. toHaveCount(2)
    // verifica que haya exactamente 2 filas: es una aserción sobre una COLECCIÓN,
    // no sobre un elemento (por eso no importa cuál, sino cuántos hay).
    // Nota: usamos el selector explícito [data-test="..."] en vez de getByTestId
    // porque getByTestId es GLOBAL y por defecto busca `data-testid`; cambiarlo a
    // `data-test` en el config rompería los tests de TodoMVC (que sí usan data-testid).
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(2);
  });

  await test.step("Checkout: completar datos del comprador", async () => {
    await page.getByRole("button", { name: "Checkout" }).click();
    // Los 3 campos del formulario, localizados por su placeholder (lo ve el usuario).
    await page.getByPlaceholder("First Name").fill("Jane");
    await page.getByPlaceholder("Last Name").fill("Doe");
    await page.getByPlaceholder("Zip/Postal Code").fill("12345");
    await page.getByRole("button", { name: "Continue" }).click();
  });

  await test.step("Revisar el resumen y finalizar la compra", async () => {
    // Estamos en el paso "overview". Verificamos que haya un total antes de finalizar.
    await expect(page.locator('[data-test="total-label"]')).toContainText(
      "Total:"
    );
    await page.getByRole("button", { name: "Finish" }).click();
    // Confirmación final: SauceDemo muestra este texto tras completar la orden.
    await expect(page.getByText("Thank you for your order!")).toBeVisible();
  });
});
