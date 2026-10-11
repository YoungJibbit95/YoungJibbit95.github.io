# G0 — QA-Matrix / Ergebnisstand

## Historische Baseline

- **ZIP SHA-256:** `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`.
- **Originaldateien:** 43/43 als identische Git-Blobs bei [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959) verifiziert; [Einzeldatei-SHA-256](./ORIGINAL_ZIP_MANIFEST.sha256).
- **Neun Prettier-Fehler:** Ausschließlich formatiert in [18873785](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/1887378555c9e31d18ae51f210fb28c8ffa4e563).
- **Temporäre Hilfsworkflows:** Wieder entfernt. Root- und G0-CI verwenden die bestehenden produktionsneutralen PR-Checks.

## Verifizierter grüner G0-Code-Stand

- **Website-Root:** [Run 37951732950](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732950) auf `79ec6fbe`: `npm ci`, Formatcheck, TypeScript-/Vite-/Prerender-Build, **13 Playwright einschließlich Axe bestanden**.
- **3D-Kamera:** [Run 37951732921](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732921) auf `79ec6fbe`: `npm ci`, **6 Unit-Tests**, Typecheck/Build, **16 Playwright bestanden und 8 absichtliche gerätespezifische Skips**, Axe.
- **Bilder und Traces:** [Screenshot-Artefakt 11625819236](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732921/artifacts/11625819236): Desktop- und Mobile-Fokusbilder. Screenshots belegen Framing, nicht allein die Interaktionsfunktion.
- **Endgültige Abnahme:** Der Code-Commit `79ec6fbe` ist grün. Nach diesem Dokumentationscommit müssen beide vollständigen PR-Checks auf dem neuen HEAD ebenfalls erfolgreich sein.

- **Regression:** Separater Pose-/Selektions- und Touch-Scroll-Test; Desktop-Pan ist über die sichtbare Canvas synchronisiert. Keine Erhöhung von Pose-Toleranzen.

## Technische G0-Abnahmematrix

- **Kamera statt CSS-Scale:** Playwright prüft Pan/Truck, Dolly/Zoom, Fokus und Back anhand realer `position` und `target` aus CameraControls. Maximal 0.05 Welteinheiten Differenz zur gespeicherten Pose, ohne Test-Toleranzerhöhung.
- **Vollständige Rückkehr:** E2E prüft `position`, `target`, `fov`, `zoom` und `aria-pressed` nach Back. Ein anderer angewählter Fokus lässt sich per Back mit vorheriger Selektion wiederherstellen. Snapshot-Modell durch Unit-Tests abgesichert.
- **Unterbrechbare Fahrten:** Eine manuelle Geste überschreibt die Kamera; FlightToken schützt gegen verspätete ältere Timelines. Fokuswechsel während laufenden Wheel-Easings verwendet die reale Startpose.
- **Rechtsklick-Orbit:** E2E misst Azimutänderung über 0.08 rad bei Zielabweichung unter 0.2 Welteinheiten. Playwright bewegt die Maus tatsächlich innerhalb des sichtbaren Canvas.
- **Mobile Pinch und Truck:** Chromium-CDP-Simulation zweier Touchpunkte; Distanzänderung über 0.25, Target-Truck über 0.1, Seitenscroll im Gestenbereich unter 3 px. Emulation ist kein iOS-/Android-Gerätenachweis.
- **Accessible Content:** Tastatur Enter/Escape/Arrow, Reduced Motion, WebGL2-Fallback und No-JS, sichtbare DOM-Links. Root- und Kamera-Axe-Pfade gehören zu den Playwright-Checks.
- **Visuelle Komposition:** Artefakt umfasst Desktop und emuliertes Mobile; drei Anker sind räumlich lesbar. Performance/FPS auf echter GPU und Safari/iOS/Android bleiben ausdrücklich ungemessen.

**Stop-Regel:** Kein Merge nach `main`, keine G1-Implementierung ohne ausdrückliche Freigabe. Die regulären CI-Jobs müssen auf dem abschließenden HEAD grün sein.

## G1 — Finaler visueller und technischer Nachweis

