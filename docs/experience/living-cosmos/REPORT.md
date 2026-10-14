# Living Cosmos — Vertical Slice und Handoff

**Nachfolgender Checkpoint:** Der autorisierte Galactic-Atlas-Refinement-Pass
auf Basis von `e21dd2a9` ist im [aktuellen Abnahmebericht](refinement/REPORT.md)
und [neuen Bildreview](refinement/REVIEW.html) dokumentiert. Nebelraum ist die
verbindliche Grundlage. Die folgende Dokumentation beschreibt die bewahrte
Vertical-Slice-Baseline; ihre Messwerte sind keine Messung des Refinements.

Stand: 14. Oktober 2026. **Visuelle Nutzerfreigabe offen.** Dieser Checkpoint
beendet Recovery, Art Direction und den begrenzten Observatory-/Nexus-Slice.
Origin und die sechs übrigen Detailwelten werden erst nach Bildfreigabe gestaltet.
G3, Merge nach `main` und Produktionsdeploy wurden nicht ausgeführt.

## Umfang und Git-Nachweis

Repository `YoungJibbit95/YoungJibbit95.github.io`, bestehender Branch
`feat/living-atlas-v3`, bestehender [Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1).
Start-HEAD: `32e6a87a238fb3ea14fc2f3cf77f7df0a739b60f`.
Integrierter Cosmic-Code: `e651626ab7df5b6269041df9a978e90cfa8f01db`.
Die folgenden kleinen G0- und Screenshot-Test-Ergänzungen sind unten dokumentiert.
Der vollständige finale Feature-SHA und dessen CI stehen im PR und im Abschluss
dieser Arbeit; ein Bericht kann seinen eigenen Commit-Hash nicht enthalten.

| Etappe                               | Commit / Dateien                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery                             | `61541b6`: `CameraRig.tsx`, `InteractionRouter.ts`, zwei vorhandene Browsertests und `RECOVERY.md`                                      |
| Zwei kosmische Studien               | `99d4609`: `experiments/living-cosmos/` einschließlich sechs Browserbildern, Generator und `ART_DIRECTION.md`                           |
| Integrierter Slice und Abnahmebelege | `e651626`: unten aufgeführte Integrationsdateien, sechs neue Slice-Tests, finale Screenshot-Recovery, Performance-Script und Bildreview |

Die Integration berührt `src/{main,atlas}.tsx`, `ExperienceRoot`, `WorldCanvas`,
`SceneRegistry`, die Observatory-Contracts, Explorer/Dossier/Navigation und
`worlds/ObservatoryWorld.tsx`. Neu sind `cosmicPreview.ts`, `living-cosmos.css`,
`worlds/CosmicObservatoryWorld.tsx`, `worlds/cosmos/`, `tests/cosmos.spec.ts`
und `scripts/perf/living-cosmos.mjs`. Die Statushinweise in `PHASE_STATUS.md`,
`G2_D_EXECUTION.md` und `G2_D_REVIEW.md` ersetzen widersprechende alte Art-Vorgaben,
erhalten aber deren historischen Inhalt.

Schon vorhandene lokale Änderungen, Lockfile-Metadaten, ältere G2-D-Berichte,
Messskripte und die ZIP bleiben erhalten und werden nicht pauschal mitcommittet.
Zwei bereits vorhandene unversionierte Diagnose-JSONs wurden ausschließlich
formatiert, damit der globale Formatcheck besteht. Die vendorten Skills bleiben
unverändert und von Prettier ausgeschlossen.

## Implementiert, isoliert und noch offen

**In die bestehende App integriert:** `/atlas/observatory/?cosmos=preview`.
Dies ist ein expliziter Review-Einstieg mit dem bestehenden World-ID,
SceneDirector, LOD, Filtern, Projektdaten und einem persistenten Canvas.
Natives Linkverhalten, Reload und Back/Forward erhalten den Review-Parameter.
Der normale Einstieg bleibt bis zur Freigabe im bisherigen Design.

