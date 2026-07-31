# Día 5 — Manejo de estado y datos ✅

**Objetivo:** tests aislados y rápidos.

## Del plan
- Fixtures propias.
- `storageState` para saltarse el login en cada test (crítico para velocidad).
- `beforeEach` / `afterEach` vs setup global.
- Aislamiento: cada test corre solo, en cualquier orden, en paralelo.

## Qué hay en esta carpeta
- [`state-and-data.spec.ts`](state-and-data.spec.ts) — **storageState** + **aislamiento**:
  un `beforeAll` hace login UNA vez y guarda la sesión en `.auth/user.json`; los
  tests la reusan con `test.use({ storageState })` y arrancan ya logueados. Tres
  tests prueban que cada uno corre en su propia burbuja (el carrito no se filtra).
- [`fixtures.ts`](fixtures.ts) — una **fixture propia** `loggedInPage` (extiende el
  `test` base) que entrega la página ya logueada.
- [`custom-fixtures.spec.ts`](custom-fixtures.spec.ts) — usa esa fixture: los tests
  no tienen ni una línea de login en el cuerpo.

## Conceptos clave
- **storageState = login una vez, reusar en todos.** La optimización de velocidad #1.
- **Aislamiento:** cada test tiene su propio contexto (como una ventana de incógnito
  nueva). Lo que hace uno no afecta a otro → orden libre y paralelismo seguros.
- **`beforeAll` vs `beforeEach`:** una vez por bloque vs. antes de cada test.
- **Fixture propia:** saca la "fontanería" (login, datos) del cuerpo del test.

## Seguridad
El `storageState` guarda **tokens de sesión** → `.auth/` está en `.gitignore`.
Nunca se commitea un archivo de sesión.

## Correr solo este día
```bash
npx playwright test day-5 --project=chromium
```
