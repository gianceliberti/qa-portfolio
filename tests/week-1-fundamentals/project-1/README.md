# Proyecto 1 — Suite E2E de SauceDemo ✅

Suite end-to-end que consolida la Semana 1: **17 tests** sobre
[saucedemo.com](https://www.saucedemo.com), corriendo en **3 navegadores**
(Chromium, Firefox, WebKit) = 51 ejecuciones verdes.

> **App bajo prueba:** SauceDemo (e-commerce demo). Elegida porque cubre los
> mismos flujos que un producto real —autenticación, catálogo con filtros,
> carrito y checkout con validaciones— y es estable para automatizar. La misma
> arquitectura se re-apunta a otra app cambiando el `baseURL` y los Page Objects.

## Arquitectura

```
project-1/
├── pages/            Page Object Model — un objeto por pantalla.
│                     Exponen locators + acciones; SIN assertions adentro.
├── fixtures/         auth.fixture.ts — login 1×/worker con storageState.
└── tests/            specs agrupados por feature (login, catálogo, carrito, checkout).
```

Decisiones de diseño:
- **Locators por rol/label/testId** (no CSS frágil). Sobreviven a cambios de estilo.
- **Page Object Model** sin assertions dentro: el POM dice *cómo* interactuar,
  los tests dicen *qué* se espera. Reutilizable y legible.
- **storageState por worker**: el login se hace una sola vez por proceso paralelo
  y se reutiliza. Los tests de features arrancan ya logueados → suite rápida.
- **Aislamiento**: cada test tiene su propio contexto; corren en paralelo y en
  cualquier orden sin pisarse.
- **Datos ficticios** en el checkout (Jane Doe / 12345), nunca datos reales.

## Qué se testeó y por qué (enfoque risk-based)

Prioricé por **impacto × probabilidad de fallo**, no por cantidad. Más peso en
los caminos negativos, que es donde viven los bugs.

| Área | Casos | Por qué estos |
|------|-------|---------------|
| **Login** (4) | válido; contraseña incorrecta; usuario bloqueado; formulario vacío | La puerta de entrada: si falla, todo lo demás es inaccesible. 3 de 4 son caminos negativos (permisos y validación). |
| **Catálogo** (6) | 6 productos visibles; 4 ordenamientos (A→Z, Z→A, precio ↑, precio ↓); agregar/quitar del carrito | Los filtros son lógica de negocio fácil de romper en un refactor. Verifico el **orden real de la colección**, no solo que "algo cambió". |
| **Carrito** (3) | ítems agregados aparecen; quitar ítem; seguir comprando | El estado entre pantallas es propenso a errores; valido que lo que agrego es lo que veo. |
| **Checkout** (4) | happy path completo hasta confirmación; 3 validaciones de campos obligatorios | Es donde el usuario "paga": el happy path debe funcionar y los errores deben guiar. |

Lo que **conscientemente no** automaticé (y por qué): estilos/CSS puro (frágil,
bajo valor), y los usuarios `problem_user`/`performance_glitch_user` (útiles para
exploración manual, pero sus fallos visuales/temporales dan tests inestables).

## Cómo correr

```bash
npx playwright test project-1                    # 3 navegadores
npx playwright test project-1 --project=chromium # solo chromium (rápido)
npx playwright test project-1 --ui               # modo UI para estudiar
```

## Conceptos de la Semana 1 aplicados
Locators robustos (Día 3) · debugging con trace/`test.step()` (Día 4) ·
storageState, fixtures y aislamiento (Día 5) · Page Object Model · 3 navegadores.
