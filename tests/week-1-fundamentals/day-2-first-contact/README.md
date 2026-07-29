# Día 2 — Playwright: primer contacto ✅

**Objetivo:** entender la estructura generada y escribir los primeros tests
contra un sitio público de práctica.

## Del plan
- `npm init playwright@latest`. Entender la estructura generada.
- `playwright.config.ts`: projects, browsers, baseURL, retries, reporters, timeouts.
- Escribir 5 tests contra un sitio público (`saucedemo.com`, `the-internet`, etc.).

## Qué hay en esta carpeta
- [`first-contact.spec.ts`](first-contact.spec.ts) — 7 ejercicios sobre SauceDemo,
  resueltos y comentados línea por línea: login, camino negativo (usuario
  bloqueado), add-to-cart, ordenar por precio, y la lección del **"verde falso"**
  (`isVisible()` dentro de `expect()` vs. aserción web-first).
- [`saucedemo-login.spec.ts`](saucedemo-login.spec.ts) — login de SauceDemo con
  **Page Object** ([`pages/login.page.ts`](pages/login.page.ts)).
- [`todomvc.spec.ts`](todomvc.spec.ts) — flujos de TodoMVC con Page Object
  ([`pages/todo.page.ts`](pages/todo.page.ts)).

## Conceptos clave estudiados
- Anatomía de un test: `test()` / `expect()`, patrón **Arrange–Act–Assert**.
- `playwright.config.ts` a fondo: **retries** (0 local / 2 CI), los **3 timeouts**
  (test 30s, expect 5s, global), **trace** `on-first-retry`, **projects**.
- `baseURL` para usar rutas relativas.

## Correr solo este día
```bash
npx playwright test day-2 --project=chromium
```
