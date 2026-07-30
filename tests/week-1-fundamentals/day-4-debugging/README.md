# Día 4 — Debugging y trazas ✅

**Objetivo:** leer una traza como un crash report, y hacer reportes legibles.

## Del plan
- `--ui` mode, `--debug`, `PWDEBUG=1`.
- **Trace Viewer**: tu superpoder. Aprender a leerlo.
- Screenshots, videos, `test.step()` para reportes legibles.
- Codegen (`npx playwright codegen`) — para explorar, nunca para código final.

## Qué hay en esta carpeta
- [`debugging-and-traces.spec.ts`](debugging-and-traces.spec.ts) — un flujo de
  compra end-to-end en SauceDemo (login → carrito → checkout → confirmación),
  organizado con **`test.step()`** para que el reporte se lea como un árbol de
  pasos plegable. Comentado línea por línea.

## Caja de herramientas de debugging

| Comando | Para qué |
|---------|----------|
| `npx playwright test day-4 --ui` | Modo UI: correr y ver cada paso con captura |
| `npx playwright test day-4 --debug` | Playwright Inspector: pausar y avanzar acción por acción |
| `PWDEBUG=1 npx playwright test day-4` | Igual que `--debug`, vía variable de entorno |
| `npx playwright test day-4 --trace on` | Fuerza grabar la traza (aunque el test pase) |
| `npx playwright show-trace <trace.zip>` | Abrir la traza a inspeccionar (time-travel) |
| `npx playwright codegen https://www.saucedemo.com` | Descubrir selectores explorando (no para código final) |

## Lecciones de debugging que salieron en vivo
1. **`test.step()` localiza el fallo**: al fallar, el reporte marca *en qué paso*
   se rompió, sin leer 20 acciones sueltas.
2. **`getByTestId` es global**: por defecto busca `data-testid`. Cambiar
   `testIdAttribute` a `data-test` en el config (para SauceDemo) **rompe** los
   tests de TodoMVC (que usan `data-testid`). Por eso acá se usa el selector
   explícito `[data-test="..."]` en vez de tocar el config global.
