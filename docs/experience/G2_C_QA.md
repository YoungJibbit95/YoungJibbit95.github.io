# G2-C — unabhängige Browser- und Accessibility-Abnahme

**Agent E:** `/root/independent_qa`, getrennt von Feature-Implementierung und Art Direction.
Ausgangs-SHA: `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Arbeitsbereich: `tests/observatory*.spec.ts` (keine Unit-Dateien), dieser Bericht und
`evidence/g2c/qa/`. Keine Produktionsdatei, Abhängigkeit oder zentrale Testkonfiguration
wurde durch E geändert. Integration und Commit liegen beim Lead.

**Unabhängiges lokales Funktions-/Render-Gate: PASS.** Der stabile Integrationslauf
bestand **16/16 Tests in 1,7 Minuten, ohne Retry**. Danach bestand ein zusätzliches 17. Tastatur-Regressionsszenario bei 390 und 768 px nach gezielter CSS-Reparatur
(**1/1, ohne Retry, 10,9 Sekunden**).
[Vollständiger 16er-Lauf](evidence/g2c/qa/browser-tests.log),
[zusätzlicher Fokus-Lauf](evidence/g2c/qa/focus-after.log).
Gesamtfreigabe bleibt bis zu Root-/G0-/Stress-/Performance- und finalen GitHub-Prüfungen beim Lead.

## Prüfverfahren

- Geladene Skills: `living-atlas-world-qa`, `web-design-guidelines`,
  `vercel-react-best-practices`; React-Regeln für transiente Werte, abgeleiteten
  Zustand und globale Listener zusätzlich gelesen.
- Die [aktuellen Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
  wurden am 11.10.2026 frisch abgerufen. Prüfung umfasst Accessibility, Fokus,
  Formulare, Motion, Typografie, Inhalte, Navigation, Touch und Layout.
- Der externe V4-Downloadpfad war für diesen Agenten nicht mehr vorhanden.
  Verwendet wurden der vollständige aktuelle Nutzerauftrag, die projektspezifische
  QA-Anweisung und der G2-B-Checkpoint. Der Lead hatte die V4-Unterlagen zuvor gelesen.
- Eigene Playwright-Konfiguration mit einem Chromium-/SwiftShader-Worker,
  null Retries, Port 3000 des Leads und isoliertem Output unter
  `.verification/g2c-qa/`. Kein konkurrierender Build, Install oder Devserver.
- `atlas-pose` stammt aus der echten CameraControls-Kamera. Verglichen werden
  Position, Target, FOV und Zoom. Die Suite erhält die G1-Pixelgrenzen:
  mehr als 35 farbige helle Pixel und mehr als sechs Farbstufen.
- Screenshot-Sampling blendet nur DOM-Overlays aus. Es bewertet den tatsächlich
  komponierten Canvas, niemals die Anwesenheit eines Canvas oder die Farbe eines HTML-Labels.
- Renderer-Nachweise lesen `gl.info`: Draw Calls, Dreiecke, Geometrien, Texturen,
  Shader-Programme und Frame-Zähler. Das sind Ressourcen-/Rendering-Zähler,
  **keine VRAM-, FPS- oder Web-Vitals-Messung**.

## Testverträge

`tests/observatory.spec.ts` prüft:

1. Übersicht, Cluster und Projektfokus bei 390, 768, 1440 und 1920 px mit
   tatsächlichen Pixeln, Kamerabewegung, LOD, Screenshot und Overflow-Prüfung.
2. Alle sieben IDs: korrekte Kameraziele, unterschiedliche gerenderte Porträts,
   lesbare Dossiers, Quellen mit fixierten Repository-Revisionen.
3. Suche, Kategorie, Technologie, Status und Cluster; leerer Zustand und Reset;
   belegte technische Kante und Entfernung bei gefiltertem Endpunkt.
4. Macro/Meso/Micro nach physischer Kameradistanz, Fit All, Tastaturpan,
   Mausziehen, Mausrad sowie mobile Pinch-/Zweifinger-Gesten.
5. Origin → Observatory → Filter → Projekt → freie Kamera → Back/Forward;
   vollständige Pose und Filter mit numerischer Toleranz `1e-7`.
6. Schnelle Fokuswechsel, Eingabe während der Kamerafahrt und keine nachträglich
   wiederkehrende alte Zielpose.
7. Unsichtbare gefilterte Geometrie darf keine Klicks abfangen oder Filter löschen.
8. Ein Suchtext mit 160 nicht-ASCII-Zeichen bleibt nach Reload und Back erhalten.
9. Tastaturöffnung/Escape/Fokusrückgabe, 44-px-Buttons, Axe WCAG 2.1 A/AA und
   vollständige Inhalte bei deaktiviertem WebGL2.

`tests/observatory.resources.spec.ts` prüft nach einer Aufwärmrunde drei weitere
Origin-/Observatory-Zyklen auf wachsende GPU-Ressourcenzähler, einen stillstehenden
Frame-Zähler im Ruhezustand und sinkende Draw Calls/Dreiecke bei leerem Filter.
Der persistente Canvas muss genau einmal bestehen bleiben.

Die ergänzenden Unit-Verträge der Feature-Agenten prüfen sieben eindeutige IDs,
Evidenzgrenzen, Clusterbesitz, endliche Koordinaten, technische versus thematische
Kanten, Such-/Filter-Schnittmengen, Unicode-/URL-Normalisierung, responsive Kamera-
Erreichbarkeit, Fit-All-Hüllen und History. E hat diese Tests nicht umgeschrieben.

No-JavaScript wird durch den bestehenden Root-Prerender-Browsertest geprüft;
ein Vite-Devserver ist dafür keine gültige Produktions-HTML-Evidenz.
G0, ursprüngliche Root-Suite und drei G1-Stressläufe bleiben separate Lead-Gates.

## Frühe Befunde und Reparaturen

| Befund                                                   | Reproduktion und abschließender Stand                                                                                                                                                                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1: Pan während einer Fahrt lässt `transitioning` stehen | NovaCore-Fokus starten, ArrowRight: nach über fünf Sekunden falscher Zustand. Im Browser reproduziert. Lead ruft nun manuelle Unterbrechung auf; Regression besteht mit erhaltener Auswahl, stabilem `focused` und unveränderter Endpose. |
| P1: gefilterte Geometrie bleibt raycastbar               | Architecture Reviewer meldete aktive Handler an unsichtbaren Gruppen. C prüft nun tatsächliche Sichtbarkeit des getroffenen Objekts und seiner Eltern. Eigener Canvas-Klick-Regressionsfall besteht.                                      |
| Unicode-Roundtrip                                        | Lead korrigierte das Limit codierter Tokens. 160 chinesische Zeichen bleiben nach Reload und Back exakt erhalten; eigener Browserfall besteht.                                                                                            |
| Formularnamen                                            | Die verschachtelten Select-Labels enthielten Optionswerte im Namen. Explizite `aria-labelledby`-Referenzen erlauben eindeutige Namen. Alle vier Felder werden mit exaktem semantischem Label getestet.                                    |
| Entwicklungs-HMR                                         | Zusätzlich wurde der erste Such-/Filter-Lauf durch World-/Root-Updates beeinflusst. Trace hält die Vite-Invalidierung fest. Dieser Lauf wurde nicht als stabiler Pass gewertet.                                                           |

Erster Entwicklungs-Lauf: 10/12 bestanden. Ein weiterer gezielter Lauf wurde vor
Abschluss unterbrochen, um Integrationsreparaturen abzuwarten. Danach wurde die
gesamte erweiterte Suite erneut ausgeführt: **16/16 PASS**, ohne automatische
Wiederholung. Kein vorhandener G1-Test wurde durch E geändert.

## Gemessene Ressourcen und Accessibility

Nach der Aufwärmrunde blieben über vier Observatory-Rückkehrzustände
**23 Geometrien, 7 Texturen und 6 Programme** konstant. Diese nach dem
CI-Befund korrigierte Messung liest aktuelle Renderer-Zähler nach dem Browser-
Leerlauf; die vorherigen DOM-Abbilder waren teilweise veraltet. Drei vollständige
Production-Wiederholungen ohne Retry bestanden in 19,8 Sekunden. In allen zwölf
Rückkehrzuständen waren die Werte identisch. Der Frame-Zähler blieb jeweils
anschließend eine volle Sekunde unverändert. Ein leerer Filter senkte den gemessenen
Aufwand von **29 auf 7 Draw Calls** und **6.598 auf 4.044 Dreiecke**.
[Originalzähler](evidence/g2c/qa/observatory-renderer-resources.json).
Ein kurzer Plateau-Test beweist keine Langzeit- oder Treiber-Leakfreiheit.

### CI-Ausreißer des Ressourcentests und Messkorrektur

Am CI-HEAD `5b81237856e23421c8661afde1d10ddbb07a4cba` benötigte dieser Test
einen Retry. Die Erstlauf-Spur zeigt Geometrien **23 → 54 → 23 → 23** und
Programme **6 → 11 → 6 → 6**, jeweils bei gleichen 29 Draw Calls und 6.598
Dreiecken. Der Retry hielt dagegen viermal das alte Abbild 54/7/11 fest.
Das wurde ausdrücklich als Flake behandelt, nicht als stabiler Erfolg.

Die installierte R3F-Implementierung `disposeOnIdle` disponiert das Aufräumen
unmontierter Ressourcen über React Scheduler mit `IdlePriority`. Der bisherige
Diagnostiktext wurde nur während Demand-Frames geschrieben. Nachlaufende
Disposal-Arbeit konnte diese Werte verändern, ohne einen weiteren Frame
auszulösen. Eine feste Wartezeit von 400 ms las deshalb weiterhin einen alten
Text; sie erzeugte keinen konsistenten Messzeitpunkt.

Der Lead ergänzte einen reinen Diagnoseaufruf `atlas:sample-renderer`. Der Test
wartet auf den Browser-Leerlauf, leert das Diagnosefeld, fordert den aktuellen
`gl.info`-Stand synchron an und verlangt eine frische Antwort. Dabei wird kein
Render ausgelöst. Alle vier Kameraposen müssen zusätzlich exakt übereinstimmen.
Die bisherigen Obergrenzen gegenüber der ersten Messung, der Canvas-Count,
die Einsekunden-Ruheprüfung und die echte Filterreduktion bleiben erhalten.
Es gibt keinen höheren Grenzwert, Median, Maximalwert oder tolerierten Ausreißer.

[Drei Production-Wiederholungen](evidence/g2c/qa/ci-repair/repeat3.log),
[aktuelle Messung 1](evidence/g2c/qa/ci-repair/live-idle-run-1.json),
[Messung 2](evidence/g2c/qa/ci-repair/live-idle-run-2.json),
[Messung 3](evidence/g2c/qa/ci-repair/live-idle-run-3.json).
Das [frühere DOM-Abbild](evidence/g2c/qa/ci-repair/pre-idle-dom-snapshot.json)
bleibt zum Vergleich archiviert und ist kein Beleg für nachgelagerten Ressourcenbesitz.

Der mobile offene Nexus-Dossierzustand liefert **keine Axe-Verletzung** innerhalb
der geprüften WCAG-2.1-A/AA-Tags; [Rohdaten](evidence/g2c/qa/observatory-axe.json).
Enter öffnet die Erkundung, Fokus landet auf der Überschrift, Escape schließt sie
und gibt Fokus an den Auslöser zurück. Sichtbare Buttons besitzen mindestens
44 px Höhe. Canvas-Gesten besitzen DOM-, Tasten- und +/-Alternativen.

Statische Web-/React-Prüfung:

- `src/experience/observatory/ui/ObservatoryExplorer.tsx:160` — vier Select-Namen
  explizit zugeordnet; Search hat Name, Autocomplete, Längenlimit und native Abgabe.
- `src/experience/observatory/ui/ObservatoryExplorer.tsx:226` — Ergebniszahl als
  atomarer, höflicher Live-Status; Auswahl benutzt native Links und `aria-current`.
  Quellen bleiben echte externe Links.
- `src/experience/observatory/ui/ui.css:85` — scrollender, nicht modaler Bereich
  mit begrenzter Höhe und `overscroll-behavior: contain`; sichtbare Focus-Styles
  ergänzen bestehende globale Regeln.
- `src/experience/worlds/ObservatoryWorld.tsx:169` — transiente LOD-Werte liegen in
  Refs; React erhält nur geänderte LOD-Signaturen. Textur- und Linienressourcen haben
  Cleanup. Keine zusätzliche Engine oder RAF-Schleife.
- Für sieben Knoten ist Virtualisierung nicht sinnvoll. Server Actions, RSC,
  Video, externe Bild-CDNs und lange Datenlisten existieren hier nicht; generische
  Regeln erzwingen keine neue Abhängigkeit.

## Unabhängige Bildprüfung

22 unveränderte Browser-PNGs liegen im [Bildindex](evidence/g2c/qa/README.md).
Übersicht, Cluster, Dossier und Projektporträts wurden visuell geöffnet. Desktop
und Mobile zeigen eine andere räumliche Identität als Origin. Alle sieben
Silhouetten sind unterscheidbar. Vordergrundportal, ferne Stelen und gegenseitige
Verdeckung machen die Ausdehnung erkennbar. Kameranähe ergänzt echte Satelliten
und Architekturschichten.

Bei der letzten Bildprüfung fiel verdeckter Tastaturfokus hinter dem mobilen
Explorer auf. Der **echte Tab-Durchlauf** bestätigte bei 390 px verdeckte
Zurück-/Übersicht-/Zoom-Buttons; `elementFromPoint` traf jeweils die darüberliegende
Panel-Fläche. 768 px war unbetroffen. Der Lead blendet nun die verdeckte
Kameraleiste nur während des offenen mobilen Panels aus. Der neue 17. Test prüft
native Tab-Reihenfolge, tatsächliche Hit-Targets, weiterhin erreichbare Desktop-
Controls und Rückkehr der Zoom-Buttons nach Schließen. **Reparatur unabhängig
verifiziert, kein offener Befund aus diesem Fokusfehler.**

Die 16er-Suite und der zusätzliche Fokuslauf sind bewusst getrennt dokumentiert;
die vollständige Produktionssuite einschließlich aller 17 neuen Fälle wird
anschließend vom Lead ausgeführt.

## Grenzen und Empfehlung

**Ready für Integration dieser Tests und Evidenz.** Keine unabhängige
Produktionsfreigabe: finaler Feature-HEAD, Root/G0/Stress und Performance-Bericht
werden vom Lead zusammengeführt. Menschliche Art-Abnahme bleibt offen.

Chromium mit Software-WebGL und emulierten Touch-Eingaben ersetzt weder Safari/
Firefox noch echte Android-/iOS-Geräte, Screenreader-Hardware oder Feldmessungen.
Kein Merge, Produktionsdeploy oder G3 wurde durch diese QA freigegeben.
