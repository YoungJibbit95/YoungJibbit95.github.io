# G0 — QA-Matrix / Ergebnisstand

## Historische Baseline

- **ZIP SHA-256:** `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`.
- **Originaldateien:** 43/43 als identische Git-Blobs bei [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959) verifiziert; [Einzeldatei-SHA-256](./ORIGINAL_ZIP_MANIFEST.sha256).
- **Neun Prettier-Fehler:** Ausschließlich formatiert in [18873785](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/1887378555c9e31d18ae51f210fb28c8ffa4e563).
- **Temporäre Hilfsworkflows:** Wieder entfernt. Root- und G0-CI verwenden die bestehenden produktionsneutralen PR-Checks.

## Reproduzierbare grüne Ausgangsläufe

- **Website-Root:** [Run 37947749214](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749214) auf `255587d2`: `npm ci`, Formatcheck, TypeScript-/Vite-/Prerender-Build, **13 Playwright einschließlich Axe bestanden**.
- **3D-Kamera:** [Run 37947749259](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749259) auf `255587d2`: `npm ci`, **6 Unit-Tests**, Typecheck/Build, **14 Playwright bestanden und 6 absichtliche gerätespezifische Skips**, Axe.
- **Bilder und Traces:** [Screenshot-Artefakt 11624087986](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749259/artifacts/11624087986): Desktop- und Mobile-Fokusbilder. Screenshots belegen Framing, nicht allein die Interaktionsfunktion.
- **Abnahme des abschließenden Commits:** Nur zwei vollständig erfolgreich abgeschlossene GitHub-Actions-PR-Checks auf dem tatsächlichen Branch-HEAD zählen als G0 bestanden.

## Technische G0-Abnahmematrix

- **Kamera statt CSS-Scale:** Playwright prüft Pan/Truck, Dolly/Zoom, Fokus und Back anhand realer `position` und `target` aus CameraControls. Maximal 0.05 Welteinheiten Differenz zur gespeicherten Pose, ohne Test-Toleranzerhöhung.
- **Vollständige Rückkehr:** E2E prüft `position`, `target`, `fov`, `zoom` und `aria-pressed` nach Back. Ein anderer angewählter Fokus lässt sich per Back mit vorheriger Selektion wiederherstellen. Snapshot-Modell durch Unit-Tests abgesichert.
- **Unterbrechbare Fahrten:** Eine manuelle Geste überschreibt die Kamera; FlightToken schützt gegen verspätete ältere Timelines. Fokuswechsel während laufenden Wheel-Easings verwendet die reale Startpose.
- **Rechtsklick-Orbit:** E2E misst Azimutänderung über 0.08 rad bei Zielabweichung unter 0.2 Welteinheiten. Playwright bewegt die Maus tatsächlich innerhalb des sichtbaren Canvas.
- **Mobile Pinch und Truck:** Chromium-CDP-Simulation zweier Touchpunkte; Distanzänderung über 0.25, Target-Truck über 0.1, Seitenscroll im Gestenbereich unter 3 px. Emulation ist kein iOS-/Android-Gerätenachweis.
- **Accessible Content:** Tastatur Enter/Escape/Arrow, Reduced Motion, WebGL2-Fallback und No-JS, sichtbare DOM-Links. Root- und Kamera-Axe-Pfade gehören zu den Playwright-Checks.
- **Visuelle Komposition:** Artefakt umfasst Desktop und emuliertes Mobile; drei Anker sind räumlich lesbar. Performance/FPS auf echter GPU und Safari/iOS/Android bleiben ausdrücklich ungemessen.

**Stop-Regel:** Kein Merge nach `main`, keine G1-Implementierung ohne ausdrückliche Freigabe. Die regulären CI-Jobs müssen auf dem abschließenden HEAD grün sein.
