# G2-D Performance — Phase 1, isolierter Kandidat

**Status: funktionierender Kandidat; noch keine belastbare Zeitverbesserung behauptet.**
Ausgangspunkt ist `c2e338cf723f1ec6e20b4493175a8783ac95b405`. Der isolierte
Worktree `F:/Coding/atlas-g2d-performance`, Branch `codex/g2d-performance`,
enthält einen zusätzlichen statischen Einstieg unter `/atlas/`. Die Root-Produktion
und ihre bestehenden Query-URLs werden in diesem Checkpoint nicht ersetzt.

## Ursache und getesteter Eingriff

Die bisherige `/?atlas=preview`-Antwort enthält zunächst das komplette prerenderte
Portfolio: 145.038 HTML-Bytes im Kandidatenbuild. Dazu lädt der Root-Einstieg
sämtliche Legacy-Styles, bevor React die Vorschau einsetzt. Die integrierten
G2-C-Traces zeigen Origin-Starttasks im Entry-Bundle mit 1.864–2.682 ms simulierter
Dauer. Das ist ein begründeter Bootstrap-Verdacht, noch keine isolierte
Zuordnung dieser gesamten Taskzeit zum HTML.

Der Kandidat rendert dieselbe `ExperienceRoot` schon beim Build in eine separate
statische HTML-Datei: **11.067 Bytes** einschließlich sieben semantischer
Projektartikel und ihrer geprüften Repository-Links. Der Einstieg hydratisiert
diese vorhandene Oberfläche. Er importiert nur Atlas-Styles, die bestehenden
Schriften und gemeinsame Browser-Defaults; keine Legacy-Oberflächen-Styles.
Die schwere Three/R3F-Schicht bleibt hinter der bestehenden lazy Canvas-Grenze.
Weder Welt, Geometrie, Qualitätsstufe noch Kamera werden für die Messung vereinfacht.

Es gibt keinen zweiten Router, Store, Canvas oder Render-Ready-Vertrag. Navigation
aus `/atlas/` behält den statischen Pfad; alte Root-Query-URLs funktionieren weiter.
Zwei CSS-Imports wurden aus Komponenten in beide Browser-Einstiege verschoben,
damit der vorhandene Prerender-Prozess die Experience serverseitig lesen kann.
Ohne JavaScript bleiben die sieben Projekte und Quellen zugänglich; ein expliziter
Hinweis erklärt die räumliche Alternative. Der statische Ladezustand zeigt bereits
die echte Überschrift und Inhalte, ohne fertige 3D-Pixel vorzutäuschen.

## Phase-1-Prüfung

- `npm run build`: TypeScript, Vite und beide Prerender-Dokumente bestanden.
- `npm run test:unit`: alle 22 bestehenden Unit-Tests bestanden.
- `node scripts/perf/g2d/smoke.mjs`: Desktop 1440 und Mobile 390, fehlerfreie
  Hydration, echte Tastatur-Kamerabewegung, Weltwechsel mit identischem Canvas,
  Back auf die exakt vorherige Pose, bestehende No-JS-/No-WebGL-Inhalte bestanden.
- Tatsächliche Browseraufnahmen liegen unter `.verification/g2d/standalone-*.png`
  im isolierten Worktree; Mobile wurde visuell geprüft. Sie sind Funktionsbelege,
  keine neue freigegebene Art Direction.
- Keine neuen Dependencies; keine Änderung an bestehenden Test-Assertions.

Die kompletten Engineering-Gates und endgültige CI bleiben Aufgabe des integrierten
Heads. Ein kurzer Smoke ist keine Abnahme des Gesamtprojekts.

## Phase 2: kontrollierte Vergleichsmessung

Die Art-Agenten arbeiten gleichzeitig mit Browsern. Deshalb läuft hier noch kein
voller Timingvergleich. Nach einem expliziten gemeinsamen Ruhefenster:

1. Unveränderten G2-C-Build und Kandidaten in getrennte unveränderliche Dist-Ordner
   kopieren; SHA256-Dateilisten und Source-Revision dokumentieren.
2. Identischen statischen Server, Cache-Policy, Chromium/SwiftShader und CPU-/Netz-
   Profile verwenden. Ports 4183/4184 sind diesem Agenten zugeteilt.
3. Mindestens drei gepaarte Wiederholungen je Variante: Lighthouse plus reale
   CDP-Render-Ready-/Pixel- und erfolgreiche Kameraeingabe-Messung. Ursprung und
   Sternwarte berücksichtigen. HTML/FCP, echter Frame und Kamerarest getrennt nennen.
4. Originale Root-Query-Route als Baseline gegen den neuen statischen Einstieg
   vergleichen; getrennt festhalten, dass alte URLs noch den bisherigen Ladepfad
   nutzen. Keine heimliche Score-Verbesserung durch reine Landingpage messen.
5. Rohtraces lokal archivieren, Hashmanifest und kleine Zusammenfassungen in Git.
   Erst nach gemessenen Verbesserungen und Funktionsprüfung Integration empfehlen.

## Entwicklungsartefakte: Inventar und reversibler Archivplan

Inventar auf G2-C-HEAD: **30.402.118 Bytes** getrackte Arbeitsdateien insgesamt.
Darunter 63 Gzip-Dateien mit **15.145.485 Bytes** und 100 PNGs mit
**13.319.777 Bytes**. `docs/experience` umfasst **26.803.284 Bytes**. Dies sind
Dateigrößen im Checkout, nicht die Größe aller historischen Git-Objekte.
Der größte einzelne bestehende Trace beträgt 705.618 Bytes.

Für neue G2-D-Messungen bleiben vollständige Traces und Wiederholungsbilder in
`.verification/g2d` beziehungsweise einem benannten lokalen ZIP-Archiv. Ein
Manifest verzeichnet Pfad, SHA256, Bytes, Source-Revision, Skriptversion und
Messparameter. Versioniert werden reproduzierbare Skripte, Ergebnis-JSON,
Interpretation sowie wenige repräsentative Desktop-/Mobile-Aufnahmen.

Eine spätere Auslagerung der vorhandenen G2-C-Rohdaten sollte zunächst ein
vollständiges Archiv erzeugen, dessen Hash und Wiederherstellung geprüft werden.
Erst nach gesicherter externer Ablage werden Referenzen umgestellt und gegebenenfalls
Dateien in einem normalen Commit entfernt. **Hier wurde nichts historisch gelöscht,
keine Git-Historie umgeschrieben und kein Ablaufdatum eines CI-Artefakts als
dauerhafte Archivgarantie ausgegeben.** Der bestehende Bestand bleibt verfügbar.

Vercel `bundle-conditional` und `rendering-resource-hints` wurden konkret gelesen;
der Kandidat trennt benötigte Einstiegsmodule und erhält progressive Inhalte.
Kein zusätzlicher Preload wird ohne Messung eingebaut. Living-Atlas verlangt
weiterhin echte Pixels, Kamera und semantische Inhalte statt bloßer Lade-Badges.
