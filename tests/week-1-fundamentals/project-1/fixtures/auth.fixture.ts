import { test as base, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

/**
 * Autenticación reutilizable — patrón oficial de Playwright:
 * "una cuenta logueada UNA vez por worker".
 *
 * - workerStorageState es un fixture con scope "worker": corre una sola vez por
 *   proceso paralelo, hace login y guarda la sesión en un archivo.
 * - Sobrescribimos el option `storageState` para que TODOS los tests que usen
 *   este `test` arranquen con esa sesión cargada (ya logueados).
 *
 * Los tests de login NO deben usar este `test` (necesitan arrancar deslogueados);
 * usan el `test` base de "@playwright/test".
 */
export const test = base.extend<{}, { workerStorageState: string }>({
  // Cada test toma su storageState del fixture worker-scoped de abajo.
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      // parallelIndex identifica al worker (0, 1, 2…). Un archivo por worker.
      const id = test.info().parallelIndex;
      // Lo guardamos en outputDir (test-results/, ignorado por git y limpiado
      // en cada corrida) → nunca se commitea la sesión y siempre es fresca.
      const file = path.resolve(
        test.info().project.outputDir,
        `.auth/worker-${id}.json`
      );

      // Si este worker ya generó su sesión, la reusamos.
      if (fs.existsSync(file)) {
        await use(file);
        return;
      }

      // Login "caro" una sola vez, en un contexto limpio (sin estado previo).
      const context = await browser.newContext({ storageState: undefined });
      const page = await context.newPage();
      await page.goto("https://www.saucedemo.com/");
      await page.getByPlaceholder("Username").fill("standard_user");
      await page.getByPlaceholder("Password").fill("secret_sauce");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL(/inventory/);

      // Guardamos cookies + localStorage en el archivo del worker.
      await context.storageState({ path: file });
      await context.close();

      await use(file);
    },
    { scope: "worker" },
  ],
});

export { expect };
