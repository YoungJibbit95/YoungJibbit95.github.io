# G2-D Performance — isolierter Bootstrap-Vergleich

**Empfehlung: weltbezogene statische Einstiege integrieren; Performance insgesamt
weiter PARTIAL nennen.** HTML/CSS-Bootstrap und tatsächliche 3D-Bereitschaft wurden
messbar schneller. Eine entdeckte Observatory-CLS-Regression wurde mit passendem
SSR-Weltzustand behoben. Die Messungen verwenden unveränderte G2-C-Szenen; das
anschließend vom Nutzer gewählte Design B benötigt eine eigene integrierte Messung.

## Revisionen und Änderung

Baseline: `c2e338cf723f1ec6e20b4493175a8783ac95b405`.
Worktree: `F:/Coding/atlas-g2d-performance`, Branch `codex/g2d-performance`.

- `6bb3430`: statischer Atlas-Einstieg, SSR und getrennte Styles.
- `8e928d9`: gemeinsame Einstiegspfad-Logik auch für native Explorer-Projektlinks.
- `bc52793`: statischer Observatory-Einstieg mit korrekter erster Welt.

`/atlas/` und `/atlas/observatory/` liefern dieselbe semantische `ExperienceRoot`
mit sieben geprüften Projektartikeln und Quellen schon als HTML aus. Root-URLs
wie `/?atlas=preview&world=observatory` bleiben funktionsfähig; sie werden nicht
umgeleitet und erhalten dadurch nicht automatisch denselben Bootstrap-Vorteil.
Neue native Atlas-Links verwenden den zur Zielwelt passenden statischen Pfad.

Das Portfolio-Dokument umfasst im ersten Kandidatenbuild 145.038 Bytes; die
abschließenden statischen Dokumente 11.137 Bytes für Origin und 11.225 Bytes für
Observatory. Die Einstiegsmodule laden Atlas-Styles und bestehende Schriften,
keine Legacy-Oberflächen-Styles. Three/R3F bleibt hinter der bestehenden lazy
Canvas-Grenze. Keine Weltgeometrie, Qualitätsstufe, Kamera oder Testschwelle wurde
reduziert. Ein Store, SceneDirector und persistenter Canvas bleiben erhalten;
keine neue Runtime-Dependency.

## Messbedingungen

Erstes exklusives Ruhefenster: **24 Läufe**, zwei Welten × zwei Varianten × drei
Wiederholungen × Lighthouse und separate reale CDP-Messung. Nach SSR-Reparatur:
**12 weitere Läufe**, Observatory erneut gegen dieselbe Baseline. Art-, QA- und
Lead-Browser sowie Builds waren pausiert. Neuer Chromium-Prozess je Lauf,
abwechselnde Variantenreihenfolge, gleiche Identity-Übertragung ohne Cache,
SwiftShader.

Lighthouse misst simuliertes Mobile. Separate CDP-Läufe verwenden tatsächlich
4× CPU, 150 ms Latenz, 1,6 Mbit/s Download, 750 Kbit/s Upload, 390 × 844 und
DPR 1,75. Sie erfassen FCP, Render-Ready nach dem ersten Frame, echte Tastatur-
Kamerabewegung bis zum Rest, einen eigenen Trace und composited Canvas-Pixel.
**Alle 18 realen Frame-/Pixel-/Kameraläufe bestanden ohne Seitenfehler.**
Unveränderte Pixelgrenzen: mehr als 35 helle Pixel und sechs Farbklassen;
tatsächlich Origin 826–843 Pixel, Observatory 351–361. DOM-Overlays werden erst
nach der Zeitmessung für den Pixelbeleg maskiert.

Werte sind Mediane [Minimum–Maximum], jeweils drei Wiederholungen.

### Origin: Baseline gegen `8e928d9`

| Metrik                     |                  Baseline |       Statischer Einstieg |
| -------------------------- | ------------------------: | ------------------------: |
| Lighthouse FCP             |    4.459 ms [4.454–4.463] |    3.007 ms [3.006–3.020] |
| Lighthouse LCP             |    4.861 ms [4.852–4.862] |    3.024 ms [3.024–3.037] |
| Lighthouse TBT             |    1.813 ms [1.705–2.082] |      1.028 ms [863–1.131] |
| Lighthouse CLS             |                   0,01458 |                         0 |
| Tatsächlicher CDP-FCP      |    2.984 ms [2.972–3.180] |    1.336 ms [1.264–1.464] |
| Tatsächlicher Render-Ready | 10.183 ms [10.048–10.292] |    8.433 ms [8.309–8.441] |
| Kamerarest ab Navigation   | 12.791 ms [12.335–12.903] | 10.893 ms [10.689–10.958] |
| Längster simulierter Task  |    1.769 ms [1.649–2.045] |      1.000 ms [821–1.086] |

