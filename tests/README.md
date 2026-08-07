# QA Automation — Roadmap de 30 días

Plan de transición de QA manual a automatización (SDET). Cada carpeta es un día
del plan, con su objetivo y —cuando está hecho— el código comentado.

## Progreso

| Semana | Foco | Estado |
|--------|------|--------|
| [Semana 1](week-1-fundamentals/) | TypeScript + Playwright fundamentals | ✅ completa (Días 1–5 + Proyecto 1) |
| [Semana 2](week-2-architecture-api-cicd/) | Arquitectura de framework, API y CI/CD | 🟡 en curso (Días 6–8 ✅) |
| [Semana 3](week-3-mobile-desktop-perf-a11y/) | Mobile, Desktop, Performance, Accesibilidad | ⚪ pendiente |
| [Semana 4](week-4-ai-senior-market/) | IA en testing + capa senior + mercado | ⚪ pendiente |

## Días completados

- ✅ **Día 1** — [Setup](week-1-fundamentals/day-1-setup/)
- ✅ **Día 2** — [Primer contacto con Playwright](week-1-fundamentals/day-2-first-contact/)
- ✅ **Día 3** — [Locators](week-1-fundamentals/day-3-locators/)
- ✅ **Día 4** — [Debugging y trazas](week-1-fundamentals/day-4-debugging/)
- ✅ **Día 5** — [Manejo de estado y datos](week-1-fundamentals/day-5-state-and-data/)
- ✅ **Día 6** — [Page Object Model y alternativas](week-2-architecture-api-cicd/day-6-page-object-model/)
- ✅ **Día 7** — [Datos de prueba](week-2-architecture-api-cicd/day-7-test-data/)
- ✅ **Día 8** — [API testing como código](week-2-architecture-api-cicd/day-8-api-testing/)

## Cómo correr los tests

```bash
npx playwright test                       # toda la suite, 3 browsers
npx playwright test --project=chromium    # solo chromium (más rápido)
npx playwright test day-3                  # filtra por ruta (ej. Día 3)
./atajos.sh ui                             # modo UI para estudiar
./atajos.sh report                         # reporte HTML
```