Der Slice enthält 2800 räumliche Sterne, vier Nebelebenen, sieben individuelle
Projekt-Signaturen sowie Nexus mit vier distanzabhängig öffnenden Client-Segeln.
Technische Beziehungen bleiben durchgezogen, thematische gestrichelt; es
werden keine neuen Projektabhängigkeiten erfunden. Die vier Clientnamen und
`@nexus/core` sind außerdem im lesbaren Dossier erklärt. Die Illustration
behauptet keine Live-Synchronisierung.

**Isoliertes Art-Labor:** `experiments/living-cosmos/` vergleicht zwei
Interpretationen derselben Koordinaten. Seine eigene einzelne Canvas-Seite ist
kein zusätzlicher Canvas in der App. Laborbilder enthalten nicht die finalen
Produktions-Labels oder alle Produktionsfunktionen.

**Noch nicht umgesetzt/freigegeben:** vollständige Origin-Welt, sechs weitere
Detailwelten, zusätzliche galaktische Landmarken und der Wechsel des regulären
Einstiegs auf Cosmic. Kein vollständiger Weltumbau wird als erledigt ausgegeben.

## Visuelle Richtung und zwei Interpretationen

Navy, tiefes Violett, räumlich getrennte Sterne und ungleichmäßige Nebel bilden
den Zusammenhang. Cyan markiert Nexus und technische Verbindungen. Die
Projektformen verwenden unterschiedliche Silhouetten, keine identischen
Planeten und keine mineralischen Sockel.

| Interpretation | Wirkung                                                                  | Entscheidung                                                                |
| -------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Nebelraum      | Zusammenhängendes violett-blaues Staubband, stärkere Tiefe und Parallaxe | Im Slice umgesetzt; Empfehlung zur Bildentscheidung                         |
| Stille Weite   | Gleiches System mit ungefähr einem Viertel bis Drittel der Nebelopazität | Ruhiger, aber stärker als lose Objektgruppe lesbar; bleibt Vergleichsstudie |

[Art Direction](ART_DIRECTION.md) enthält die tatsächlich gelesenen lokalen
Quellen, Primärreferenzen von ESA/NASA und die Storyboards. Vollständige ältere
V2-/V3-/V4-Masterdokumente sowie das lokal nicht auffindbare QA-Masterdokument
wurden nicht als gelesen ausgegeben und blockierten diese Arbeit nicht.

## Sechs Skills mit konkreter Wirkung

| Projektlokaler Skill             | Angewandte Entscheidung und Ergebnis                                                                                                                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `design-taste-frontend`          | Bewusste dunkle Palette, lokale Schriften, asymmetrische ruhige Textebene; Szene trägt die Gestaltung. Die explizite Nutzervorgabe hat Vorrang vor pauschalen Violett- oder Marketing-Beispielen.                                            |
| `redesign-existing-projects`     | Vorhandene Szene weiterentwickelt; Z-Fighting an Segelkanten korrigiert, Materiallicht verbessert, nach echten Bildern mobile Nexus-Beschriftung näher an ihre Silhouette gesetzt.                                                           |
| `living-atlas-experience-design` | Bestehende freie Kamera, echte Raumtiefe und distanzbedingte Entdeckung; Annäherung öffnet Geometrie. Eigene mobile Ankunft und vollständiges DOM-Gegenstück.                                                                                |
| `vercel-react-best-practices`    | Bedingter Lazy-Import, memoisierte Geometrie, refs statt React-State pro Frame, Demand-Rendering, vorab gebackene Nebeltextur. Keine neue Dependency oder Postprocessing-Kette.                                                              |
| `web-design-guidelines`          | Aktuelle [Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) abgerufen: sichtbare Fokusringe, native Links, Keyboard/Touch, Reduced Motion, lesbares No-WebGL-Dossier und Overflow-Prüfung. |
| `living-atlas-world-qa`          | Tatsächliche GitHub-SHAs/Traces, unveränderte echte Canvas-Pixelschwellen, volle Root-Suite, drei Stressläufe, G0, vier geöffnete Browserbilder; technische Resultate strikt von Bildfreigabe getrennt.                                      |

