# Día 9 — Docker ✅

**Objetivo:** que los tests corran **igual** en tu máquina y en CI.

## El problema: "en mi máquina funciona"
Los tests pueden pasar en tu Mac y fallar en CI por diferencias sutiles: otra
versión de Node, otro navegador, una librería del sistema que falta. Docker
empaqueta **todo** (SO + Node + navegadores + dependencias) en un **contenedor**
que corre idéntico en cualquier lado.

## Los archivos (en la raíz del repo)
- [`Dockerfile`](../../../Dockerfile) — la receta de la imagen. Parte de la imagen
  oficial de Playwright (`mcr.microsoft.com/playwright`), que ya trae los 3
  navegadores + librerías del sistema. Instala deps con `npm ci` y corre la suite.
- [`.dockerignore`](../../../.dockerignore) — qué NO copiar al contenedor
  (`node_modules`, reportes, `.auth`…). Evita copiar basura o cosas del host.
- [`docker-compose.yml`](../../../docker-compose.yml) — orquesta el servicio de
  tests con un comando; incluye (comentado) cómo sumar app + DB para un stack local.

## Conceptos clave
- **Imagen** = la plantilla (SO + herramientas). **Contenedor** = una instancia
  corriendo de esa imagen.
- **El tag de la imagen debe coincidir** con tu versión de Playwright
  (`v1.62.0-noble`) → reproducibilidad real.
- **Cacheo de capas:** copiar `package.json` e instalar deps ANTES del resto hace
  que las builds siguientes sean rápidas (Docker reusa la capa de deps).
- **No necesitás ser experto en Docker.** Necesitás que tu suite corra en un
  entorno reproducible.

## Cómo construir y correr
Requiere Docker Desktop **abierto** (el daemon corriendo).

```bash
# Opción 1 — build + run directo
docker build -t qa-portfolio .
docker run --rm qa-portfolio

# Opción 2 — con compose (build + run en un comando)
docker compose up --build
```
La imagen ya trae los navegadores, así que dentro del contenedor **no** hace falta
`npx playwright install`.
