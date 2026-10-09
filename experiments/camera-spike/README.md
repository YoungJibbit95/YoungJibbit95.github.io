# Living Atlas · isolierter G0-Raum

Dieses Experiment ist **nicht** der produktive Portfolio-Einstieg und baut keine der neun Welten als Attrappe. Seine drei neutralen Anker testen reale Weltkoordinaten, Kamera, Gesten, Abbruch, Rückkehr und DOM-Alternativen.

**Lokal mit Node 24 und installiertem Playwright Chromium:**

```sh
cd experiments/camera-spike
npm ci
npm run typecheck
npm run build
npm run test:unit
npx playwright install chromium
npm run test:e2e
npm run dev
```

Die Demo liegt unter `http://127.0.0.1:5174` (Entwicklungsmodus) beziehungsweise `http://127.0.0.1:4174` nach `npm run preview`. Sie ist vom Root-Build entkoppelt; es gibt **keine Veröffentlichung auf GitHub Pages**.

## Direkt ausprobieren

- Drag mit der linken Maustaste verschiebt die echte Kamera; rechte Maustaste rotiert um den Blickpunkt.
- Wheel / Touch-Pinch zoomt stufenlos innerhalb der Kamera-Grenzen.
- Signal, Verbindung oder Kern anklicken; eine Fokusfahrt verändert Kamera und Ziel, nicht ein CSS-Scale.
- Während des Flugs eine Geste auslösen: die laufende Fahrt endet. Zurück restauriert die unmittelbar vor dem Fokus eingefrorene Pose.
- Tab erreicht das DOM-Ortsregister, Enter fokussiert. Escape führt zurück; über die fokussierte Bühne bewegen die Pfeiltasten die Kamera.
- Reduced Motion ist über Betriebssystem oder Checkbox steuerbar; bei fehlendem WebGL2 und deaktiviertem JavaScript bleiben Links und Inhalte verfügbar.
- Unter `tests/` und `e2e/` liegen Unit-/Browser-/A11y-Checks. Die Browser-Suite speichert Screenshot-Artefakte in `test-results/` auf CI.

**G0-Freigabe:** Nur mit grünem Root-CI und grünem isolierten Build/E2E sowie geprüftem Browsernachweis, nicht anhand dieser README.
