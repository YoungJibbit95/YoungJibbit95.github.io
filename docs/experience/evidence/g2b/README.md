# Origin: echte Vergleichs- und Journey-Aufnahmen

2026-10-11. Alle PNGs stammen aus dem laufenden lokalen R3F-Canvas in Chromium.
Keine Bildgenerierung, Retusche oder zusammengesetzten Website-Mockups.
Die automatischen Abnahmen verwenden Chromium/SwiftShader und emulierte Viewports,
keine gemessenen echten Smartphones. Aufnahme nach SceneReady und geladenen Fonts.

## Designvergleich

- Ausgang: `../g2a/g2a-origin-1440-quiet.png`, `../g2a/g2a-origin-390.png`.
- `study-archive-{1440,390}.png`: vertikales Faltarchiv mit Terrassen und Wandblättern.
- `study-floating-{1440,390}.png`: horizontal gedrehte, filigrane Seiten ohne Boden.
- Jeweils `-open.png`: tatsächlich ausgeführter erster Signalschritt.

Die Studien wurden mit `.verification/capture-studies.mjs` gegen Vite Dev erzeugt:
vertikale Rotation `[0.06,-0.38,-0.22]`, Lamellenstärke 0.5, Architektur aktiv;
Alternative `[0.25,-0.4,1.2]`, Stärke 0.22, Architektur aus. Der temporäre
Studienparameter ist aus der Runtime entfernt. Die gewählte Architektur wurde
anschließend in Wandposition, Helligkeit und instanzierten Lamellenfarben verfeinert.

## Finaler G2-B-Zustand

- `g2b-origin-{320,390,768,1440,1920}.png`: Übersicht und zugehörige `-signal.png`.
- `g2b-origin-1440-{quiet,open,horizon}.png`: gleiche Kamera, drei Graphzustände.
- `g2b-paused-1440.png`, `g2b-complete-1440.png`: echte Pause und automatisches Ende.
- `g2b-complete-390.png`, `g2b-reset-390.png`: vollständige Kette und Reset.
- `g2b-focus-{signal,relation,horizon}-390.png`: drei tatsächliche mobile Kameraposen.
- `g2b-transition-390.png`: Zielwelt nach explizitem Übergang, weiterhin der G1-Prototyp.

Reproduktion: `npm run build`, danach `npx playwright test tests/origin.spec.ts
tests/origin-journey.spec.ts --workers=1`. Dateien entstehen in `test-results/`;
die älteren Origin-Testnamen heißen aus Kontinuitätsgründen noch `g2a-*` und wurden
beim Archivieren in diesem Verzeichnis in `g2b-*` umbenannt. Keine Pixeländerung.
Die Prüfungen maskieren DOM-Overlays vor Canvas-Pixelvergleichen. Der Pause-Test
vergleicht gerenderte Frames während einer gesamten pausierten Verweildauer.

`skill-discovery.json`: tatsächliche Codex-Neuerkennung und normalisierte SHA256,
alle sechs Installationen stimmen mit den geprüften Quellen überein.
`lighthouse-comparison.json`: mobile Laborwerte vor/nach dem gezielten Ladepfad-Fix;
verbleibende Performance-Schwäche ausdrücklich im G2-B-Review beschrieben.
