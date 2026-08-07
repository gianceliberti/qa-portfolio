# Día 14 — Desktop automation ⚪

Nicho de alto valor: casi nadie automatiza aplicaciones de escritorio, así que es
un diferenciador fuerte.

- WinAppDriver está muerto para proyectos nuevos. No aprenderlo.
- Appium Windows Driver / NovaWindows Driver — reemplazo moderno sobre UI Automation (UIA).
- FlaUI — mejor librería .NET sobre UIA si el equipo es C#.
- SikuliX — reconocimiento de imagen (OpenCV + OCR). Fallback cuando no hay árbol de accesibilidad.

⚠️ **Apps con UI dibujada a medida:** algunos frameworks pintan sus propios widgets y
NO exponen un árbol UIA usable. En esos casos el camino es image-based + OCR (SikuliX),
o automatizar por debajo de la UI (llamar al backend/protocolo, o hooks del propio toolkit).

**Experimento de 2h antes de invertir días:** abrí la app con Appium Inspector o
Accessibility Insights for Windows. ¿Widgets reales o canvas opaco? La respuesta define
la estrategia. Canvas → SikuliX/hooks. Widgets → NovaWindows Driver.
