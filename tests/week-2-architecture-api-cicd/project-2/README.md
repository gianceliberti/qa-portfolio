# Proyecto 2 — Arquitectura completa + API + CI

Consolidación de la Semana 2: una suite **UI + API** con arquitectura de framework
de verdad, corriendo en un **pipeline verde** (badge en el README raíz).

## Arquitectura

```
project-2/
├── factories.ts        Faker (Día 7): makeCustomer, makeBooking
├── pages/              Page Objects, SIN assertions (Día 6): inventory, checkout
├── fixtures.ts         Fixtures compuestas (Día 6 + Día 5): login 1×/worker con
│                       storageState + Page Objects inyectados sobre la página logueada
├── api.ts              Cliente de API + getAuthToken (Día 8)
└── tests/
    ├── ui.spec.ts      UI E2E: piden inventoryPage/checkoutPage + datos de factory
    └── api.spec.ts     API: contract → ciclo de vida (create/update/delete/verify) → auth
```

## Decisiones de diseño
- **Fixtures compuestas**: el test pide `inventoryPage`, `checkoutPage` y los recibe
  **ya logueados y construidos**. El cuerpo del test no tiene login ni `new POM()` —
  solo la intención. Esa es la "arquitectura completa".
- **storageState 1×/worker**: el login caro se hace una vez por proceso paralelo.
- **Page Objects sin assertions**: actúan; los tests verifican (la regla del Día 6).
- **Factories con Faker**: datos sintéticos, distintos cada corrida; `overrides` para
  fijar lo que el caso necesita (ej. `makeCustomer({ postalCode: "" })` para el negativo).
- **UI + API en un proyecto**: la misma factory alimenta el checkout de UI y los
  payloads de la API.

## Qué se cubre
- **UI** (2): compra end-to-end feliz; checkout con campo obligatorio faltante (negativo).
- **API** (3): contract (status/headers/forma); ciclo de vida completo con auth;
  rechazo sin token (403).
- **3 navegadores** × **CI con sharding** (Día 10) + **Docker** (Día 9).

## Correr
```bash
npx playwright test project-2                    # 3 navegadores
npx playwright test project-2 --project=chromium # rápido
```

## CI
El [badge del README raíz](../../../README.md) refleja el estado del pipeline
([workflow](../../../.github/workflows/playwright.yml)): 3 shards en paralelo +
fusión de reportes, en cada push/PR.
