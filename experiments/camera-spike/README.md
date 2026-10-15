# Living Atlas · isolierter G0-Raum

Dieses Experiment ist **nicht** der produktive Portfolio-Einstieg und baut keine der neun Welten als Attrappe. Seine drei neutralen Anker testen echte 3D-Weltkoordinaten, Kamera, Gesten, Abbruch, Rückkehr und DOM-Alternativen.

## Lokal reproduzieren

Node.js 24 verwenden. Von der Repository-Wurzel:

```sh
npm ci
npm run format:check
npm run build
npm test
```

Separater Kamera-Prototyp:

```sh
cd experiments/camera-spike
npm ci
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
npm run dev
```

Browser-Demo: `http://127.0.0.1:5174` (Vite Dev), `http://127.0.0.1:4174` nach `npm run preview`. Kein GitHub-Pages-Deploy des Experiments.

## Interaktionen

- **Links ziehen:** Kamera wirklich verschieben (Truck). **Rechts ziehen:** Kamera um denselben Blickpunkt drehen (Orbit). Der Desktop-E2E-Test prüft die Azimutänderung und dass das Ziel nicht verspringt.
- **Mausrad:** kontinuierlicher Dolly-Zoom. **Zwei-Finger-Pinch:** Zoom an der mobilen 3D-Bühne; **beide Finger gemeinsam verschieben:** Truck. Chromium-Playwright emuliert diese Gesten via CDP, prüft die echte 3D-Pose und verhindert unbeabsichtigten Seitenscroll.
- **Anker Signal, Verbindung, Kern:** Fokusfahrt zur echten Raumposition. **Zurück / Escape:** Wiederherstellung der **am Fokusbeginn gespeicherten** Kameraposition, Target, FOV, Zoom und Selektion; nicht die möglicherweise veraltete React-Anzeige während einer auslaufenden Wheel-Bewegung. Schnelles Ansteuern eines anderen Ankers unterbricht die vorherige Kamerafahrt.
- **Tastatur:** Tab/Enter für DOM-Ortsregister und Pfeiltasten zum Verschieben der Bühne. **Reduced Motion:** unmittelbare Positionswechsel. Ohne WebGL2 bzw. JavaScript bleiben Inhalte und Projektlinks im HTML lesbar.

## Nachweise und Grenzen

`tests/` enthält sechs unabhängige Node-Modelltests, `e2e/` Playwright-Desktop/Mobile/Keyboard/Scroll/Reduced-Motion/No-JS/No-WebGL/Axe. Der GitHub-Workflow `G0 camera spike verification` veröffentlicht Screenshots und Failure-Traces als Artefakt `g0-camera-browser-evidence` im jeweiligen Run; darunter `g0-desktop-focused.png` und `g0-mobile-focused.png`.

**Testumgebung:** GitHub Actions Ubuntu, Chromium mit SwiftShader (Software-WebGL), emulierter Pixel-5-Touch. Echte iOS-Safari-/Android-Chrome-Geräte, GPU-Leistung und FPS sind **nicht gemessen**. Screenshots belegen Bildaufbau, nicht alleine die Kamera-Funktionen; dafür gelten die Pose-/Gesture-Assertions.

Der Prototyp ist isoliert, kein Rollout. G1 beginnt erst nach expliziter Auftraggeber-Freigabe.
