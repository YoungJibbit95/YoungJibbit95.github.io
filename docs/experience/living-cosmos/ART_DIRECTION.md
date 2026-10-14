# YoungJibbit95 Living Cosmos

Interne Art Direction, 14. Oktober 2026. Die neue Nutzeranweisung ersetzt die
mineralische Schnittwerk-Themenrichtung. Menschliche Bildfreigabe steht aus.

## Design Read

Ein persönliches Entwicklerportfolio für neugierige Besucher und technische
Leser, mit ruhiger, tiefblau-violetter Science-Fiction-Sprache und räumlicher
Exploration. Kein neues Designsystem. Bestehende React/R3F-Technik, lokale
Manrope/JetBrains-Mono-Schriften und echte Projektinhalte bleiben die Grundlage.

`DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 5`, `VISUAL_DENSITY: 3`. Die Varianz
entsteht durch asymmetrische Raumtiefe, die Bewegung durch bewusstes Ansteuern
und Öffnen. Daueranimationen sind dafür nicht erforderlich.

## Tatsächlich gelesene Quellen

- `docs/portfolio-konzept.md`: Navy/Violett, sparsame Tiefensterne, räumliche
  Projektkonstellation, ein gemeinsamer Nexus-Kern mit vier Clients.
- `docs/experience/ART_DIRECTION.md`: kausale Entdeckung, freie Kamerabewegung,
  Orientierung über DOM, unabhängige mobile Perspektive und exakte Rückkehr.
- `src/components/CosmicDeepDives.tsx` und `src/cosmic-worlds.css`: ursprüngliche
  kosmische Orbit-/Sternsystem-Sprache. Historische Projektbehauptungen wurden
  nicht als aktuelle technische Wahrheit übernommen.
- `src/experience/observatory/{camera.ts,data/index.ts}`: aktuelle Koordinaten,
  sieben Modelle und revisionsgebundene Projektbelege.
- `ObservatoryWorld`, `ObservatoryAtmosphere`, `ProjectArchitecture`: vorhandene
  Layer-/Kamera-Verträge und die konkret abzulösende helle Landschaft.
- Der vollständige angehängte Cosmic-Reset-Auftrag. Ältere vollständige
  V2-/V3-/V4-Masterdateien wurden in dieser Arbeit nicht als gelesen ausgegeben.

## Referenzen und konkrete Übertragung

Die Primärquellen wurden am 14. Oktober 2026 recherchiert. Es werden weder
Astronomiedaten behauptet noch fremde Bildassets in die Website eingebaut.

