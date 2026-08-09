# Imagen oficial de Playwright: trae Node + los 3 navegadores + las librerías del
# sistema, atada a una versión de Playwright. IMPORTANTE: el tag debe coincidir con
# la versión de @playwright/test en package.json (acá 1.62.0) para que sea reproducible.
FROM mcr.microsoft.com/playwright:v1.62.0-noble

WORKDIR /app

# Copiamos primero los manifiestos e instalamos deps. Como cambian menos que los
# tests, Docker cachea esta capa y las builds siguientes son mucho más rápidas.
COPY package.json package-lock.json ./
RUN npm ci

# Ahora sí, el resto del proyecto.
COPY . .

# Por defecto corre toda la suite. Los navegadores YA están en la imagen, así que
# no hace falta `playwright install`.
CMD ["npx", "playwright", "test"]
