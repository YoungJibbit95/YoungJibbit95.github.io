# G0 — QA-Matrix und Nachweisregeln

## ZIP / CI

- **Bestanden:** alle 43 ZIP-Dateien waren am Commit `93a581ee` identisch zu den Upload-Bytes (Git-Blob-SHAs). Original-ZIP-SHA und Datei-SHA-256 im Manifest dokumentiert.
- **Bestanden im früheren Run:** `npm ci` am [Actions-Run 37939388290](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37939388290).
- **Fehlgeschlagen im früheren Run:** `npm run format:check` (neun Formatabweichungen).
- **Nicht ausgeführt im früheren Run:** Typecheck/Build/Playwright/Axe; keine grünen Ergebnisse behaupten.

## G0-Kameraprototyp — Abnahmekriterien

1. Echte Perspektiv-3D-Szene mit über den Bildausschnitt hinausliegenden Ankern, CameraControls und Weltkoordinaten.
2. Linker Maus-Drag ändert echte Kameraposition/Ziel. Rechter Drag ändert Azimut/Polwinkel. Wheel-Zoom kontinuierlich, begrenzt; Touch-Pinch überprüft.
3. Fokusfahrt verändert Kameraposition/Ziel; Back restauriert zuvor **tatsächlich** erkundete Pose und Selektion (mit Toleranzen wegen Control-Floating-Point).
4. Manuelle Geste während Flug stoppt alte Animation; kein späteres Überschreiben durch stale `await`.
5. Tab/Enter/Escape, sichtbare DOM-Hotspot-Liste, Reduced Motion, No-WebGL/No-JS bleiben benutzbar.
6. Playwright-Browser-Screenshots (Desktop und mobile Viewport), Page-Error-/Axe-Prüfung und Build ohne TypeScript-Fehler.
7. G0 nicht als bestanden markieren, bevor reproduzierbare Browser-Beweise dokumentiert sind.

**Kein `main`-Deploy, keine G1-Generalarchitektur ohne Freigabe.**