Style/Layout fällt von median 722 auf 397 ms; Transfer von 1.600.971 auf
1.307.856 Bytes. Der echte erste Frame kommt 1,75 Sekunden früher. Der spätere
optionale SSR-Weltparameter ist in dieser Origin-Tabelle noch nicht enthalten;
sie behauptet keine Byteidentität mit `bc52793` oder Design B.

### Observatory: Baseline gegen repariertes `bc52793`

| Metrik                     |                  Baseline | Weltbezogener statischer Einstieg |
| -------------------------- | ------------------------: | --------------------------------: |
| Lighthouse FCP             |    4.459 ms [4.458–4.459] |            3.009 ms [3.006–3.023] |
| Lighthouse LCP             |    5.353 ms [4.860–5.425] |            3.031 ms [3.025–3.044] |
| Lighthouse TBT             |    1.108 ms [1.078–1.189] |                  617 ms [554–721] |
| Lighthouse CLS             |                   0,01458 | **0,000356 in allen drei Läufen** |
| Tatsächlicher CDP-FCP      |    3.264 ms [3.120–3.264] |            1.452 ms [1.372–1.644] |
| Tatsächlicher Render-Ready | 10.476 ms [10.432–10.542] |            8.340 ms [8.324–8.483] |
| Kamerarest ab Navigation   | 14.362 ms [14.309–14.445] |         12.227 ms [12.190–12.366] |
| Längster simulierter Task  |      1.034 ms [985–1.128] |                  570 ms [554–665] |

Style/Layout fällt von median 895 auf 436 ms; Transfer von 1.584.638 auf
1.292.061 Bytes. Der echte erste Frame kommt 2,14 Sekunden früher. Die
[Vergleichsdaten](../evidence/g2d/performance/world-entry/comparison.json)
enthalten ungerundete Werte, Streuungen und Quellenrevisionen.

## Die entdeckte CLS-Regression

Der erste Kandidat `8e928d9` war noch nicht integrationsreif:
`/atlas/?world=observatory` lieferte zunächst Origin-Markup. Observatory-CLS:
0,127473, 0,127473 und 0. Der Trace zeigt das Weltlabel von
`[326,249,66,42]` nach `[319,637,80,50]`, Kameracontrols von y=757 nach y=703
und Intro von `[20,95,251,165]` nach `[2,92,241,150]`. Reservierter Introplatz
allein hätte die Ursache nicht behoben. Die ursprünglichen Werte bleiben im
[ersten Vergleich](../evidence/g2d/performance/bootstrap-original/comparison.json).

Der Fix erzeugt getrennte HTML-Dokumente pro Welt. `initialWorld` bestimmt nur
den ersten SSR-/Hydration-Render. Der Build mutiert den globalen Store nicht.
Der Client liest denselben Weltwert vom HTML-Dokument und hydratisiert identisches
Markup. Im ersten Effect stellt SceneDirector synchron URL-/History-Zustand her;
danach wird der Initialwert freigegeben und WebGL aktiviert. Kein falscher
Origin-Canvas erscheint vor Observatory. Kein DOM-Template-Tausch, versteckter
Inhalt oder manipulierter FCP. Die vorgesehenen Direktlinks nutzen den passenden
Weltpfad; der Query-Alias des ersten Versuchs ist nicht die empfohlene statische
Observatory-Adresse.

## Funktionsprüfung und Grenzen

- TypeScript, Vite und alle drei Prerender-Dokumente bestanden.
- 24 Unit-Tests bestanden, einschließlich nativer Pfade und Bare-World-Defaults.
- Desktop 1440 und Mobile 390: keine Hydrationfehler, echte Kamerabewegung,
  Weltwechsel mit demselben Canvas, Back auf exakt die vorherige Pose.
- No-JS: beide statischen Welten mit sieben Projekt-/Quellenlinks und ehrlichem
  Hinweis. No-WebGL behält denselben zugänglichen Inhalt.
- Echter Ctrl-click auf Wayfinding sowie Explorer nach Rust-Suche öffnet einen
  neuen Tab auf `/atlas/observatory/` mit Cerebri, Query-Filter und gerenderter Welt.
  Der zusätzliche Smoke hatte zunächst eine falsche Testannahme (NovaCore nach
  Rust-Suche), anhand der Projektdaten zu Cerebri korrigiert. Keine App-Assertion
  wurde abgeschwächt und kein Anwendungsfehler verdeckt.

