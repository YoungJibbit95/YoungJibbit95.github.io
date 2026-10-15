# Nexus Redesign Report

15. Oktober 2026 · Living Cosmos · G2-D. **Visuelle Nutzerfreigabe offen.**

[Vier echte Browserbilder](REVIEW.html) · [Projektsemantik](PROJECT_SEMANTIC_LANGUAGE.md)
· [Exploded View Framework](EXPLODED_VIEW_FRAMEWORK.md) · [Art Direction](ART_DIRECTION.md)
· [UX-Prüfung](UX_REVIEW.md)

## Ausgangspunkt und Umfang

Ausgangs-HEAD lokal, Remote und Draft PR #1:
`5b78a873572ff62a8c6bc8de95445e0d699f92be`. Dessen Root- und G0-Actions waren
erfolgreich; die visuelle Nutzerfreigabe war offen. Branch bleibt
`feat/living-atlas-v3`. Main war und bleibt
`e1e1da1cdb395d7fbb561b678f19a799d0a15043`.

Die neue Rückmeldung betrifft die Bedeutung der Projektkörper: vier abstrakte
Segel erklärten Nexus nicht ausreichend. Der neue Referenzfall zeigt einen
zentralen Stern für `@nexus/core` und vier unterscheidbare App-Welten. Beim
Näherkommen fächern sich die Apps auf und geben ihren Aufbau und die gemeinsame
Grundlage frei. Die beiden Workspace- und die beiden Editor-Varianten bleiben
auch im Dossier einzeln benannt.

Nebelraum, Sterne, sechs übrige Projektkörper, Kamera, SceneDirector, History und
persistenter Canvas bleiben die vorhandene Grundlage. Der einzige gestaltete
Einstieg bleibt `/atlas/observatory/?cosmos=preview`. Kein vollständiger Origin,
kein G3, Merge oder Produktionsdeploy. Vorhandene lokale Nutzerdateien,
Lockfile-Änderungen und Altartefakte werden nicht in diesen Patch aufgenommen.

## Konkrete Skill-Anwendung

| Projektlokaler Skill             | Entscheidung und Wirkung                                                                                                                                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `design-taste-frontend`          | Entwicklerportfolio im dunkelblau-violetten Universum; unterschiedliche App-Silhouetten statt bedeutungsarmer Bögen. Die Nutzerpalette hat Vorrang vor generischen Farbregeln.                                                                               |
| `redesign-existing-projects`     | Gezielt den unklaren Nexus-Körper und dessen Begleittext verbessern; vorhandene Nebelkomposition, Bedienung und Kamera weiterverwenden.                                                                                                                      |
| `living-atlas-experience-design` | Gemeinsames deterministisches Modell vor der Animation; tatsächliche Kameraannäherung erzeugt sichtbare strukturelle Öffnung; vollständiger Textzugang.                                                                                                      |
| `vercel-react-best-practices`    | Reine kleine Datenmodule, bestehende Lazy-Scene-Grenze, refs für Transienten, endliche Demand-Frames und aufgeräumte GPU-Ressourcen.                                                                                                                         |
| `web-design-guidelines`          | [Aktuelle Richtlinien](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) am 15.10.2026 abgerufen. Echte Überschriften/Definitionslisten, keine unnötigen Tabstopps, unveränderte Fokus-Rückkehr, lesbare mobile Namen. |
| `living-atlas-world-qa`          | Reale Objekttransformationen und Glyphenrechtecke messen; echte Canvas-Bilder prüfen; Pixel-/Kamera-Grenzen erhalten und technische Resultate getrennt von Art beurteilen.                                                                                   |

Die ursprünglichen Konzept- und Art-Direction-Dateien und die vorhandenen
Quellenmodelle wurden verwendet. Nicht lokal vorhandene ältere Masterdateien
und `07_QA_AND_RELEASE_GATES.md` wurden nicht als gelesen behauptet.

## Zwei begrenzte Arbeitspakete

- **Semantic Art Direction:** Nexus-Geometrie und gemeinsamer Semantikdatensatz,
  sieben quellengebundene Projektdefinitionen und Art-Dokumentation.
- **Interaction / UX / Readability:** Dossier, scoped CSS, semantische Browser-
  und Label-Prüfungen, Fokus und Fallback.
- **Lead:** kleiner gemeinsamer Öffnungsvertrag, Integration, reale Diagnostik,
  bestehende Discovery-Tests, Gesamtprüfung, Performance, Git/PR und Stop.

Maximal zwei Subagents; Browser- und Performance-Läufe werden seriell ausgeführt.

## Nachweisstand

