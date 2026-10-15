# G2-C — transparente CI-Nachprüfung

Der erste vollständige GitHub-Lauf auf `5b81237856e23421c8661afde1d10ddbb07a4cba`
war erfolgreich, aber nicht retry-frei:

- [Root-Workflow](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38145404942):
  63 direkt bestanden, zwei flaky mit erfolgreichem Retry, anschließend 3/3 G1-Stress.
- [G0-Workflow](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38145404792):
  vollständig erfolgreich, 16 Browser-Passes und acht bestehende Skips.
- Lokal auf demselben Stand: 65/65 ohne Retry. Lokaler Erfolg beweist also keine
  Stabilität unter der anderen CI-Last.

## Ressourcenprüfung

Der unabhängige QA-Agent hat den Fehlertrace erneut untersucht. Vier gleich
gerenderte Ansichten hatten in der DOM-Telemetrie Geometriewerte
**23 → 54 → 23 → 23**, Programme **6 → 11 → 6 → 6**; Draw Calls blieben 29 und
Dreiecke 6598. Der Retry meldete viermal 54. Das ist kein fortlaufendes Wachstum,
aber auch kein sauber vergleichbarer Messpunkt.

Die installierte R3F-Version gibt deklarative Szenenressourcen mit
`unstable_scheduleCallback(unstable_IdlePriority, ...)` frei. Die bisherige
Telemetrie schrieb nur während eines Demand-Frames. Eine Freigabe nach dem letzten
Frame aktualisierte den bereits geschriebenen DOM-Wert nicht. Zusätzliche feste
400 ms änderten daran nichts.

`RendererMetrics` liest jetzt auf ein explizites Diagnose-Ereignis die aktuellen
`gl.info`-Werte. Das löst keinen Frame aus. Der Listener wird beim Unmount entfernt.
Der Test wartet auf eine echte Browser-Leerlaufgrenze, löscht den alten
Diagnosewert, fordert einen frischen Wert an und prüft die echte Pose zusätzlich.
Die bisherigen `<= baseline`-Assertions für Geometrien/Texturen/Programme und die
unveränderte Framezahl während einer Sekunde Ruhe bleiben bestehen. Kein neuer
Maximalwert, Toleranzaufschlag oder erwarteter Ressourcenwert wird eingeführt.

Der unabhängige QA-Agent wiederholte den reparierten Test auf dem Production-Build
dreimal: **3/3 ohne Retry**, zwölf gleiche Messpunkte mit 23 Geometrien, sieben
Texturen und sechs Programmen. Der Leerfilter reduziert Draw Calls 29 → 7 und
Dreiecke 6598 → 4044. Die [Rohdaten und früheren DOM-Snapshots](evidence/g2c/qa/ci-repair/)
bleiben nebeneinander erhalten. Das unabhängige Architektur-Recheck fand im
Listener/Cleanup und in der disjunkten Testaufteilung keine weiteren P0/P1.

## Bestehender Nexus-Test

Im Trace beanspruchte `Create context` **22.123 ms** des unveränderten
30-Sekunden-Testbudgets. Navigation und erste Assertions waren erfolgreich;
die folgende Bild-Auswertung überschritt mit rund 7.387 ms Restdauer das Budget.
Ein ähnlicher Kontext-Stall von 28.4 s war bereits im G2-B-Lauf dokumentiert.

Die 13 Legacy-Portfolio-Tests erhalten deshalb ein eigenes Playwright-Projekt
`legacy-chromium` und damit einen frischen Worker/Browser nach der WebGL-Suite.
Die übrigen 52 Fälle bleiben im Projekt `chromium`. Es bleiben exakt **65 Tests**;
auch der ursprüngliche G1-Stress wird unverändert ausgeführt. Timeouts, Retries,
Assertions und der einzelne CI-Worker bleiben unverändert. Playwrights installierter
Worker-Hash enthält die Projekt-ID; die [offizielle Worker-Dokumentation](https://playwright.dev/docs/test-parallel#worker-processes)
beschreibt den Browser pro Worker.

Diese Trennung adressiert die beobachtete Laufzeitkopplung, beweist jedoch nicht
allein eine endgültige Ursache des Chromium-Kontext-Stalls. Erst der neue volle
CI-Lauf beurteilt die Reparatur. Dessen exakter SHA und Ergebnisse werden im
Draft-PR und Abschlussbericht genannt; die ursprünglichen beiden Retries werden
dadurch nicht aus der Historie entfernt.

Die vollständige lokale Production-Suite bestand nach dieser Reparatur mit
**65/65 in 5,0 Minuten ohne Retry**, darunter der ursprüngliche Nexus-Test.
[Abschlusslog](evidence/g2c/verification/root-browser-after-ci-repair.log).
Auch die 22 Root-Unit-Tests bestanden erneut.

Die Performance-Traces behalten ihr dokumentiertes Build-Manifest. Neben der
bereits genannten mobilen Offen-Panel-CSS-Korrektur unterscheidet sich der finale
Build nun durch den Diagnose-Listener (WorldCanvas rund 0.05 kB gzip größer).
Keine Welt, Geometrie oder Ladeoptimierung wurde geändert; dennoch wird keine
byteidentische Performance-Messung des endgültigen Builds behauptet.