Zwei tatsächliche Subagents arbeiteten in begrenzten getrennten Bereichen:
`/root/cosmic_art` an Art Direction/Labor und unabhängigem Bildreview;
`/root/engineering_recovery` an Trace-Diagnose, Regressionstests und unabhängigem
technischem Review. Der Lead übernahm Integration, Kamera-Reparatur, Tests,
Messungen und Handoff. Es liefen höchstens zwei Subagents parallel und jeweils
nur eine lokale Browser-Prüfserie.

## Vier echte Browserbilder

Alle folgenden Bilder stammen aus Chromium/SwiftShader auf dem finalen
integrierten Build, nicht aus Bildgenerierung oder einem DOM-Ersatz. Sie wurden
vom Lead und dem Art-Agent als Bilder geöffnet. Die geführte mobile Ankunft
bleibt über „Alle einrahmen“ mit der Gesamtkarte verbunden.

| Zustand                      | Desktop                                             | Mobile                                            |
| ---------------------------- | --------------------------------------------------- | ------------------------------------------------- |
| Übersicht / geführte Ankunft | [1440 × 900](evidence/cosmos-macro-1440.png)        | [390 × 844](evidence/cosmos-macro-390.png)        |
| Nexus-Entdeckung             | [1440 × 900](evidence/cosmos-nexus-detail-1440.png) | [390 × 844](evidence/cosmos-nexus-detail-390.png) |

Die [Bildgalerie](REVIEW.html) enthält außerdem den Variantenvergleich.
Zusätzliche Approach-Bilder und die [Kamera-/Pixelmessungen](evidence/camera-and-pixels.json)
belegen den geschlossenen Zustand vor der Entdeckung.

## Echte Interaktion und Rendering

Die sechs neuen Slice-Fälle prüfen kontinuierliches Mausrad-Dolly, linken
Pan, rechten Orbit, Tastatur sowie echte CDP-Touch-Pinch- und Zwei-Finger-Pan-
Gesten. Distanz und Ziel ändern sich physisch, ohne die Seite mitzuscrollen.
Filter und die vollständige gespeicherte Pose kehren bei Back/Forward mit der
bestehenden Toleranz `<1e-7` zurück. Dasselbe markierte Canvas-Element überlebt
auch den Wechsel nach Origin und zurück.

Nexus Approach liegt bei ungefähr 178,7 Einheiten, Detail bei 167,7. Öffnen bei
`<=172`, Schließen erst über 176 verhindert Flackern. Die Tests lesen die
tatsächlichen vier Gruppen-Transforms: geschlossen horizontaler Versatz
`<1e-7`, offen jeweils `>8,99`; die Detailgruppe wird sichtbar. Back schließt
sie wieder. Reduced Motion erreicht dieselbe Geometrie ohne Animationsweg.

CameraControls meldet `rest` vor seinem endgültigen `sleep`. Der neue Test
vergleicht die Rückkehr deshalb exakt mit der beim Abflug gespeicherten
physischen Pose, nicht mit einer früheren Rest-Momentaufnahme. Die erlaubte
History-Toleranz wurde nicht erhöht.

Der vorhandene Kamera-Far-Clip 6000 schnitt am maximalen Dolly einen Teil des
neuen Sternfelds ab. Nur solange die Cosmic-Umgebung aktiv ist, nutzt dieselbe
Kamera Far 14000; beim Verlassen wird 6000 wiederhergestellt. Der Browsertest
prüft beide Werte und die exakte Rückkehr. Es gibt keine zweite Kamera.

Die echten Pixelproben verbergen DOM-Overlays und behalten `lit >35` sowie
`shades >6`. Ergebnisse: Desktop Macro 460/67, Detail 841/118; Mobile Macro
540/125, Detail 1311/149 (lit/shades). Ein sichtbarer Text kann den Canvas-Test
nicht bestehen lassen.

## Recovery und CI