Lokale Prüfungen verwenden einen Browser-Worker ohne Wiederholungsversuche.
Die genaue finale Commit-ID und die Actions-Ergebnisse dieses HEAD werden im
[bestehenden Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1)
festgehalten. Dieser Bericht unterscheidet lokale Ergebnisse vom nach dem Push
ausgeführten CI-Lauf.

| Gate                                   | Stand                                           | Nachweis                                                                                           |
| -------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Format                                 | PASS                                            | `npm run format:check`                                                                             |
| TypeScript, Vite, Prerender            | PASS                                            | `npm run build`; drei statische Einstiegspunkte                                                    |
| Root-Unit-Tests                        | PASS · 27/27                                    | `npm run test:unit`; drei neue Öffnungsvertrag-Tests                                               |
| G0-Unit-Tests                          | PASS · 6/6                                      | Unveränderte Kamera-Modelltests                                                                    |
| G0-TypeScript/Build                    | PASS                                            | Dieselben installierten Compiler-/Vite-Module direkt aufgerufen; lokale npm-Shims fehlen weiterhin |
| G0-Browser                             | PASS · 16, 8 bestehende gerätespezifische Skips | 1,2 Minuten; ein Worker, keine Retries                                                             |
| Root-Browser                           | PASS · 95/95                                    | 8,3 Minuten; vollständiger Lauf vor der letzten lokalen Main-Label-Nachführung                     |
| Weltwechsel-Stress                     | PASS · 3/3                                      | Nach finalem Build: 49,1 s gesamt; 12,9 / 14,1 / 13,8 s; ursprüngliche Pixelprüfung                |
| Finale Nexus-Bilder und gezielte Tests | PASS · 9/9                                      | Nach Main-Label-Nachführung: frischer Build/Prerender, alle betroffenen Fälle in 51,9 s            |
| CI auf finalem HEAD                    | Nach Push separat prüfen                        | Root und G0; kein Deployment im PR-Workflow                                                        |
| Visuelle Nutzerfreigabe                | OFFEN                                           | Stop nach diesem Referenzslice                                                                     |

Die lokalen Rohprotokolle liegen unter `.verification/semantic-nexus/`. Die
fehlenden G0-Shims wurden nicht durch Änderungen an Nutzer-Lockfiles repariert.
CI installiert seine Abhängigkeiten reproduzierbar mit `npm ci`.

## Was die Tests tatsächlich absichern

Die bisherigen Pixelgrenzen bleiben `lit > 35` und mehr als sechs Farbstufen.
Exakte gespeicherte Kamera-/History-Rückkehr bleibt `< 1e-7`. Aus der bisherigen
Segelprüfung wird eine Prüfung der vier realen App-Transformationen: jeder Client
legt mehr als 8,99 Einheiten zurück und erreicht zusätzlich den vollständigen
definierten Endpunkt mit `< 1e-7` Abweichung. Auch beide Hüllen bewegen sich real.
Vier gerenderte Linien müssen am jeweiligen tatsächlichen Client enden; ein
DOM-Flag allein kann diese Prüfungen nicht bestehen.

Die neuen semantischen Browserfälle prüfen alle vier Namen und Funktionsrollen,
die feste Quellenrevision, Dossier-Fokus, Escape, WebGL-Fallback und reale
projizierte Glyphenrechtecke. Alle fünf Labels bleiben in den geprüften
1440-/390-Ansichten mindestens acht Pixel vom Bildrand entfernt und überschneiden
weder einander noch die markierten Bedienelemente. Namen **und** Rollen werden
zusätzlich auf mindestens 14 CSS-Pixel projizierte Schriftgröße geprüft. Das
gesamte zweizeilige Rechteck wird nicht mit einer einzelnen Schriftgröße verwechselt.

Die vorhandenen Suiten prüfen unter anderem 320/390/768/1440-Layouts, ruhendes
Demand-Rendering, Ressourcen nach Weltwechseln, native Tastatur-/Touchgesten,
Filter, Unterbrechen von Kamerafahrten, HTML-Fallback und Axe. Keine Pixelgrenze,
bestehende Deadline oder globale Retry-Regel wurde gelockert.

## Gestalterische Bewertung

**Für die Nutzerentscheidung stark genug:** Der Core wird als gemeinsame helle
Mitte gelesen; vier getrennte, benannte Anwendungen umgeben ihn. Workspace und
Code besitzen unterschiedliche Öffnungen. Der Übergang von kompakter Ordnung
zu offenen Hüllen und vier Verbindungen erklärt nun die gemeinsame Grundlage.
Die gleichen Inhalte bleiben auch außerhalb der 3D-Ansicht lesbar.

