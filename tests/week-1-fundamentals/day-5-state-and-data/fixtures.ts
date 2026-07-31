import { test as base, expect, type Page } from "@playwright/test";

/**
 * Fixture propia: extendemos el `test` base de Playwright con un fixture
 * llamado `loggedInPage`. Cualquier test que lo pida recibe la página YA
 * logueada, sin escribir el login en el cuerpo del test.
 *
 * Diferencia con storageState:
 *   - storageState: guarda la sesión en un archivo y la reusa (más rápido).
 *   - fixture loggedInPage: hace el login de verdad cada vez (más simple de leer).
 * Las dos evitan repetir el login en el cuerpo de cada test; se eligen según
 * el caso (velocidad vs. simplicidad).
 */

// Declaramos el "tipo" de nuestras fixtures: agregamos `loggedInPage` (un Page).
type MisFixtures = {
  loggedInPage: Page;
};

// base.extend crea un `test` nuevo que además de los fixtures normales
// (page, request, etc.) ofrece los nuestros.
export const test = base.extend<MisFixtures>({
  loggedInPage: async ({ page }, use) => {
    // --- SETUP: corre ANTES del test que pida `loggedInPage` ---
    await page.goto("/");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/inventory/);

    // use(page) ENTREGA la página ya logueada al test. El test corre en este punto.
    await use(page);

    // --- TEARDOWN: corre DESPUÉS del test ---
    // Acá iría limpieza si hiciera falta (borrar datos creados, cerrar sesión…).
    // En este caso no hace falta: Playwright descarta el contexto solo.
  },
});

// Reexportamos expect para importarlo junto al test extendido desde un solo lugar.
export { expect };