[RECOVERY.md](RECOVERY.md) enthält die Original-Traces und Reparaturdetails.
`CameraControls.stop()` sprang zum noch ausstehenden Ziel; der Fix hält die
physische Position fest und leert die alte Bewegung. Wheel-Unterbrechung läuft
vor den Controls in der Capture-Phase. Ein stationärer Pointer-Regressionstest
reproduzierte den ursprünglichen Fehler und besteht nach der Reparatur.

Die ursprüngliche Root-CI `38157814935` hatte drei Fehler und einen flaky Fall.
Auf Recovery-Commit `61541b6` besteht G0
([38539741378](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38539741378));
Root [38539741374](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38539741374)
meldet 76/77 bestanden. Kamera-, Touch- und Legacy-Nexus-Fälle sind dort im
ersten Versuch grün. Der verbleibende Weltwechsel-Test erreicht bei der dritten
Aufnahme das unveränderte 30-Sekunden-Limit. Die echte Aufnahme benötigt in
dieser CI etwa sechs Sekunden; zusätzlich eingeführte Kamera-idle-Waits kosten
insgesamt weitere neun Sekunden. Der Originalvergleich bestätigt: Diese
zusätzlichen Barrieren waren kein ursprüngliches Abnahmekriterium. Sie wurden
entfernt; ebenso eine lokal getestete, aber langsamere Renderstillstand-Probe.
Es bleibt die einzelne echte Aufnahme außerhalb des zu kurzen 5-Sekunden-Polls.
Alle drei Wechsel, Scene-Readiness, Viewport, Pixelgrenzen, Canvas-Zählung und
das ursprüngliche 30-Sekunden-Limit bleiben erhalten.

Der integrierte Slice auf `e651626` besteht die vollständige
[Root-CI 38543193996](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38543193996):
83 Browserfälle und drei Stressläufe, ohne flaky Fälle. Die folgende G0-Reparatur
auf `473afe2` besteht
[G0-CI 38545182935](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38545182935)
mit 16 bestandenen Fällen und acht bestehenden gerätespezifischen Skips.

Die [Root-Wiederholung 38545182974](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38545182974)
auf `473afe2` endet mit 81 bestanden, einem Fehler und einem flaky Legacy-Fall.
Der History-Fall besteht zuerst Readiness und die exakte Pose; danach läuft die
Screenshot-Aufnahme erneut in den zu kurzen 5-Sekunden-Poll. Eine systematische
Suche findet sieben verbleibende positive Polls dieser Art. Sie erfassen jetzt
jeweils einmal nach den bereits vorhandenen Readiness-/Pose-Prüfungen und prüfen
die unveränderten Pixelgrenzen. Zeitlimits, Retries und dynamische Origin-
Animationsprüfungen bleiben unverändert. Alle acht betroffenen Fälle bestehen
lokal mit einem Worker ohne Retries in 44,9 Sekunden. Der flaky Legacy-Versuch
scheitert beim Browser-Kontextaufbau vor dem Anwendungstest; Legacy bleibt
unverändert. Trace-Zeiten und genaue Teststellen stehen in [RECOVERY.md](RECOVERY.md).

**Finale CI:** siehe den SHA-bezogenen Status im Draft PR und im Abschluss.
Lokales Grün und Erfolge früherer Revisionen werden nicht als Erfolg der
finalen GitHub-Revision ausgegeben.

## Lokale technische Prüfungen

