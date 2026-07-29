#!/usr/bin/env bash
#
# Atajos para el proyecto qa-portfolio
# ------------------------------------
# Uso:
#   ./atajos.sh ui       → abre Playwright en modo UI (para estudiar los tests
#                          paso a paso, con "time travel" y capturas por acción)
#   ./atajos.sh report   → sirve y abre en el navegador el reporte HTML del
#                          último run (screenshots, videos y trazas de fallos)
#
# La primera vez, dale permiso de ejecución:  chmod +x atajos.sh
#

set -e                          # si algo falla, cortá el script
cd "$(dirname "$0")"            # pararse siempre en la carpeta del proyecto

case "$1" in
  ui)
    echo "▶ Abriendo Playwright UI mode…"
    npx playwright test --ui
    ;;
  report)
    echo "▶ Sirviendo y abriendo el reporte HTML…"
    npx playwright show-report
    ;;
  *)
    echo "Uso: ./atajos.sh [ui|report]"
    echo "  ui      → Playwright UI mode (estudiar los tests paso a paso)"
    echo "  report  → abrir el reporte HTML del último run"
    exit 1
    ;;
esac
