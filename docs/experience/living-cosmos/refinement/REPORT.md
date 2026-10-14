# Living Cosmos — Galactic Atlas Refinement

14. Oktober 2026. Begrenzter Creative-Quality-Pass auf **Nebelraum**.
    **Visuelle Nutzerfreigabe offen.** Die technischen Resultate und die Art-Bewertung
    werden getrennt beurteilt. [Vorher/Nachher und sechs finale Browserbilder](REVIEW.html).

## Git, Umfang und Arbeitsgrenze

Bestehender Branch `feat/living-atlas-v3`, bestehender offener
[Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1).
Start lokal/remote/PR: `e21dd2a9deb7d629c096d16371711d5f09584dd8`.
Code- und Bild-Checkpoint: `4bf2ece`.
Begrenzter Ladefix nach dem ersten Performancebefund: `9ce422e`.
Der abschließende Dokumentationscommit, sein vollständiger finaler HEAD und
die Actions dieses HEAD stehen im PR und im Abschluss der Arbeit. Ein Bericht
kann seinen eigenen Commit-Hash nicht enthalten.
Main bleibt `e1e1da1cdb395d7fbb561b678f19a799d0a15043`.

Geändert wurden die drei vorhandenen Cosmos-Module, eine neue zentrale
`CosmicLabels.tsx`, `ObservatoryWorld` und dessen Cosmic-Adapter, die
Cosmic-CSS-/Explorer-/Dossier-Oberfläche, drei Overlay-Markierungen in
`ExperienceRoot`, explizite Sprite-Diagnostik in `WorldCanvas`, zwei neue
Browsersuites und eine optionale Ausgabe-/Variantenwahl im vorhandenen
Performance-Script. Ein kleiner Bootstrap in `atlas/observatory/index.html`
verhindert das zwischenzeitliche Anzeigen unpassender Standard-Overlays.
Kein Kamera-, SceneDirector-, Registry-, Projektmodell-
oder Runtime-Abhängigkeitswechsel. Vorhandene unzugeordnete Nutzerdateien,
Lockfile-Metadaten, ältere G2-D-Berichte, Messskripte und ZIP bleiben lokal erhalten.

Der einzige gestaltete Einstieg bleibt `/atlas/observatory/?cosmos=preview`.
Origin, die sechs anderen Detailwelten, G3, Merge und Produktionsdeploy sind
nicht Teil dieses Ergebnisses. „Stille Weite“ bleibt archivierter Vergleich.

## Zwei Subagents und Lead

| Arbeitspaket     | Verantwortung                                                     | Ergebnis                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A · `cosmic_art` | Nur Environment, Projektmarker, Nexus-System und eigene Evidenz   | Räumlich komponiertes Band, ferne Sternarme, stärkere Silhouetten, Kernlicht/Clientleitungen/Runtime-Namen; sechs echte Bilder, eine begrenzte Bildpolitur |
| B · `mobile_ux`  | Nur Cosmic-CSS, Explorer/Dossier, Mobile-Tests und eigene Evidenz | Zwei statt drei Bedienreihen, 112 px Dock, 44-px-Ziele, Fokus/Escape/native Liste; 320/390/768-Prüfung                                                     |
| Lead             | Gemeinsame Integration und Abschluss                              | Kollisionsfreie globale Labels, Nahansicht ohne Fremdsysteme, belegte Kanten, Diagnostik, Performance, vollständige Tests, Git und PR                      |

Höchstens zwei aktive Subagents, getrennte Schreibbereiche. Browser und
Performance wurden seriell ausgeführt. Agent B überprüfte danach unabhängig
den integrierten Code lesend: kein konkreter neuer Befund zu Sichtbarkeit,
Demand-Rendering, Disposal, Fokus oder Kamera-Verträgen. Das ersetzt keine CI.

## Konkrete Wirkung der sechs lokalen Skills