- **Quelle:** Der G0-ZIP-Restore am Commit `93a581ee` bleibt nachvollziehbar; die G1-Preview ist opt-in, `main` unverändert.
- **Schwarzer Desktop-Canvas behoben:** Der alte 1440px-Screenshot (CI `37959533980`) zeigte eine zu 99,31 % schwarze Observatory-Bühne im vergleichbaren inneren Ausschnitt. Neue Renderinvalidierung bei Lazy-Scene-Mount und Resize, Ready-Signal **nach fortgeschrittenem Renderer-Frame**.
- **Pixel-Test statt DOM-Existenz:** `tests/experience.render.spec.ts` prüft 390/1440px für Origin und Observatory, mindestens 35 sichtbare farbige Pixel plus sechs Farbtöne aus einer auf 240 × 150 skalierten echten Canvas-Aufnahme; mehrfacher Weltwechsel, exakt ein Canvas und Context-Loss-Fallback. Dadurch wird ein schwarzes Bild auch bei bestehender Canvas-Node abgewiesen.
- **Visuell geprüft:** 3 perspektivische Anker, Verbindungslinien, Grid und DOM-Steuerung auf Desktop/Mobile; [Screenshotartefakt](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277487/artifacts/11675719143).
- **Nexus-GSAP:** Große Medien und Kontextknoten werden räumlich animiert, nicht halbtransparent stehen gelassen; interaktive Kapitelnavigation bleibt während Scroll-Reveals stabil. Motion-Off entfernt temporäre GSAP-Opacity/Transforms.
- **Reduced Motion:** Der ursprüngliche Provider speichert `off` bereits in `localStorage`; kein reproduzierbarer Fachfehler der Zustandspersistenz. CI-Browserparallelität wegen SwiftShader/GSAP-CPU-Konflikt auf einen Worker reduziert; keine Test-/Timeout-Lockerung.
- **Historische CI:** [Root 38069277487](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277487) wurde nach erfolgreicher erster Testdurchführung insgesamt `cancelled` und gilt nicht als finaler Gate-Nachweis. [G0 38069277355](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277355) war erfolgreich.
- **Erneut nachzuweisen:** Erfolgreicher CI-Status auf dem abschließenden Dokumentations-HEAD; der wiederholte Root-Job darf erst nach seiner Beendigung als Bestätigung zählen.
- **Manuell offen:** iOS Safari, Android Chrome auf echter Hardware und FPS/Temperatur/GPU-Profiling; keine erfundenen Messwerte.
- **Grenze:** Noch kein G2-/G3-Ausbau und kein Merge/Deploy. G2 benötigt danach die vollständige Original-/Observatory-Welt anstelle der beiden räumlichen Prüfstände.

## G1 Recovery — verifizierte Ursachen, Stresstest und Release-Gate

- **Mehrfach-Weltwechsel-Fehler:** Der Playwright-Trace aus [Root 38070923966](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38070923966), Artefakt `11677251120`, zeigt ein hängendes `locator.screenshot()`: automatischer Scroll-to-view wartet auf stabile Elementposition. `observatory` war bereits als `scene-ready` bestätigt, aber die Screenshot-Aktion lieferte **keine Pixelaufnahme** zurück. Deshalb ist dieser konkrete Fehler kein Nachweis eines schwarzen WebGL-Frames.
- **Korrektur:** Explizites sofortiges Scrollen des Canvas in den sichtbaren Viewport, Überprüfung des Viewport-Rechtecks, danach viewportweite Playwright-Screenshot-Aktion ohne Element-Autoscroll. Bildpixel werden anhand der tatsächlichen Canvas-Koordinaten (ohne UI-Beschriftung) extrahiert.
- **Unveränderte Bildschranken:** `lit > 35` und `shades > 6` auf einem 240 × 150 Sample; kein Ersatz durch bloße DOM-Sichtbarkeit. Die vier Einzelbilder 390/1440px für Origin und Observatory bleiben Pflicht.
- **Zusatzabdeckung:** Origin → Observatory → Origin → Observatory mit einem Canvas, Browser Back/Forward, reduzierte Bewegung, Resize, unterbrochener Kameraflug, Context-Loss-Fallback, Keyboard/Touch sowie semantische No-JS-/Projektpfade.
- **Stabilität auf [Code-Commit 7224ee72](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/7224ee72b04c5729cecb10c904834fc9c07c6b24):** [Root 38099225046](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38099225046) vollständig `success`: `npm ci`, Prettier, 4 Unit, TypeScript, Vite/Prerender, **33 Root-Browser-/Axe-Tests** und **3/3 Wiederholungen** des kritischen Weltwechseltests. [G0 38099225091](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38099225091) auf demselben Commit `success`.
- **Screenshot-Aufbewahrung:** Der zweite Playwright-Aufruf löschte zunächst das gemeinsame `test-results/`-Verzeichnis, wodurch der erfolgreiche Run `38099225046` keine Screenshot-Artefakte mehr hochladen konnte. [b83ba399](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/b83ba399150b85bfe67a56456750a0bdabff8beb) benutzt einen separaten Stress-Outputordner. Frische Artefakte und vollständige Checks müssen auf dem finalen Dokumentations-HEAD geprüft werden.
- **Keine Abkürzungen:** Keine Erhöhung der Testtimeouts, keine Reduzierung der Pixelgrenzen, keine deaktivierten Tests, kein erneuter ZIP-Restore, kein G2-/G3-Ausbau.
- **Noch offen:** Reale iOS-/Android-Geräte, GPU-/FPS-/Thermal-Messungen, abschließende Art Direction einzelner Welten.
- **G1-Freigabe-Regel:** Beide Actions-Jobs und vier echte Desktop-/Mobile-Screenshots auf exakt demselben finalen Commit müssen erfolgreich/zugänglich sein. Nur dann G1 als technisch bestanden dokumentieren; `main` und öffentliche Website bleiben unverändert.