**Offen:** Die Körper sind bewusst stilisierte Architekturminiaturen. Echte
Produktoberflächen, belegte Beispielabläufe und tiefere Client-Innenräume sind
noch keine Bestandteile dieser Welt. Die Labels sind für die geprüften
Annäherungs-/Detailposen komponiert; vollständige Kollisionsfreiheit aus jeder
beliebigen freien Orbitperspektive wird nicht behauptet. Die ältere Grenze der
Macro-Monumentalität und der niedrig aufgelösten Nebelsprites bleibt bestehen.
Dieser Nexus-Pass war keine weitere große Sternkartenrunde.

## Begrenzter Performancevergleich

Ein neuer Lauf je bestehender Messmethode, seriell nach allen Browserprüfungen.
Vergleich ist der vorherige finale Refinement-Stand `5b78a87`. Das sind lokale
Laborproben mit Chromium 156.0.8078.4 / SwiftShader, keine Feldwerte, keine
Messung auf einem echten Telefon und kein statistischer Beschleunigungsnachweis.

| Lighthouse 13.5.0, gleiche mobile Simulation |  Vorher |   Jetzt |
| -------------------------------------------- | ------: | ------: |
| Performance-Score                            |      70 |      73 |
| FCP                                          | 3164 ms | 3163 ms |
| LCP                                          | 4081 ms | 4042 ms |
| TBT                                          |  393 ms |  332 ms |
| CLS                                          | 0,00015 | 0,00015 |

Die zusätzliche Nexus-Geometrie zeigt in diesem einzelnen Vergleich keine
massive LCP-Verschlechterung. Der bisherige etwa viersekündige Labor-LCP ist
damit nicht grundsätzlich gelöst. [Vollständige Lighthouse-Zusammenfassung](evidence/lighthouse.json).

| Tatsächliche CDP-Drosselung: 4× CPU, 150 ms, 1,6 Mbit/s |          Vorher |           Jetzt |
| ------------------------------------------------------- | --------------: | --------------: |
| Erstes beobachtbares Projekt-HTML                       |          223 ms |          226 ms |
| FCP                                                     |         1472 ms |         1552 ms |
| Render-ready-Acknowledge                                |         8913 ms |         9077 ms |
| Erste physische Kamerareaktion                          |         60,7 ms |         71,5 ms |
| Übertragene Ressourcen                                  |     1.383.439 B |     1.387.639 B |
| Draw Calls in der gemessenen Ansicht                    |              35 |              38 |
| Dreiecke in derselben Ansicht                           |            3242 |            5858 |
| Geometrien / hochgeladene Texturen                      |          23 / 4 |          30 / 4 |
| Cosmic-Scene-Chunk, roh / gzip                          | 18.920 / 6715 B | 19.399 / 6795 B |

Das erste HTML ist keine Paint-Messung. Render-ready ist der vorhandene
Acknowledgement nach einem Render, kein exakter GPU-Präsentationszeitpunkt.
Die Kamerareaktion schließt die Automation-Zustellung ein. Rendererzahlen sind
eine Stichprobe dieser Ansicht, keine Maximalwerte über sämtliche Zustände.
Die 2800 Sterne und das bestehende 54.023-Byte-Nebelasset wurden nicht erweitert.
Der große gemeinsame Three/R3F-Chunk bleibt bei 227.721 gzip-Bytes. Die vorhandene
Vite-Warnung für große Chunks bleibt; keine neue Runtime-Abhängigkeit kam hinzu.
[Methodik, Ressourcen und echte Rendererwerte](evidence/performance.json).

## Nächster Ausbau

Empfehlung nach Nutzerfreigabe: **Cerebri als zweite semantische Detailwelt**.
Eine Zeitlinse mit einem kleinen deterministischen Planungsfall prüft, ob die
gemeinsame Grammatik auch Regeln, Gründe und Ergebnisse erklären kann. Die
Quellen rechtfertigen eine zeitliche Struktur, kein neuronales Gehirn. Danach
ist NovaCore mit seiner belegten Nemisis-Abhängigkeit ein sinnvoller Kandidat
für die dritte Detailwelt.

Ein Origin-Storyboard gewinnt erst dann belastbare Übergänge, wenn mindestens
zwei unterschiedliche Welten ihre eigene Erklärung tragen. Ein weiterer großer
Macro-Pass hat im Moment geringeren Nutzen als verständlichere Projektinhalte.
Die übrigen Definitionen sind vorbereitete Gestaltungsgrundlagen, keine bereits
gebauten Detailwelten. Dieser Auftrag endet wieder bei der visuellen Freigabe.