| Skill unter `.agents/skills/`    | Entscheidung und sichtbare beziehungsweise überprüfbare Wirkung                                                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design-taste-frontend`          | Kleinerer Titel, zusammenhängende asymmetrische Nebelkomposition, bewusste dunkle Zwischenräume; Nutzer-Navy/Violett bleibt verbindlich. Keine neue generische Landingpage.                                                                                |
| `redesign-existing-projects`     | Echte Baselinebilder zuerst beurteilt; vorhandene Silhouetten und Mechanik erhalten. Lokale Korrekturen an Namen, Dossier und Bedienzone statt neuer Designstudie.                                                                                         |
| `living-atlas-experience-design` | Reale räumliche Sternschichten, unterschiedliche Macro-/Approach-/Detailzustände, kausales Öffnen durch Distanz; lesbare DOM-Gegenstücke bleiben erhalten.                                                                                                 |
| `vercel-react-best-practices`    | Sieben Sprite-Labels mit refs im bestehenden Demand-Frame; DOM-Messung nur bei Overlayänderungen. Memoisierte Geometrien, explizites Cleanup, kein React-State je Kameraframe und kein zusätzlicher Dauer-RAF.                                             |
| `web-design-guidelines`          | Aktuelle [Originalrichtlinien](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) abgerufen; mindestens 44-px-Bedienflächen, Safe Areas, sichtbarer Fokus, 16-px-Suchfeld, native Links und korrekte Escape-Rückkehr. |
| `living-atlas-world-qa`          | Tatsächliche Canvas-Bilder statt Zustandsattribute als Bildbeleg; alte Pixelgrenzen erhalten, reale Kamera-/History-/Touchgesten, Filter-, Accessibility-, Demand- und Ressourcenprüfungen; CI und Art separat.                                            |

Weitere Details: [Art-Pass](ART_REFINEMENT.md), [Mobile-Paket](MOBILE.md).

## Was sich tatsächlich geändert hat

Die gleichen 2.800 Sterne verteilen sich auf tiefe Feldsterne, zwei ungleichmäßige
Arme, eine ferne 600-Stern-Linse und 200 nähere Punkte. Zwei Points-Geometrien
ersetzen eine. Acht statt vier räumlich platzierte Nebelflächen verwenden
dasselbe 54.023-Byte-/256²-Asset. Ihre Zentren erzeugen echte Parallaxe;
die Flächen bleiben kameraorientierte Sprites. Keine volumetrische Simulation,
kein neues astronomisches oder Softwareprojekt wird behauptet.

Globale Namen erhalten kurze eindeutige Texte, Abstandshalter und Priorität
nach Fokus und tatsächlicher Entfernung. Die sieben Labels meiden Bildschirmrand,
einander, konservative Projekt-Bounds und markierte UI-Flächen. Fehlt ein
freier Platz, wird ein entferntes Label zurückgenommen; die vollständigen
Projektinformationen bleiben per DOM erreichbar. Gefilterte oder verdeckte
Objekte reagieren nicht weiter auf Klicks. Alle sieben Namen sind im geprüften
Desktop-Macro sichtbar. Auf Mobile bleibt Nexus der erste Orientierungspunkt.

NovaCore → Nemisis bleibt die einzige belegte technische Kante, durchgezogen.
Thematische Nähe bleibt gestrichelt. Tatsächliche Beziehungen zum Fokus werden
heller, andere dezenter. In der Nahansicht unter 280 Einheiten treten andere
Projektgeometrien und ferne Kanten zurück; freies Entfernen stellt sie wieder dar.
Die vier lokalen Nexus-Leitungen enden an den realen sichtbaren Clientmodulen.

Vier Segel öffnen weiterhin physisch bei 172 und schließen über 176 Einheiten,
mit derselben Auslenkung von 0 auf 9. Öffnungsgrad und Lichtreaktion sind gekoppelt.
Die fünf Runtime-Namen bleiben im finalen Desktop-/Mobile-Detail vollständig
sichtbar. Keine neue künstliche Interaktion oder Kamerapose wurde hinzugefügt.

## Bilder und Art-Bewertung

Alle sechs Dateien zeigen die echte integrierte App und wurden vom Art-Agent
und Lead visuell geprüft. Die beiden bestehenden Bild-/Discovery-Tests liefen
mit unveränderten Pixelgrenzen und physischen Öffnungsassertionen.

| Zustand  | Desktop 1440 × 900                              | Mobile 390 × 844                               |
| -------- | ----------------------------------------------- | ---------------------------------------------- |
| Macro    | [Bild](evidence/cosmos-macro-1440.png)          | [Bild](evidence/cosmos-macro-390.png)          |
| Approach | [Bild](evidence/cosmos-nexus-approach-1440.png) | [Bild](evidence/cosmos-nexus-approach-390.png) |
| Detail   | [Bild](evidence/cosmos-nexus-detail-1440.png)   | [Bild](evidence/cosmos-nexus-detail-390.png)   |

Die Galerie stellt dieselbe frühere 1440-/390-Ankunft unmittelbar daneben.
Die sechs zusätzlichen UI-Aufnahmen unter `evidence/mobile/` wurden vom Lead
aus der vollständigen Root-Suite auf `4bf2ece` aktualisiert und erneut angesehen.
Sie zeigen den fertigen integrierten Stand bei 320, 390 und 768 Pixeln.

**Verbessert:** klarere separate Namen, zusammenhängendes diagonales Band,
ferner Orientierungspunkt, differenzierte Signaturen, aufgeräumte Nahansicht,
sichtbar mehr Platz für den Kosmos auf Mobile, lesbares und schließbares Dossier.

**Noch nicht überzeugend gelöst:** Der Desktop-Macro bleibt stellenweise ein
Diagramm aus sieben kleinen Symbolen. Die breiten Nebelflächen wirken relativ
glatt; die räumlichen Zentren und Sternschichten allein erzeugen noch keine
überzeugend monumentale plastische Nebelwelt. Die Runtime-Beschriftung wirkt
weiterhin technisch. Bei 768 px liegt ein Teil von Nemisis außerhalb des
Ankunftsausschnitts; sein vollständiges Label und die native Liste bleiben
erreichbar. Eine engere Desktopkamera hätte lediglich die Symbole vergrößert
und wurde daher in diesem begrenzten Pass nicht eingeführt.

**Art-Ergebnis: sichtbare Verbesserung, Hauptziel Monumentalität nur teilweise
erreicht. Keine endgültige Designfreigabe.**

## Interaktionen und lokale Abnahme

Auf integriertem Code-Checkpoint `4bf2ece`, jeweils ein Worker und keine Retries:

| Prüfung                                                | Resultat                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| Formatierung                                           | PASS; vendorte Skills unverändert ausgeschlossen                |
| Root-Unit-Tests                                        | 24/24                                                           |
| TypeScript, Produktionsbuild, drei Prerender-Einstiege | PASS                                                            |
| Vollständige Root-Browsersuite                         | **91/91, 8,0 min**; enthält alle 14 Cosmic-Fälle                |
| Originaler Weltwechsel-Stresstest, drei Wiederholungen | **3/3, 52,0 s**; Fälle 15,1 / 13,2 / 12,5 s                     |
| G0-Modelle und TypeScript/Build                        | **6/6**, Build PASS                                             |
| G0-Browserpipeline                                     | **16 bestanden, 8 bestehende gerätespezifische Skips**, 1,1 min |

Die vorhandenen Cosmic-Fälle belegen unveränderte reale Canvas-Pixelgrenzen,
alle vier physischen Segeltransforms, exakte gespeicherte Posen mit Abweichung
unter `1e-7`, einen persistenten Canvas, Wheel/Pan/Orbit/Tastatur, tatsächliche
Touch-Pinch-/Pan-Gesten, Filter/Back/Forward, Reduced Motion und WebGL-Fallback.
Die neuen Fälle prüfen die wirklichen projizierten Sprite-Quads bei
320/390/768/1440, verdeckte Treffer nach Filtern, tatsächlichen Stillstand des
Demand-Renderzählers und begrenzte Textur-/Geometriezahlen nach drei
Unmount-/Rückkehrzyklen. Mobile prüft 44-px-Flächen, 112-px-Dock, zehn sichtbare
Tab-Ziele, Dossierfokus, Escape und native Textliste. Axe meldet keine
serious/critical WCAG-A/AA-Verstöße im geprüften 390-px-Ablauf.

Lokale vollständige Logs/Traces: `.verification/galactic-refinement/`.
Die npm-Shims im vorhandenen G0-`node_modules/.bin` fehlen lokal; das normale
Build-Script scheiterte deshalb zunächst beim Auflösen von `tsc`. Typecheck,
Vite-Build, Preview und Playwright wurden anschließend mit denselben bereits
installierten Node-Modulen direkt ausgeführt. Keine Neuinstallation und keine
Konfigurationsänderung. Das ist eine lokale Werkzeugauflösung, kein gelockerter Test.

Die erste neue Labelprüfung enthielt eine falsche Sucherwartung: „NovaCore“
trifft auch Nemisis wegen dessen belegter Abhängigkeit. Die Erwartung wurde
auf beide echten Treffer korrigiert; die App-Suche blieb unverändert.
Die fünf korrigierten Label-/Cleanup-Tests bestanden danach ohne Retry in 21,6 s.
Keine bestehenden Pixelgrenzen, Deadlines oder Kamera-Assertions wurden gelockert.

Ein nachfolgender begrenzter Ladefix reserviert die Overlays der Query-Variante,
bis der statische Standard-Atlas zum Cosmic-Layout hydriert ist. Die sieben
statischen Projektartikel bleiben erreichbar; ohne JavaScript läuft dieser
Bootstrap nicht und der vorhandene HTML-Fallback bleibt bestehen. Ein neuer
Regressionstest hält alle Modulrequests zurück und prüft den tatsächlichen
Zustand vor und nach Hydration. Nach dieser Korrektur bestanden **20/20**
Cosmic-/Static-Entry-Fälle in **1,4 min**, ein Worker, keine Retries; Typecheck,
Build und Prerender ebenfalls erneut bestanden. Die gesamte finale Root-Suite
umfasst damit 92 Fälle und wird in der finalen CI ausgeführt.

## Performance

Gleiche vorhandene Scripts, Chromium **156.0.8078.4 / SwiftShader**, frischer
Browser, kein paralleler Browserjob. Lighthouse **13.5.0**, Mobile 412 × 823,
DPR 1,75, simulierte 4× CPU / 150 ms / 1,6 Mbps. Je eine Baseline- und finale
Labormessung, dazu genau ein vorangegangener Diagnosepunkt dieses Passes.
Keine statistische Signifikanz, Telefon-FPS oder Feld-Core-Web-Vitals behauptet.

| Lighthouse  | Baseline e21dd2a | Erster Refinement-Punkt | Final nach Ladefix |
| ----------- | ---------------: | ----------------------: | -----------------: |
| Score       |               68 |                      65 |                 70 |
| FCP         |          3165 ms |                 3164 ms |            3164 ms |
| LCP         |          3181 ms |                 3181 ms |        **4081 ms** |
| TBT         |         757,5 ms |                712,5 ms |             393 ms |
| CLS         |           0,0136 |              **0,1153** |            0,00015 |
| Speed Index |          3933 ms |                 3910 ms |            3677 ms |

Der erste Trace zeigte den Wechsel vom statischen Standard-Overlay zu den
neuen Cosmic-Abständen und zwei Bedienreihen. Der Audit nannte außerdem
Webfonts; die tatsächlichen `old_rect`/`new_rect`-Werte zeigten vor allem die
Umordnung von Intro, Bedienung und Weltlabel. Der kleine Bootstrap verhindert
das sichtbare Zwischenlayout. **Trade-off:** Der korrekte Intro-Inhalt erscheint
erst nach Hydration, daher liegt das finale LCP rund 0,9 s später. Das ist keine
pauschale Performanceverbesserung. Der höhere Score und niedrigere TBT sind
Einzelwerte; weitere Optimierung wird aus diesem begrenzten Vergleich nicht
automatisch abgeleitet.

Die separate reale CDP-Messung verwendet weiterhin 390 × 844 / DPR 1,75,
4× CPU, 150 ms, 1,6 Mbps, deaktivierten Cache und denselben Tastaturimpuls.

| Reale CDP-/Renderer-Messung                      |            Baseline |               Final |
| ------------------------------------------------ | ------------------: | ------------------: |
| Erstes beobachtbares HTML                        |            217,3 ms |            223,0 ms |
| FCP                                              |             1468 ms |             1472 ms |
| Bestehende Render-ready-Bestätigung              |           8864,5 ms |           8912,9 ms |
| Physische erste Kameraveränderung ab Input-Marke |             65,8 ms |             60,7 ms |
| Gespeicherte Ruhepose ab Input-Marke             |           3215,8 ms |           3093,9 ms |
| Übertragene Ressourcen                           |         1.370.136 B |         1.383.439 B |
| Draw Calls / Dreiecke                            |           26 / 3006 |           35 / 3242 |
| Geometrien / Texturen / Programme                |          20 / 4 / 8 |          23 / 4 / 9 |
| Cosmic-Modul roh / gzip                          |     11.600 / 3992 B |     18.920 / 6715 B |
| Three-Modul roh / gzip                           | 864.661 / 227.712 B | 864.677 / 227.721 B |

Die Szene kostet neun zusätzliche Draw Calls und drei Geometrien, bei gleicher
Sternzahl und Nebeltextur. Renderbereitschaft und reale Kamerareaktion zeigen
in diesem begrenzten Paar keine deutliche Verschlechterung. Demand-Ruhe und
GPU-Cleanup sind separat getestet. HTML-Verfügbarkeit ist kein Paint;
Render-ready ist kein exakter GPU-Presentation-Zeitstempel; die Input-Messung
enthält Automation-Lieferzeit. Der Framezähler ist keine FPS-Angabe.

Maschinenlesbar: [finaler CDP-/Bundle-Punkt](evidence/performance.json),
[finales Lighthouse](evidence/lighthouse.json),
[erster Lighthouse-Punkt mit der gefundenen Regression](evidence/lighthouse-first.json).
Ungekürzte Trace-/DevTools-Dateien bleiben lokal unter
`.verification/galactic-refinement/performance*/`.

## CI und Flakes

Die CI des finalen Dokumentationscommits wird nach dem Push separat geprüft.
Sein voller HEAD, beide endgültigen Run-Links, Ergebnisse und gegebenenfalls
Retry-/Tracebefunde stehen im aktualisierten
[Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1)
und im Abschluss dieser Arbeit. Lokale Ergebnisse werden nicht als Remote-CI ausgegeben.

Die Ausgangs-CI auf `e21dd2a9` war erfolgreich, jedoch nicht retryfrei:
[Root](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38547921912)
meldete 82 bestandene + 1 flaky Browserfälle und 2 bestandene + 1 flaky Stressläufe;
[G0](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38547921858)
16 bestanden, 8 bestehende Skips. Legacy Nexus lief beim Warten auf `img.complete`
in seine 30-s-Gesamtgrenze, ein Stresslauf ebenfalls in die 30-s-Gesamtgrenze.
Diese Instabilität ist durch einen erfolgreichen lokalen Lauf nicht automatisch
repariert. Im aktuellen vollständigen lokalen Durchlauf trat beides nicht auf;
Legacy Nexus benötigte 11,5 s. Keine pauschale Timeout-Erhöhung oder Änderung
an bestehenden Assertions, Pixelgrenzen, Kamera-Verträgen oder Retry-Regeln.

## Nächster Checkpoint

Hier endet die Umsetzung zur visuellen Nutzerentscheidung. Ein möglicher
nächster kleiner Auftrag wäre das ausdrücklich separate kosmische
Origin-Storyboard mit Übergang zur Sternkarte. Falls die aktuelle Macro-Wirkung
noch nicht genügt, sollte zuerst eine einzige räumliche Landmarke beziehungsweise
Nebelstruktur gezielt neu beurteilt werden. Keine dieser Arbeiten wurde begonnen.
