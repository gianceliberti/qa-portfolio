# Día 7 — Datos de prueba ✅

**Objetivo:** generar datos de test bien, y preparar el estado sin clickear.

## De dónde salen los datos — 4 estrategias

| Estrategia | Qué es | Cuándo |
|-----------|--------|--------|
| **Factories** | Funciones que fabrican objetos con Faker + overrides | Tu herramienta diaria (lo más flexible) |
| **Fixtures** | Datos fijos preparados (JSON, usuario semilla) | Datos estables y compartidos |
| **Seeds** | Poblar la DB con un script antes de correr | Estado inicial de toda la suite |
| **API setup** | Crear datos llamando a la API, no por UI | Necesitás datos existentes para probar otra cosa |

## Qué hay en esta carpeta

- [`factories.ts`](factories.ts) — factories con **Faker**: `makeCustomer()` y
  `makeBooking()`. Patrón: valores aleatorios por defecto + `overrides` para
  fijar lo que el test necesita controlar.
- [`1-faker-checkout.spec.ts`](1-faker-checkout.spec.ts) — test **data-driven**:
  el checkout de SauceDemo se llena con un cliente sintético. Cada corrida usa
  datos distintos; cero datos reales hardcodeados.
- [`2-api-setup.spec.ts`](2-api-setup.spec.ts) — **setup vía API**: crear →
  verificar → limpiar, contra una API CRUD real (restful-booker).

## Principios clave

**Datos sintéticos (Faker):** en vez de `"Jane Doe"`, generás nombres/emails/
fechas realistas al vuelo. Detectás bugs que un dato fijo esconde y nunca metés
datos reales al repo.

**Setup vía API, verificación vía UI:** si necesitás 40 registros para probar un
filtro, **no los crees clickeando**. Creá por API (rápido y confiable) y usá la
UI solo para lo que estás probando.

**Idempotencia y limpieza:** lo que un test crea, lo borra. Así corre igual la 1ª
y la 100ª vez, sin dejar basura ni depender de corridas anteriores.
> En un proyecto real, el cleanup va en un `afterEach`/fixture para que corra
> **aunque el test falle** a la mitad.

## Correr
```bash
npx playwright test day-7 --project=chromium
```
