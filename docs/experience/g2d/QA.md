# G2-D: unabhängige Prüfung vor der Richtungsentscheidung

Agent E prüft isolierte Prototypen, den mobilen Bedienvorschlag und den separaten
Performance-Kandidaten. Die G2-C-Produktionsszene wird durch diese Prüfung nicht
ersetzt. Baseline lokal/GitHub/Draft PR #1 ist
`c2e338cf723f1ec6e20b4493175a8783ac95b405`; Branch
`feat/living-atlas-v3`. Kein G3, Merge oder Deploy.

## Methode und Grenzen

Gelesen wurden der vollständige neue G2-D-Auftrag, Phasenstatus, Ausführungsvertrag,
Mobile-Handoff, alle drei Prototyp-Implementierungen und der Performance-Patch
`6bb3430`. Angewendet: Atlas World QA, Atlas Experience Design, Taste, Redesign,
Vercel React sowie die am 11. Oktober 2026 frisch gelesenen
[Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

Das eigene [Prüfskript](../../../experiments/g2d-design/qa/check.mjs) nutzt echtes
Chromium mit SwiftShader. Es prüft tatsächlich geänderte Kamera-Position und
Target nach nativen CDP-Touch-Eingaben, Tastaturaktivierung, Detail-Entdeckungen,
Fokus, Zielgrößen, Axe, Renderer-Leerlauf und drei Weltwechsel. Ein Demand-Frame
ohne Bewegung wird ausdrücklich getrennt von Ressourcenständen betrachtet.
Alle Browser werden seriell ausgeführt; andere Agenten pausieren ihre Browser.
390 × 844 und 768 × 1024 sind emulierte Touch-Viewports; 1440 × 900 ist Desktop.
Kein echtes Telefon, Safari, Firefox, Screenreader oder Feld-Performance-Nachweis.

Frühere Artist-Captures wurden zusätzlich tatsächlich geöffnet: alle drei
Desktop-/Mobile-Übersichten, Mobile-Entdeckungen und Desktop-Origin-Bilder. Die
unten genannte Art-Bewertung ist ein unabhängiges Agentenurteil. **Menschliche
Richtungsfreigabe und finales Visual-Experience-Gate bleiben ausstehend.**

## Vorab-Befunde und beauftragte Reparaturen

- **A, P1 Lesbarkeit:** Im ersten 390-Bild schneidet der dunkle Dachträger durch
  „im Werden.“. Die Projektleiste zeigt YJarvis nur angeschnitten. An A gemeldet;
  repariert und im Schlusslauf bestätigt: geschützte Überschrift und natives
  Select mit sieben Projekten. Ein weiterer Befund auf 768 px betraf den dunklen
  Dachuntergrund hinter Wordmark/Ursprung. Der nun deckende Header wurde ebenfalls
  gezielt visuell bestätigt.
- **A, P2 Reduced Motion:** Freie Pfeiltastenbewegung verwendete stets Animation,
  anders als die Zielkameras. A verwendet nun dieselbe Reduced-Motion-Entscheidung.
  Wordmark und YjsE-Ziel sind nach der Korrektur mindestens 44 px hoch/breit.
- **B, P1 Randlabel:** Erstes gespeichertes 390-Bild schneidet Adventura an.
  Agent B hat die Sichtbarkeit an tatsächlicher halber Labelbreite plus 16 px
  Rand ausgerichtet; der unabhängige Schlusslauf bestätigt vollständig sichtbare
  Labels bei 390 und 1440 px. Kleine Header-Hitboxes wurden anschließend auf
  mindestens 44 px angehoben und erneut geprüft.
- **C, P2 Zielgrößen/Tablet:** Quelllink unter 44 px, knappe Desktop-Projektziele
  und Desktop-Komposition auf 768 px. Lead korrigierte Quelle/Targets und verwendet
  bis 900 px die kompakte Kamera samt nativer Projektauswahl. Der unabhängige
  390-/768-/1440-Lauf bestätigt Bedienbarkeit, Größen und fehlenden Überlauf.
- **Performance-Kandidat, P2 Native Links:** `projectHref()` verwies immer auf
  `/?...`, während `worldHref()` `/atlas/` beibehält. Ctrl-/Mittelklick würde den
  schweren alten Einstieg öffnen. Vor Integration an Lead gemeldet.

## Visuelle Einschätzung

| Richtung                       | Beobachtete Stärke                                                                                                             | Noch offene gestalterische Schwäche                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| A / Aperture Archive           | Verständliche Schwelle, großzügige Portalgröße, reale historische Nexus-Aufnahme verknüpft Raum und Projekt.                   | Archivkammern ähneln einander stark; Mobile braucht geschützte Textflächen. Kleine räumliche Schilder tragen wenig Information. |
| B / Schnittwerk                | Zusammenhängende Landschaft mit Vordergrund, klarer Wegführung und einer verständlichen Öffnung um den gemeinsamen Nexus-Kern. | Die sieben Orte wirken weiterhin teilweise wie ein Architekturmodell. Die Materialsprache unterscheidet Orte wenig.             |
| C / Werkstatt nach Mitternacht | Persönlicher Arbeitsraum, überzeugende Nähe auf 390 px, warme Material- und Lichtbeziehungen.                                  | Wiederholte Tische begrenzen Makro-Identität; kleine Plaketten und hohe Draw-Call-Zahl erfordern eine weitere Ausarbeitung.     |

Die Richtungen sind räumlich verschieden, keine Farbvarianten. Alle verwenden
eigene prozedurale Architektur. Große Objekte und korrekt gezählte Pixel belegen
keine außergewöhnliche gestalterische Qualität. Die Nutzerentscheidung bleibt
erforderlich, bevor eine Richtung großflächig in Produktion übertragen wird.

## Browser-Schlusslauf

Neun unabhängige Szenenfälle (A/B/C bei 390, 768 und 1440 px) und der separate
Mobile-Shelf-Fall wurden abgeschlossen. Nach gezielten Reparaturen bestehen alle
geprüften Eingabe- und Ressourcenverträge. Die ursprünglichen Fehlläufe bleiben
im Rohprotokoll sichtbar; kein Testbudget oder Produktions-Pixelwert wurde gelockert.

| Vertrag                            | Ergebnis und Beleg                                                                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Echte Touch-Pinch/Drag-Eingabe     | **PASS** bei A/B/C auf 390 und 768 px; tatsächliche Position/Target/Distanz im JSON. Kein programmatischer Kamerasprung als Ersatz für eine Geste.                                                        |
| Keyboard und Entdeckung            | **PASS**: native Buttons öffnen jeweils Nexus und seine tatsächliche Geometrie. A/C bewegen die freie Kamera mit Pfeiltasten; B hat nur die nativen Ziel-/Entdeckungsaktionen als Keyboard-Alternative.   |
| Projekttext und Fokus              | **PASS**: A Reader mit inertem Hintergrund, Shift-Tab, Escape und Fokusretour; B Register mit sieben Projekten, Escape und Fokusretour; C lesbare Quelle/Projektauswahl.                                  |
| Axe                                | **PASS**, null WCAG2 A/AA und WCAG2.1 AA Verstöße in allen drei 390-Entdeckungsansichten und im separaten Shelf-Labor. Das ersetzt weder manuelle Kontrastprüfung über Canvas noch Screenreader-Hardware. |
| Renderer-Leerlauf                  | **PASS**, Framezähler bleibt nach der letzten Interaktion jeweils eine Sekunde unverändert. B liest für Pixelbeweise zusätzlich explizit WebGL, sein Demand-Zähler wird separat beobachtet.               |
| Drei Weltwechsel                   | **PASS** nach B-Reparatur: gleiche Canvas-DOM-Instanz und Ressourcenplateau bei jedem Konzept, keine versteckte neue Canvas-Instanz.                                                                      |
| Layout und Fehler                  | **PASS**, kein horizontaler Dokumentüberlauf, keine Page-/Console-Errors in den abgeschlossenen Szenenfällen. Korrigierte Zielgrößen separat geprüft.                                                     |
| Production History/Filter/G0/G1/CI | **PENDING** im getrennten Engineering-Gate des Leads. Prototypen belegen keine vollständige Produktionsintegration.                                                                                       |
| Menschliche Richtung/Art           | **PENDING**, ausdrücklich keine Abnahme durch QA, Bilder oder grüne CI.                                                                                                                                   |

### Tatsächlich gefundener Ressourcenfehler in B

Der erste unabhängige Desktop-Test scheiterte an wachsender Geometriezahl. Ein
separater Fünf-Zyklen-Repro bestätigte **130 → 134 → 138 → 142 → 146 Geometrien**
bei identischer Übersichtskamera, 126 Draw Calls, 78.410 Dreiecken, zwei Texturen
und vier Programmen. Ein zusätzlicher Browser-Leerlauf änderte diese Zähler nicht.
Das war ein echter Ressourcenfehler, kein veralteter DOM-Messwert.

Agent B ergänzte die fehlende `BufferGeometry.dispose()`-Freigabe in den Eigentümern
`Ribbon` und `Fold`. Die sechs Wiederverwendungen einer Fold-Geometrie bekommen
keine mehrfachen Disposes. Der unveränderte Drei-Zyklen-Test misst danach exakt
**126 / 126 / 126 Geometrien**, zwei Texturen und vier Programme. A bleibt bei
28 Geometrien/zehn Texturen, C bei 252 Geometrien/18 Texturen. Diese Zähler sind
keine VRAM-Messung. Insbesondere C braucht vor Produktionsübernahme eine
Konsolidierung seiner hohen Draw-Call-/Geometriezahl.

Nachweise: [erste Fälle](../evidence/g2d/qa/results-all.json),
[Leck-Repro](../evidence/g2d/qa/b-resource-diagnosis.json),
[reparierte B-/Shelf-Fälle](../evidence/g2d/qa/results-b-shelf.json),
[B-Ressourcenplateau](../evidence/g2d/qa/b-world-cycles.json),
[A-Header-/Zielprüfung](../evidence/g2d/qa/a-header-repair.json).

### Native Dialogprüfung und korrigierte Testannahme

Die erste neue QA-Assertion forderte bei jedem Tab-Schritt
`activeElement.closest('dialog')`. Chromium wechselt beim nativen Modal zwischen
Schließen → Quelllink → `BODY` → Schließen; kein Hintergrundbedienelement erhält
dabei Fokus, und das Dialog bleibt `:modal`. Die instrumentierte Wiederholung
bestätigte zusätzlich, dass ein erzwungenes `.focus()` auf den Hintergrundlink
verweigert wird. Der korrigierte neue Test erlaubt ausschließlich diese BODY-
Zwischenposition bei weiterhin modalem Dialog und versucht anschließend, **jedes**
Hintergrund-Bedienelement zu fokussieren. Alle Versuche werden abgewiesen. Escape
schließt und restauriert den Opener; native Projektauswahl und Zoom-Intent bestehen.
Es war keine Produktänderung nötig. Der gesonderte erste Axe-Aufruf verlangte einen
expliziten Playwright-Context statt `browser.newPage()`; auch dies wurde nur im
neuen Testharness korrigiert. Frühere fehlgeschlagene Aufrufe werden nicht als
bestandene Prüfungen gezählt.

[Fokusfolge und verweigerter Hintergrundfokus](../evidence/g2d/qa/shelf-focus-diagnosis.json).

## Reproduktion und Artefakte

```powershell
node experiments/g2d-design/qa/check.mjs
node experiments/g2d-design/direction-b/verify-label-edges.mjs
```

`qa/diagnose.mjs` ist der gezielte Fünf-Zyklen-/Fokus-/Header-Repro. Die Ausgabe
nach der reparierten B-Version zeigt erwartungsgemäß kein Wachstum mehr; das
festgehaltene ursprüngliche Diagnose-JSON enthält den tatsächlichen Fehlerstand.
Das Gesamtskript verwendet eigenständige Browser-Contexts, schließt sie und seinen
Browser auch bei Fehlern und verändert keine Produktionsdateien. Fremde
Vite-Server bleiben in der Verantwortung ihrer Eigentümer.

Kuratiert bleiben die finalen Konzeptbilder in `evidence/g2d/a`, `b` und `c`;
zusätzliche unabhängige 390-/768-/1440- und Gestenaufnahmen sowie Rohlogs werden
lokal unter `.verification/g2d/qa-raw/` mit SHA256-Inventar bewahrt. Sie sind
keine zusätzlichen Produktionsassets. JSON-Befunde und reproduzierbare Skripte
bleiben im Repository.