Die CI auf `e651626` fand zusätzlich eine bereits vorhandene G0-Start-Race:
[G0 38543193983](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38543193983)
meldet 15 bestanden, einen Fehler und acht gerätespezifische Skips. Der Trace
zeigt den Tap auf B vor der inneren CameraRig-Bereitschaft. Der sichtbare Button
war bereits aktiv; die noch fehlende Rig-Referenz verwarf den Fokusauftrag.
Eine Runtime-Zeile in `experiments/camera-spike/src/SpikeApp.tsx` deaktiviert
Kameraaktionen bis zur bestehenden Readiness-Meldung. No-WebGL-/Fehler-Fallback
bleiben bedienbar. Der vorhandene mobile Fall in `e2e/camera.spec.ts` blockiert
kontrolliert das Lazy-Modul, prüft den deaktivierten Zustand, gibt das Modul
frei und behält Tap, Zielpräzision, Screenshot und Overflow-Prüfung unverändert.
Die Baseline scheitert deterministisch; anschließend bestehen Build, 6/6 Units
und die vollständige G0-Suite mit **zwei Workern wie CI: 16/16, acht bestehende
Skips, keine Retries, 49,7 Sekunden**. Details in [RECOVERY.md](RECOVERY.md).
Die Cosmic-Implementierung und ihre Bilder ändern sich dadurch nicht.

| Prüfung                                                                        | Ergebnis                                                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Root-Modelltests                                                               | 24/24 bestanden                                                                                                     |
| Typecheck, Build und drei prerenderte HTML-Einstiege                           | bestanden                                                                                                           |
| Gesamte Root-Browsersuite                                                      | 83/83 bestanden, ein Worker, keine Retries, 7,4 Minuten                                                             |
| Finale sechs Cosmic-Fälle nach Bildkorrekturen und strengeren Transform-Checks | 6/6 bestanden, keine Retries, 46,5 Sekunden                                                                         |
| Drei Weltwechsel-Stressläufe                                                   | Finale Serie 3/3 bestanden; alle ursprünglichen Assertions und das 30-Sekunden-Limit unverändert                    |
| G0-Modelltests / Build                                                         | 6/6 bestanden / bestanden                                                                                           |
| G0-Browser                                                                     | 16 bestanden, 8 bestehende gerätespezifische Skips, keine Retries                                                   |
| Accessibility                                                                  | Cosmic und G0: keine serious/critical Axe-A/AA-Funde; Keyboard, Fokus-Rückgabe, Reduced Motion und No-WebGL geprüft |
| Formatcheck / Diffcheck                                                        | bestanden                                                                                                           |

Die Vollsuite lief vor den letzten begrenzten Stern-Clip-/Label- und Diagnose-
Korrekturen; danach wurden die betroffenen sechs Fälle erneut vollständig
geprüft. Die finale GitHub-Suite prüft den gesamten gepushten Stand.
Lokal wurden für G0 nach einem Windows-Command-Lookup-Fehler die vorhandenen
lokalen TypeScript-/Vite-/Playwright-Node-Einstiege direkt ausgeführt. Keine
Neuinstallation oder Änderung der G0-Quellen war nötig.

## Kleine reproduzierbare Performance-Bewertung

Reproduzierbar nach `npm run build` mit einem Preview auf Port 4173 und
`node scripts/perf/living-cosmos.mjs`. Je eine frische Chromium-/SwiftShader-
Instanz, 390 × 844, DPR 1,75, tatsächliche CDP-Drosselung auf 4× CPU,
150 ms Latenz, 1,6 Mbit/s Download und deaktivierter Cache. Keine parallele
Browserarbeit. [Rohwerte in kompakter Form](evidence/performance.json).

| Messung                                                  | Bestehende Sternwarte |  Cosmic Slice |
| -------------------------------------------------------- | --------------------: | ------------: |
| Prerenderte Projektlinks im DOM beobachtbar              |              213,5 ms |      217,3 ms |
| First Contentful Paint                                   |               1452 ms |       1468 ms |
| Bestehende Bestätigung nach erstem 3D-Render             |             8722,3 ms |     8864,5 ms |
| Tastendruck bis erste gemessene physische Kamerabewegung |               68,0 ms |       65,8 ms |
| Tastendruck bis gespeicherte Rest-Pose                   |             3296,2 ms |     3215,8 ms |
| Draw Calls in der mobilen Macro-Probe                    |                    15 |            26 |
| Gerenderte Dreiecke in dieser Probe                      |                 33434 |          3006 |
| Ressourcen-Transfer laut Browser, lokaler Preview        |         1303913 Bytes | 1370136 Bytes |

