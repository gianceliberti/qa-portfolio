# Día 10 — CI/CD con GitHub Actions ⚪

- Workflow básico: trigger en push/PR, matriz de browsers, caché de deps.
- Artefactos: subir reportes HTML y trazas de fallos.
- Sharding: dividir la suite en N runners paralelos.
- Retries y detección de flakiness.
- Quality gates: bloquear el merge si falla la suite.

> Ya hay un workflow base en `.github/workflows/playwright.yml` (del Día 1).
