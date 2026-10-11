# G2-C Spatial Art Review

Ausgangs-SHA: `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Agent C, gemeinsamer Checkout mit exklusivem Schreibbereich. Kein eigener Commit,
kein Install, kein gemeinsamer Build; der Lead integriert diese Dateien.

## Gestalterische Entscheidung

Lesart: ein frei erkundbares Entwicklerportfolio mit angefertigten architektonischen
Projektportraits. Taste-Regler: Designvarianz 8, Bewegungsintensität 3 außerhalb
expliziter Kamerafahrten, visuelle Dichte 3. Bestehende Marke und G1-Steuerung bleiben.

Zwei tatsächlich implementierte R3F-Studien wurden mit gleicher Kamera jeweils bei
1440 × 900 und 390 × 844 gerendert:

- **Meridian:** unterbrochene räumliche Bögen, freistehende Körper, große Distanzen.
  [Desktop](evidence/g2c/art/study-meridian-1440.png),
  [Mobile](evidence/g2c/art/study-meridian-390.png).
- **Strata:** neun schwebende Schichten unter jedem Projekt, drei riesige versetzte
  Grundplatten und eine schwere Vordergrundwand.
  [Desktop](evidence/g2c/art/study-strata-1440.png),
  [Mobile](evidence/g2c/art/study-strata-390.png).

**Meridian gewählt.** Strata wiederholt die Sockelform und verdeckt Labels;
Meridian lässt die individuellen Silhouetten und Verbindungstypen besser lesen.
Die finale Verfeinerung ergänzt einen gebrochenen großen Portalrahmen im
Vordergrund und eine weit entfernte Pfeilerregion. Weniger Ambient-Licht, stärkeres
Seitenlicht und instanzierte Tonunterschiede geben den Körpern erkennbare Flächen.
Keine Postprocessing-Pässe, importierten Modelle oder zusätzlichen Abhängigkeiten.

Alle sieben Formen sind ausdrücklich architektonische Interpretationen und keine
Behauptung produktiv laufender Projektkomponenten:

| Projekt   | Individuelle Silhouette                      | Nahdetail                           |
| --------- | -------------------------------------------- | ----------------------------------- |
| Nexus     | Versetzte offene Rahmen mit gemeinsamem Kern | Innenraster und Stützen             |
| Cerebri   | Unterbrochener Chronometer                   | Feine Randglieder und Satelliten    |
| NovaCore  | Offene kantige Turbine                       | Innerer Körper und radiale Elemente |
| Nemisis   | Gerichtete, geneigte Rippen                  | Querstege entlang der Rippen        |
| Adventura | Unterschiedlich hohe Voxelterrassen          | Kleine räumliche Blockelemente      |
| YjsE      | Drei versetzte Tile-Ebenen                   | Einzelne Tiles auf der oberen Ebene |
| YJarvis   | Gebrochene räumliche Schleife                | Umlaufende feine Verbinder          |

## Kameraraum und echte Detailstufen

Projektanker erstrecken sich über etwa 800 Einheiten; der Meridian hat rund 1080
Einheiten Durchmesser, die entfernte Region reicht bis z=-1320. Vordergrund,
Projektgruppe und entfernte Pfeiler verdecken einander perspektivisch. Drag/Zoom
verändern denselben realen G1-Kameraraum. Renderer enthält keine eigene Kamera,
Navigation oder History.

- Macro: Hauptsilhouetten, Cluster, Meridian und ferne Region.
- Meso: Desktop-Distanz unter 620, im schmalen Viewport unter 1850; Satelliten und
  Bauteile werden als echte Meshes sichtbar. Der größere mobile Schwellwert folgt
  der physisch weiteren Kamera beim Einrahmen derselben Cluster (nächster Körper
  etwa 1017 für Arbeit/Planung und 1708 für Weltenbau), keinem UI-Auswahlflag.
- Micro: Distanz unter 220; zusätzliche projektspezifische Architekturdetails.
- Hysterese: Micro bleibt bis 250, Meso bis 690 beziehungsweise mobil 2050. Außerhalb des Frustums fallen
  unsichtbare Detailgruppen auf Macro zurück. Das globale LOD hält ebenfalls die
  Hysterese. React erhält nur geänderte diskrete LOD-Snapshots.
- Mobile: 8 statt 12 Meso-Elemente, 24 statt 40 Micro-Elemente und 90 statt 150
  Hintergrundpunkte. In sehr weiter Übersicht erscheinen drei Clusterbeschriftungen;
  beim Annähern wechseln sie zu kurzen Projektnamen. Die vollständigen Namen stehen
  im semantischen Explorer. Dadurch entsteht kein überlagerter Textteppich.
- Keine automatische Objektanimation. Reduced Motion beeinflusst nur die zentrale
  Kamera; statische Geometrie zeigt sofort dieselbe Bedeutung.

Die ursprüngliche mobile Studienpose beschnitt äußere Projekte. Die finale mobile
Aufnahme verwendet deshalb den integrierten `fitProjects(all, 0.5)`-Vertrag.
YjsE und YJarvis wurden gemeinsam mit dem Lead räumlich entzerrt.

## Rendernachweise und Grenzen

[Renderprotokoll](evidence/g2c/art/render-evidence.json) enthält die tatsächlich
gemessenen Kamerapositionen, sieben LOD-Snapshots sowie Draw- und Dreiecksanzahlen.
Finale Übersicht: 29 Draw Calls / 6598 Dreiecke bei 1440. Die Geometrie ist
instanziert; zusätzliche Nahdetails verteilen sich nach tatsächlicher Sichtbarkeit.
Alle sieben Micro-Foki sowie Macro und Meso wurden im Browser geprüft. Filter auf
NovaCore lässt tatsächlich nur dessen Projektkörper stehen und entfernt die Kanten
zu ausgeblendeten Endpunkten. Über 500 ms Ruhe wächst die Framezahl nicht. Kein
ungeplanter RAF. Null Browserfehler. Ein echter Canvas-Klick auf die technische
Kante liefert `novacore-nemisis`.

Die Artefakte stammen aus einem isolierten Browserharness, der die **Produktions-
ObservatoryWorld** und dieselben Quelldaten importiert. Der separate Testharness
ist keine zweite produktive Kamera. Er dient gezielt der geometrischen Prüfung;
Explorer, Browser-History, G0/G1 und Origin müssen zusätzlich in der integrierten
App durch Lead und QA geprüft werden. Kein FPS-, CWV- oder Hardware-GPU-Erfolg
wird aus diesen Aufnahmen abgeleitet.

Reproduktion: `npm run dev -- --port 3001`, dann
`node docs/experience/evidence/g2c/art/capture-art.mjs`. Artefakt-Harness und Script
werden nicht in den Produktions-Entry importiert.

- [Final Desktop](evidence/g2c/art/final-overview-1440.png)
- [Final Mobile](evidence/g2c/art/final-overview-390.png)
- [Nexus Meso](evidence/g2c/art/final-nexus-meso-1440.png)
- [Nexus Micro](evidence/g2c/art/final-nexus-micro-1440.png)
- [Nexus Micro Mobile](evidence/g2c/art/final-nexus-micro-390.png)
- [NovaCore Micro](evidence/g2c/art/final-novacore-micro-1440.png)
- Weitere Micro-Portraits aller sieben Projekte liegen im selben Artefaktordner.

Visuell geprüft wurden beide Studien und finale Desktop-/Mobile-Übersicht,
Nexus-Annäherung sowie Nexus-/NovaCore-Nahansichten. Die mobile Gesamtübersicht ist
bewusst eine Orientierungskarte mit kleinen Körpern; die räumliche Wirkung entsteht
beim Annähern. Menschliche Art-Abnahme bleibt offen. Diese technische Prüfung ist
keine Behauptung finaler gestalterischer Produktionsreife.

## Tatsächlich angewandte Skills

- Atlas Experience: reale Wide/Approach/Detail-Posen, unabhängige Silhouetten,
  Source-Daten/Geometrie-Trennung, echte Bildprüfung.
- Taste: Brief-Lesart, Leerraum, klare Silhouetten, zurückhaltende Bewegungsintensität,
  bewusste Auswahl zwischen zwei gebauten Richtungen. Keine Marketing-Font- oder
  Stockfoto-Regeln auf die 3D-Welt übertragen.
- Redesign: G1-Kugeln und Raster durch eine eigene räumliche Formensprache ersetzt,
  Kamera und Interaktionen erhalten; mobile Beschriftung aktiv korrigiert.
- Vercel React: memoisiert erzeugte Instanzmatrizen, diskrete statt kontinuierlicher
  React-Zustandsmeldungen, Ref-basierte Framewerte, lazy Welt durch Lead. Eigene
  Canvas-Texturen und Kantengeometrie werden auf Unmount freigegeben; R3F besitzt
  die deklarativ erzeugten Mesh-Geometrien und Materialien.

Status: Renderer und isolierte Art-Prüfung bereit zur Integration. Gesamtabnahme,
integrierte UI-Aufnahmen und letzter Feature-HEAD-CI gehören zum Lead-/QA-Gate.

## Reviewkorrekturen

Das unabhängige Architekturreview fand, dass Three auch unsichtbare Meshes bei
Raycasts trifft. Der Renderer prüft jetzt die Sichtbarkeit sämtlicher Vorfahren
vor jeder Auswahl und vor `stopPropagation()`. Echte Browserklicks bestätigten:
sichtbarer Nexus-Kern auswählbar; dieselbe Position nach Leerfilter sowie die
Position eines ausgeblendeten Meso-Satelliten ohne Auswahlwirkung. Mobile Kamera:
Fit All → Macro, Cluster → Meso, Nahansicht → Micro im Browser geprüft.