Die erste DOM-Beobachtung ist keine Paint-Zeit. Die 3D-Readiness ist kein
exakter GPU-Presentation-Timestamp. Die physische Kamera wird auf browser-rAF
beobachtet; die Eingabezeit umfasst die Automationszustellung. Die spätere
Rest-Pose misst das Ende der animierten Bewegung, nicht deren erste Reaktion.
Ein Sample je Variante belegt keinen statistischen Performancegewinn.

Der Cosmic-Chunk umfasst 11600 Bytes, per `gzipSync` 3993 Bytes. Das bestehende
Three-/R3F-Sammelbundle bleibt groß (864661 Bytes, gzip rund 228 kB). Es wird
weiter bedingt geladen; die Build-Warnung über große Chunks bleibt sichtbar.
Die 256²-Nebeltextur kostet 54023 Bytes. Das Vorab-Backen entfernt 327680
Noise-Oktaven aus dem Mount-Pfad und ist mit
`node experiments/living-cosmos/bake-nebula.mjs` reproduzierbar. Es tauscht
Laufzeit-CPU gegen einen kleinen Asset-Transfer; ein netto schnellerer FCP
wird daraus nicht behauptet. Sterne nutzen einen Points-Draw, keine
Partikelobjekte pro Stern; Bewegung invalidiert nur bis zum Stillstand.

Zusätzlich ein serieller Lighthouse-13.5.0-Mobile-Lauf mit simulierter
Drosselung: **68 Punkte**, FCP **3165 ms**, LCP **3181 ms**, TBT **757,5 ms**,
CLS **0,0136**, Speed Index **3933 ms**, keine Laufwarnungen.
[Messdaten](evidence/lighthouse.json). Reproduktion mit dem vorhandenen
`scripts/perf/g2d/measure.mjs`, dem lokal installierten Lighthouse-13.5.0-Modul
in `LIGHTHOUSE_MODULE`, `ATLAS_PERF_OUTPUT` als Ausgabeverzeichnis und
`http://127.0.0.1:4173/atlas/observatory/?cosmos=preview&world=observatory`
als URL. Ein Lauf genügt hier zur begrenzten Bestandsaufnahme, nicht für einen
Release-Performanceentscheid. CPU-Blocking und spätes 3D-Ready bleiben offen;
keine Smartphone-FPS, Feld-CWV oder vollständige Performancefreigabe behauptet.

## Offene Art-Probleme und Freigabe

Die dunkle kosmische Identität und die lesbare Nexus-Entdeckung sind in den
finalen Bildern sichtbar. Grobes Z-Fighting oder verdeckte Touch-Aktionen
wurden dort nicht gefunden. Das ist noch keine außergewöhnliche visuelle
Abnahme:

- Die Desktop-Übersicht wirkt eher wie eine sparsame Sternkarte als wie ein
  monumentaler galaktischer Raum. Kleine Projektformen und große Headline
  begrenzen das Größenempfinden.
- Die dunklen Sprite-Beschriftungen sind lesbar, wirken aber noch aufgesetzt.
- Angeschnittene Nachbarsysteme am Rand lenken in Nahansichten etwas ab.
- Die mobile Bedienzone ist weiterhin dominant.
- Reale Smartphone-GPU-Performance und eine ausgedehnte manuelle Screenreader-
  Prüfung sind nicht durch Desktop-Emulation oder Axe ersetzt.

Der konkrete nächste Schritt ist die **menschliche Entscheidung über Nebelraum
und den gewünschten Maßstab** anhand der vier Bilder und des interaktiven Slice.
Erst danach: ein kleines Origin-Storyboard samt räumlichem Übergang zur
Sternkarte, die Beschriftungs-/Nahkamera-Regeln verfeinern und die sechs übrigen
Projekt-Systeme nacheinander mit eigener belegbarer Entdeckung entwickeln.
Die vorhandenen Kamera-, History-, Canvas- und Readiness-Verträge bleiben dabei
die gemeinsame Grundlage. Bis zu dieser Bildfreigabe endet die Umsetzung hier.
