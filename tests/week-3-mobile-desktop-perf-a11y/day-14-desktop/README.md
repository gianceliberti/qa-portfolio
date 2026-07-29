# Día 14 — Desktop: tu diferenciador real ⚪

**Tu nicho.** Casi nadie automatiza desktop, y ya trabajás con un cliente a custom UI toolkit.

- WinAppDriver está muerto para proyectos nuevos. No aprenderlo.
- Appium Windows Driver / NovaWindows Driver — reemplazo moderno sobre UI Automation (UIA).
- FlaUI — mejor librería .NET sobre UIA si el equipo es C#.
- SikuliX — reconocimiento de imagen (OpenCV + OCR). Fallback sin árbol de accesibilidad.

⚠️ **the app (a custom UI toolkit):** dibuja sus propios widgets y suele NO exponer un árbol
UIA usable. Camino real: image-based + OCR (SikuliX) o automatizar por debajo de la UI
(backend/protocolo, o hooks desde the toolkit).

**Experimento de 2h antes de invertir días:** abrí el cliente con Appium Inspector o
Accessibility Insights for Windows. ¿Widgets reales o canvas opaco? La respuesta define
la estrategia. Canvas → SikuliX/hooks. Widgets → NovaWindows Driver.
