# Día 10 — CI/CD con GitHub Actions ✅

**Objetivo:** que la suite corra sola en cada push/PR, rápida y con reportes.

## El workflow
Está en [`.github/workflows/playwright.yml`](../../../.github/workflows/playwright.yml).
Mejora el básico del Día 1 con el patrón profesional de **sharding + fusión**:

```
push / PR
   │
   ├─ job "test"  →  3 shards EN PARALELO (matrix: 1/3, 2/3, 3/3)
   │                 cada uno corre su tercio y sube su "blob"
   │
   └─ job "report" (needs: test)
                   →  descarga los 3 blobs y los fusiona en UN reporte HTML
```

## Conceptos aplicados

| Concepto | Dónde, en el workflow |
|----------|------------------------|
| **Trigger** | `on: push / pull_request` a `main` |
| **Caché de deps** | `actions/setup-node` con `cache: npm` |
| **Sharding** | `strategy.matrix.shard: [1,2,3]` + `--shard=${{ matrix.shard }}/3` |
| **Artefactos** | `upload-artifact` (blobs por shard + reporte HTML final) |
| **Retries / flakiness** | `retries: 2` en CI (en `playwright.config.ts`) |
| **Reporter blob → HTML** | blob en CI + `merge-reports --reporter html` |

## Quality gate (bloquear merge si falla)
El workflow ya **falla** si la suite falla. Para que eso **bloquee el merge** de un
PR, se activa *branch protection* en GitHub (Settings → Branches → Require status
checks to pass). Así nadie mergea código que rompe los tests.

## Cómo verlo en acción
Al hacer push, andá a la pestaña **Actions** del repo en GitHub: vas a ver los 3
shards corriendo en paralelo y luego el job de fusión. El reporte HTML queda como
**artefacto descargable** en la corrida.

> Verificado localmente simulando CI (3 shards → 3 blobs → fusión = 54 tests en un
> reporte). En GitHub corre igual, pero en 3 máquinas de verdad.

## Badge de CI (para el README)
```markdown
![Playwright Tests](https://github.com/gianceliberti/qa-portfolio/actions/workflows/playwright.yml/badge.svg)
```