[Smoke-Protokoll](../evidence/g2d/performance/world-entry-smoke.json),
[nativer Explorer-Link](../evidence/g2d/performance/native-link.json).
Vollständige Browser-, G0-, CI- und Art-Gates bleiben dem integrierten Head
vorbehalten. Die endgültige B-Gestaltung wurde hier nicht mitgemessen.

**Performance bleibt PARTIAL:** Origin erreicht median genau 1.000 ms für den
längsten simulierten Task, verfehlt damit das Ziel **unter** einer Sekunde und
streut bis 1.086 ms. Der echte erste 3D-Frame benötigt im gedrosselten Identity-
Labor weiter rund 8,3–8,4 Sekunden. Keine Budgets wurden angehoben.
Lighthouse-LCP ist nicht der Zeitpunkt der fertigen Szene. Render-Ready ist der
vorhandene Post-Render-Vertrag mit späterem Pixelbeleg, kein unabhängiger GPU-
Presentation-Timestamp. Kamerarest enthält Easing, ist weder Input-Latenz noch
INP. Keine Smartphone-, Safari-, Firefox-, Feld-CWV-, FPS- oder komprimierte
Transport-Zeitbehauptung.

## Reproduktion und Roharchive

Skripte unter `scripts/perf/g2d`: `snapshot.mjs`, `serve.mjs`, `paired.mjs`,
`measure.mjs`, `readiness.mjs`, `summarize.mjs`, `smoke.mjs`, `native-link.mjs`.
Der Batch verlangt `ATLAS_PERF_QUIET=confirmed`; `LIGHTHOUSE_MODULE` verweist
auf die vorhandene Lighthouse-13.5.0-Installation. `paired.mjs world-entry`
und `summarize.mjs world-entry` erzeugen den zweiten Vergleich. Ports 4183/4184
und Manifest-Builds bleiben getrennt. Keine Paketinstallation während Messungen.

Lokale Archive außerhalb getrackter Dateien im isolierten Worktree:

| Archiv in `.verification/g2d/`         |      Bytes | SHA256                                                             |
| -------------------------------------- | ---------: | ------------------------------------------------------------------ |
| `g2d-bootstrap-8e928d9-20261011.zip`   | 13.780.184 | `e221da2673061b1524a8a961637f897ac14ec808a22418092e3cff0c475f5805` |
| `g2d-world-entry-bc52793-20261011.zip` |  6.434.823 | `b1998d0972e3535a03c371f6788d098707321a926f5ad75a02b7eaee01b265c7` |

Alle **84 beziehungsweise 42 Rohdateien** wurden im ZIP gegen SHA256-Manifeste
geprüft. Archive enthalten vollständige LH-/CDP-Traces, Devtools-Logs, Berichte,
Wiederholungsbilder, Build-Manifeste und Laufprotokolle. Kleine Ergebnisse und
Hashmanifeste stehen im Repository; große Binärdaten wurden nicht zusätzlich in
Git geschrieben. Dies ist ein lokales Archiv, keine dauerhafte Cloud-Sicherung.
Vor Entfernen des Worktrees müssen die Archive dauerhaft gesichert werden.

## Bestandsinventar und reversibler Archivplan

Auf G2-C-HEAD: 30.402.118 Bytes getrackte Arbeitsdateien; darunter 63 Gzip-Dateien
mit 15.145.485 Bytes und 100 PNGs mit 13.319.777 Bytes. `docs/experience` umfasst
26.803.284 Bytes. Das sind Checkout-Dateigrößen, nicht historische Git-Objekte.

Bestehende G2-C-Rohdaten wurden nicht gelöscht. Eine spätere Auslagerung erzeugt
zuerst ein vollständiges Archiv, prüft Wiederherstellung und Hash, sichert eine
dauerhafte externe Ablage und stellt erst dann Referenzen um. Etwaige Entfernung
erfolgt in einem normalen Commit ohne History-Rewrite. CI-Artefakte mit Ablaufdatum
ersetzen keine dauerhafte Sicherung.

Vercel `bundle-conditional` und `rendering-resource-hints` informierten die
Modultrennung. Living-Atlas verlangte echte Pixel, Kamera und semantische Inhalte.
Keine neuen Frameworks, G3-Arbeiten, Merges oder Deploys durch diesen Agenten.