| Primärreferenz                                                                                                                                      | Relevante Eigenschaft                                                                                | Eigene Übertragung                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [ESA Gaia: interaktive Himmelskarte](https://www.esa.int/ESA_Multimedia/Images/2020/12/Interactive_map_of_the_sky_from_Gaia_s_Early_Data_Release_3) | Sternkonzentrationen, Staubregionen und dunkle Zwischenräume erzeugen einen lesbaren Großmaßstab.    | Ein schräges Sternband mit ausgedünnten Rändern; dunkler Raum bleibt Teil der Komposition.                                             |
| [NASA Webb: Pillars of Creation](https://science.nasa.gov/missions/webb/nasas-webb-takes-star-filled-portrait-of-pillars-of-creation/)              | Sterne erscheinen durch unterschiedlich dichte Staubregionen; die Lichtverteilung ist ungleichmäßig. | Selbst erzeugte, unregelmäßige Staubtextur auf vier räumlich getrennten Ebenen. Keine Fototapete.                                      |
| [NASA Eyes on Exoplanets](https://science.nasa.gov/exoplanets/eyes-on-exoplanets-web/)                                                              | Erkundung eines 3D-Raums über unterschiedliche Systemmaßstäbe.                                       | Bestehende kontinuierliche Atlas-Kamera und Anflugposen bleiben erhalten. Keine Übernahme der astronomischen Daten oder Planetentypen. |

## Hauptinterpretation: Nebelraum

Ein großes blau-violettes Staubband hinter und unter den Projektorten verbindet
die Übersicht mit der nach unten blickenden Nahkamera. Drei tatsächliche
Sternentiefen und ein dichteres fernes Band erzeugen beim Bewegen Parallaxe.
Der Hintergrund reicht deutlich über den sichtbaren Kartenausschnitt hinaus.
Die Farben folgen dem Nutzerbrief: `#070914`, `#0B1232`, `#17113A`,
`#7257B8`, `#A891FF`, `#78E8E8`, `#E9EDF4`. Ein warmer NovaCore-Akzent
unterscheidet Weltenbau von Workspace und Assistenz.

Nexus ist ein zentraler Lichtkern mit vier orbitalen, unterschiedlich
proportionierten Client-Segeln. Die Segel haben dunkle, leicht reflektierende
Flächen und präzise Cyan-/Violettkanten. Sie schweben frei im Raum. Sie stehen
illustrativ für vier vorhandene Clients, nicht für eine live synchronisierte
Produktfunktion. Erst die echte Nahposition öffnet das System: Die Segel
wandern auseinander, innere Leitungen und vier benannte Client-Module werden
sichtbar. Der Kern erhält `@nexus/core` als lesbare Bezeichnung.

Die weiteren sechs Orte erhalten im Slice ausschließlich unterschiedliche
Macro-Signaturen: Cerebri als unterbrochene Zeitringe; NovaCore als radialer
Antriebskern; Nemisis als gerichtete Formation; Adventura als räumliche
Voxel-Spirale; YjsE als getrennte flache Ebenen; YJarvis als verschränkte
Signalbögen. Ihre Detailwelten sind damit nicht fertig umgestaltet.

## Kleine Alternative: Stille Weite

Identische Koordinaten, Systeme und Navigation. Die Nebelopazität sinkt auf
etwa ein Viertel bis ein Drittel; der schwarze Zwischenraum und die wenigen
hellen Konturen tragen stärker. Das ist ein kontrollierter Vergleich innerhalb
des Weltraumthemas, keine zweite umfangreiche Website.

Nebelraum ist die Empfehlung: Es vermittelt mehr zusammenhängenden Raum und
farbliche Tiefe. Stille Weite ist lesbarer und ruhiger, wirkt in der Übersicht
aber schneller wie eine lose Objektgruppe. Beide benötigen menschliche
Bildbeurteilung; die astronomischen Referenzen sind ein Qualitätsmaßstab,
keine Behauptung gleichwertiger Bildqualität.

## Storyboard und Integrationsgrenzen

| Ansicht           | Reale bestehende Pose                            | Sichtbare Entdeckung                                                           |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| Desktop-Übersicht | `[320,300,620]` → `[0,0,-220]`, FOV 48           | Sieben Systeme, Tiefensterne, das Feld setzt sich außerhalb des Fensters fort. |
| Mobile-Ankunft    | Nexus + `[150,150,320]` → Nexus + `[0,8,0]`      | Ein lesbarer Einstieg an Nexus; Gesamtübersicht bleibt eine eigene Aktion.     |
| Nexus Approach    | Nexus + `[85,60,145]` → Nexus, Distanz ca. 178,7 | Die vier äußeren Segel bleiben geschlossen.                                    |
| Nexus Detail      | Nexus + `[55,130,90]` → Nexus, Distanz ca. 167,7 | Segel öffnen, vier Clients und gemeinsamer Kern werden lesbar. Mobil FOV 62.   |

Öffnen bei ausgewähltem Nexus und Distanz <=172, Schließen erst über 176.
Die Hysterese vermeidet Flackern. `motion !== 'full'` erreicht die gleiche
Geometrie sofort. Die Bewegung verwendet refs und invalidiert nur bis zum
Stillstand. Keine Kamerapose, History oder Route wird durch die Komponenten
gesteuert.

Die exportierbaren Bausteine liegen unter
`experiments/living-cosmos/CosmicEnvironment.tsx`, `NexusSystem.tsx` und
`CosmicProjectMarker.tsx`. Sie werden vom Lead in den expliziten Review-Einstieg
integriert. Die separate HTML-Studie ist ein Art-Labor mit einer eigenen
einzelnen Canvas-Seite; sie ist keine zweite Canvas in der Produktions-App
und kein Ersatz für SceneDirector/History-Prüfungen.

## Skills konkret angewandt

| Skill                            | Entscheidung bzw. Implementierung                                                                                                                                                       | Sichtbarer oder prüfbarer Effekt                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `living-atlas-experience-design` | Reale bestehende Koordinaten, distanzbedingte Segelöffnung, lesbare Client-Namen, Desktop-/Mobile-Aufnahmen.                                                                            | Approach und Detail decken unterschiedliche innere Geometrie auf; kein statischer UI-Moduswechsel ersetzt den Anflug.                                                       |
| `design-taste-frontend`          | Design Read und Dials vor Bau; asymmetrische ruhige Textzone, lokale Manrope, kaum UI-Flächen, eine kohärente dunkle Palette. Expliziter Nutzerbrief aktiviert die Violett-Ausnahme.    | Das isolierte Labor zeigt die Szene als Hauptinhalt und vermeidet SaaS-Karten, beliebige Fotos oder neue Frameworks.                                                        |
| `redesign-existing-projects`     | Bestehende Szene zuerst diagnostiziert; Material-/Licht-/Raumänderung auf unveränderten Projektorten. Z-Fighting und zu dunkle Segel nach echten Bildern korrigiert.                    | Saubere cyan-violette Kanten und sichtbare dunkle Flächen, keine Terrassen oder Steinsockel.                                                                                |
| `vercel-react-best-practices`    | `rerender-use-ref-transient-values`, `rerender-memo`, `bundle-conditional`: refs für laufende Bewegung, memoisierte Geometrien, keine neuen Dependencies, kleine Textur vorab gebacken. | Keine React-State-Updates pro Frame; kein Laufzeit-Noise-Bake; Geometrien werden nicht bei Kamerabewegung neu aufgebaut. Der Review-Einstieg wird vom Lead bedingt geladen. |

Die allgemeinen Foto-, Farbwechsel- und Marketing-Layoutbeispiele sind hier
unpassend: Der Nutzer fordert echte R3F-Geometrie, das dunkle Blau/Violett ist
verbindlich, und Nexus ist ein reales Projekt. Die beiden QA-Skills werden vom
Lead/Engineering-Agent auf dem integrierten Slice angewandt; dieser Art-Bericht
behauptet dafür keinen eigenständigen vollständigen QA-Pass.

## Tatsächliche Browserbilder und Iteration

Zwei kurze serielle Chromium-Läufe mit SwiftShader, jeweils geschlossen.
1440×1000 und 390×844, DPR 1; `capture.mjs` reproduziert die Aufnahmen.
Alle sechs Bilder wurden als Bilder geöffnet und beurteilt. Erster Befund:
zu schwache Tiefe und coplanare flackernde Nexus-Kanten. Zweiter Stand:
zusätzliches fernes Sternband, tiefere Wolke, Core-Halo und korrigierter
Polygon-Offset. Kein Layout-Overflow und keine `pageerror`-Ereignisse im Labor.

- [Nebelraum Desktop](../../../experiments/living-cosmos/evidence/nebula-1440.png)
- [Nebelraum Mobile](../../../experiments/living-cosmos/evidence/nebula-390.png)
- [Nexus Desktop](../../../experiments/living-cosmos/evidence/nexus-1440.png)
- [Nexus Mobile](../../../experiments/living-cosmos/evidence/nexus-390.png)
- [Stille Weite Desktop](../../../experiments/living-cosmos/evidence/meridian-1440.png)
- [Stille Weite Mobile](../../../experiments/living-cosmos/evidence/meridian-390.png)

Die fünf Runtime-Labels wurden danach auf Lead-Anforderung ergänzt und separat
typegeprüft. Sie sind in diesen Laborbildern noch nicht enthalten. Ihre
endgültige Lesbarkeit muss in den integrierten Desktop-/Mobile-Bildern geprüft
werden. Auch Screenshot-Labels und UI des Labors sind nicht die Produktions-UI.

## Kosten, Grenzen und nächster Schritt

- 2800 Sterne in einem Points-Draw, vier Nebel-Sprites. Keine Dauerschleife und
  kein Postprocessing. `nebula-dust.png`: 256² RGBA, 54.023 Bytes; reproduzierbar
  mit `node experiments/living-cosmos/bake-nebula.mjs`.
- Labor-Initialframe: 53 Draw Calls auf Desktop, 21 beim geführten mobilen
  Einstieg. Diese einzelnen `gl.info`-Proben sind keine FPS- oder
  Smartphone-Aussage und keine Messung des integrierten Canvas.
- `npx tsc --noEmit -p experiments/living-cosmos/tsconfig.json` besteht.
  Formatierung wurde auf alle neuen Laborquellen angewandt.
- Die Übersicht wirkt absichtlich luftig; große leere Zwischenräume können
  ohne belegte Verbindungslinien noch als lose Objektgruppe gelesen werden.
  Der integrierte Adapter muss die bestehenden technischen/thematischen
  Kanten übernehmen. Weitere kosmische Landmarken sind erst nach Freigabe
  sinnvoll, nicht Teil einer unkontrollierten Ausweitung dieses Slice.
- Mobile Detailkomposition und Client-Label-Kollisionen benötigen das
  abschließende integrierte Bildreview. Die Art-Freigabe bleibt offen.

Als Nächstes: genau diese Bausteine im bestehenden Observatory-Canvas prüfen,
vier finale Bilder und echte Navigations-/Rückkehrnachweise vorlegen, dann
auf menschliche Bildfreigabe warten. Origin, sechs Detailwelten, G3, Merge
und Deployment gehören nicht zu diesem Art-Auftrag.
