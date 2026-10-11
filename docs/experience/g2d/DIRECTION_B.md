# Richtung B: Schnittwerk

Eigenständiger G2-D-Entwurf von Creative Direction B auf Basis von
`c2e338cf723f1ec6e20b4493175a8783ac95b405`, 11. Oktober 2026.
Kein Produktionsumbau, kein Commit, kein Paket-Install, kein Deploy. Keine Dateien
oder Entwurfsideen von Creative Direction A gelesen oder übernommen.

## Leitgedanke

Ein persönliches Entwicklerportfolio für neugierige Besucher und technische
Leser, als erkundbare Landschaft aus aufgeschnittenen Schichten. Die Richtungswahl
ist ein visueller Neubeginn bei unveränderten Projekten und Informationsquellen.
Taste-Einstellungen: **Design Variance 8 / Motion Intensity 4 / Visual Density 3**.
Native CSS mit vorhandenem Manrope und JetBrains Mono; kein fremdes Designsystem.

Die Frage ist nicht, wie sieben Softwareprojekte als sieben Symbole aussehen.
Sie ist, was Besucher beim Betreten ihrer Räume entdecken. Helle mineralische
Flächen, tiefe Schnitte und ein schwefelgelber Weg bilden eine zusammenhängende
Landschaft. Origin faltet sich zu einer offenen Passage. Die Sternwarte macht
innere Schichten zugänglich. Ein Makrobild orientiert; Annäherung und Öffnung
verändern die tatsächlich sichtbare Geometrie.

Das passt zur vorhandenen Persönlichkeit und Projektstimme: Dinge auseinandernehmen,
Bausteine verstehen, eigene Systeme zusammensetzen. Die Landschaft bleibt eine
Illustration. Weder Materialmenge noch Höhe, Weg oder Raumabstand behaupten eine
Leistung, Software-Abhängigkeit oder Produktreife.

## Ausgangsaudit und gelesene Quellen

Gelesen: `PHASE_STATUS.md`, `ART_DIRECTION.md`, `G2_ART_DIRECTION.md`,
`G2_C_SOURCES.md`, das aktuelle Observatory-Datenmodell und die vollständige neue
G2-D-Anforderung. Die lokal vorhandenen Art-Dokumente halten Originalvision und
V4-Storyboards fest. Der ursprüngliche V4-Download wurde in diesem Subtask nicht
erneut vollständig eingelesen.

Die G2-C-Desktopübersicht und die mobile NovaCore-Nahaufnahme wurden tatsächlich
geöffnet. Diagnose: viel unbewohnter Hintergrund, sieben abgesetzte Körper, kaum
Oberflächenmaßstab. In der mobilen Nähe füllt ein Objekt den Bildschirm, ohne
entsprechend mehr inhaltliche Entdeckung zu liefern.

- [basement.studio](https://basement.studio/): Live-Seite und ein tatsächlicher
  Browser-Frame untersucht. Der beobachtete Frame zeigt einen architektonischen
  Eingang mit Treppe, angeschnittenen Vordergrundflächen und tiefer Perspektive.
  Übertragen wird das Prinzip eines betretbaren Ortes und einer bewussten
  Schwelle. Keine Assets, Texte, Geometrien oder Animationen wurden kopiert.
- [Bruno Simon](https://bruno-simon.com/): Primärseite gelesen. Die dort ausdrücklich
  beschriebenen Funktionen Interact, Map, Unstuck und getrennte Touch-Gesten
  zeigen, dass Erkundung Orientierung und eine Rückkehrfunktion braucht. In B
  entsprechen dem ein erreichbares Ortsregister, benannte Annäherung und Übersicht.
  Kein Fahrzeug, Spielsystem oder fremdes Asset übernommen; keine Behauptung,
  Brunos vollständige interaktive Welt in diesem Subtask durchgespielt zu haben.

## Raum, Material und Licht

Origin verwendet zwei kontinuierliche, eigens berechnete gewölbte Flächen. Ihr
mehrfach geschichteter Rand macht Dicke und Verlauf lesbar. Die Aktion verschiebt
beide Seiten und richtet die Kamera in die Passage. Dahinter steht bereits die
architektonische Form des ersten Projekts. Die zweite Aktion wechselt im selben
Canvas zur Sternwarte.

Die Sternwarte liegt in einem durchgehenden Tal mit geschwungenen Terrassen. Der
Vordergrund läuft über die Bildkante hinaus. Der erste Versuch mit freistehenden
Sockeln auf einer leeren Fläche wurde nach realer Bildprüfung ausdrücklich
verworfen; die finale Fassung ergänzt die landschaftliche Einfassung und eine
nähere, niedrigere Perspektive.

Mineralweiß und entsättigtes Graugrün tragen die Formen. Ein einzelner gelbgrüner
Akzent markiert den Weg und zugängliche Innenräume. Rauheit, eigens erzeugte
deterministische Bump-Textur, abgerundete Profilkanten und echte gerichtete Schatten
geben den Flächen Lesbarkeit. Tageslicht kommt von links oben, kühles Fülllicht
trennt Rückseiten. Keine Partikel, kein Bloom, keine Nebelschicht, kein HDRI.
Ein leichter CSS-Kontrastverlauf schützt die Überschrift; er ist keine 3D-Wirkung.

Sämtliche Geometrie und die 128-Pixel-Textur entstehen im eigenen Quelltext.
Es gibt keine heruntergeladenen Modelle oder Bilder und keine neue Abhängigkeit.
Die einzigen Schriftdateien stammen aus den bereits vorhandenen Paketen.

## Projektidentitäten

| Projekt   | Räumliche Interpretation                                                   | Grenze                                                                  |
| --------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Nexus     | Vier aufgeschnittene Hofbereiche um einen Kern, verschiebbare Dachsegmente | Vier Clients und gemeinsamer Core sind belegt; keine laufende Sync-Demo |
| Cerebri   | Gegeneinander verdrehte, geschichtete Zeitbögen                            | Keine dargestellte Planer-Ausführung; 0.2.0 unveröffentlicht            |
| NovaCore  | Mehrere durchschreitbare Tragwerke mit gemeinsamer Achse                   | Experimentelle Engine-Grundlage                                         |
| Nemisis   | Zwei gerichtete Schnittwände, die einen Raum für Bewegung öffnen           | Frühe Sandbox, kein fertiges 6v6-Spiel                                  |
| Adventura | Begehbar wirkende rechtwinklige Terrassen                                  | Illustration von Voxel-Weltbau, kein Spielasset                         |
| YjsE      | Flache, gestapelte und unterteilte Ebenen                                  | 2D-Prototyp, keine behauptete Verbindung zu Adventura                   |
| YJarvis   | Geschützte, seitlich offene Hülle                                          | Lokaler macOS-Assistent; keine native Windows-Unterstützung behauptet   |

Alle Projekttexte, Status und revisionsfesten Quellen werden direkt aus dem
vorhandenen geprüften `observatoryProjects`-Datensatz importiert. Nexus' vier
öffentliche Clients und der gemeinsame Core wurden zusätzlich auf dem dort
gepinnten README-SHA abgefragt. Die Wege im Raum sind kuratorische Navigation;
die einzige bereits belegte technische Abhängigkeit bleibt NovaCore/Nemisis.

## Tatsächliche Kamerastoryboards

Perspektivische Kamera, FOV 43°, echte Position/Target-Steuerung. Alle Werte sind
Entwurfskoordinaten, nicht Änderungen der Produktions-Registry.

| Zustand               | Desktop Position → Target    | Mobile Position → Target    |
| --------------------- | ---------------------------- | --------------------------- |
| Origin Übersicht      | `[79,47,108] → [-1,7,-10]`   | `[19,40,144] → [0,7,-13]`   |
| Origin offene Passage | `[21,20,49] → [0,9,-29]`     | `[2,18,54] → [0,9,-29]`     |
| Sternwarte Übersicht  | `[100,71,135] → [-13,1,-21]` | `[42,62,121] → [-15,13,-7]` |
| Nexus Annäherung      | `[20,32,63] → [-20,4,12]`    | `[14,48,85] → [-20,1,12]`   |
| Nexus Entdeckung      | `[9,29,47] → [-20,4,12]`     | `[10,58,76] → [-20,1,12]`   |

Mobile erhält eine vertikale Annäherung statt einer verkleinerten vollständigen
Karte. Einige Randprojekte liegen absichtlich außerhalb des Ausschnitts; alle
sieben bleiben im nativen Projektregister erreichbar. Die Entdeckung zieht die
Kamera hoch genug, damit der offene Hof und sein Kern zugleich erkennbar sind.

Die konkrete räumliche Entdeckung: **Nexus erkunden → Den Kern freilegen**. Vier
Dachsegmente werden sichtbar nach außen versetzt; die Kamera betrachtet den
offenen Innenraum. Der belegte `@nexus/core` steht räumlich in der Mitte. Daneben
bleiben die vier Client-Bezeichnungen und der nicht produktionsverifizierte
Cloud-/Sync-Stand als HTML lesbar. Schließen und Übersicht kehren erreichbar
zurück. Das ist eine illustrative Architekturöffnung, keine G3-Systemwelt.

## Skills: tatsächlicher Einfluss

- **Living Atlas Experience Design:** vorher definierte Makro-/Meso-/Detailposen,
  kausale Öffnung, Informationsparität im HTML, reale Pixel- und Kamera-Belege.
- **Taste:** klare Lesart und Designparameter, eine kontrollierte Palette,
  vorhandene charakteristische Schrift, keine Dashboard-Anordnung, keine
  erfundenen Metriken oder dekorativen Statuswerte.
- **Redesign:** Screenshots vor Umsetzung geprüft; bestehender Stack und
  Projektdaten erhalten; Kontrast, Fokus, mobile Komposition und Rückkehr zuerst.
- **Vercel React Best Practices**, einschließlich `rerender-use-ref-transient-values`
  und `rendering-hoist-jsx`: statische Daten außerhalb der Komponenten,
  Geometrie-Memoisierung, Kamera/Projektionswerte in Refs statt React-Zustand pro
  Frame, Demand-Rendering ohne permanente Animationsschleife.

Die generischen Landingpage-Empfehlungen zu Stockbildern, Rastergrafiken, neuen
UI-Frameworks und dem Umbenennen eines Projekts namens Nexus sind auf diesen
explizit räumlichen, quellengebundenen Auftrag nicht anwendbar. Der helle Entwurf
ist eine bewusst festgelegte Vergleichsrichtung; er ist keine freigegebene
Dual-Theme-Produktionsoberfläche.

## Reproduktion und Scope

`node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3012 --strictPort`

Adresse: `/experiments/g2d-design/direction-b/`; Origin direkt über `?world=origin`.
`node experiments/g2d-design/direction-b/capture.mjs` prüft beide Ansichten und
schreibt die echten PNGs sowie Renderer-/Interaktionswerte in
`docs/experience/evidence/g2d/b/`.

`node node_modules/typescript/bin/tsc --noEmit --project experiments/g2d-design/direction-b/tsconfig.json`
prüft den isolierten Entwurf. Die Root-tsconfig umfasst Experimente absichtlich
nicht; deshalb gibt es hier einen eigenen Prüfaufruf.

Dieser Entwurf hat genau einen Canvas und CameraControls. Er modifiziert keine
Produktionsszene, Registry, History, Kamera oder Render-ready-Verträge. Eine
Integration nach menschlicher Richtungsfreigabe muss die vorhandene Registry und
CameraRig verwenden; der isolierte Prototyp ist kein zweiter Produktionsrouter.
Vollständige History-, Such-/Filter- und G0/G1-Regressionsprüfungen gehören dem
späteren integrierten Engineering-Gate, nicht diesem Art-Nachweis.
Freies Kamera-Pan/Zoom besitzt in diesem isolierten Entwurf noch keinen eigenen
Tastaturhandler. Die benannten Ziele, Entdeckungsaktion und Rückkehr sind per
nativen Buttons tastaturbedienbar. Die Produktions-G0/G1-Tastaturverträge bleiben
unverändert; ihre spätere Verwendung ist eine Integrationsanforderung.

## Tatsächliche Verifikation und Aufnahmen

Der abschließende isolierte Browserlauf schrieb **17 Evidenzeinträge und zehn
echte Screenshots** bei 1440×900 und 390×844. Keine Browserfehler; Axe meldete in
beiden Entdeckungsansichten **null Verstöße** für WCAG 2 A/AA und 2.1 AA.
Die separate TypeScript-Prüfung und Prettier-Prüfung bestanden.

Geprüft wurden tatsächliche Kameraverschiebung zwischen Übersicht, Annäherung
und Entdeckung, freie Drag-Eingabe mit verändertem Kamera-Vektor, Stillstand des
Demand-Renderers, sieben Registereinträge, inerte Hintergrundinhalte bei offenem
Register, Escape und Fokus-Rückgabe, vier echte Client-Texte samt gepinntem
Quellenlink, Weltwechsel mit identischer Canvas-DOM-Instanz, gleiche Detailpose
bei Reduced Motion sowie fehlender horizontaler Dokumentüberlauf.

Der Mobile-Experience-Agent prüfte B unabhängig visuell. Seine native
CDP-Touch-Prüfung wurde auf Lead-Anweisung wegen konkurrierender Software-WebGL-
Last beendet; **kein Touch-Pass wird daraus behauptet**. Die eigene mobile
Kameraprüfung verwendet echte Maus-Drag-Ereignisse im Touch-fähigen Browserkontext,
keine programmatische Pose als Ersatz für die Eingabe.

Im anschließenden seriellen Lauf meldete die unabhängige QA erfolgreiche native
CDP-Pinch-/Drag-Eingaben bei 390 und 768 px sowie Register/Escape, Tastatur-Zielwahl,
Leerlauf und Axe bei 390 px. Die präzisierte Label-Randprüfung zeigte keine
angeschnittenen Buttons. Das ist ein gesonderter QA-Nachweis und wird nicht als
Teil des früheren B-Laufs ausgegeben. QA maß noch zu kleine Header-Ziele; Brandlink
und Weltbuttons erhielten daraufhin ausdrücklich 44 px Mindesthöhe.

Die zusätzliche unabhängige Prüfung von drei Desktop-Weltzyklen fand einen
echten Ressourcenfehler: **130 → 134 → 138 Geometrien** bei identischer Pose,
126 Draw Calls und 78.410 Dreiecken. Texturen blieben bei zwei, Programme bei vier;
zusätzliche 900 ms Leerlauf beseitigten den Anstieg nicht. Ursache waren die
über `mesh.geometry` übergebenen `BufferGeometry`-Objekte von `Ribbon` und `Fold`.
Sie gehören keiner JSX-Geometrie-Kindinstanz und werden deshalb nicht durch
R3Fs normale Instanzfreigabe entsorgt. Eine komplette Reise verlor eine
Observatory-Ribbon sowie Origin-Ribbon und zwei Fold-Puffer, also exakt vier.

Beide Komponenten besitzen jetzt eine explizite, an die Geometrie gebundene
Effect-Aufräumfunktion mit `geometry.dispose()`. Jeder Fold teilt seinen Puffer
zwischen sieben Meshes; der Besitzer gibt ihn einmal frei. Arc und Terrain
hatten bereits eigene Freigaben. Geometrie, Material, Kamera und strenge
Ressourcenassertionen wurden nicht verändert. TypeScript und Formatierung
bestanden nach dem gezielten Fix. **Der erneute unabhängige Drei-Zyklen-Lauf
besteht: 126 / 126 / 126 Geometrien, zwei Texturen und vier Programme.** E hat
danach den vollständigen Artist-Capture auf dem reparierten Stand ausgeführt:
17 Evidenzeinträge, zehn aktualisierte PNGs, keine Fehler/Axe-Verstöße. Native
Touch-Gesten auf 390/768 bestehen ebenfalls; siehe [QA](QA.md).

Ein früher Axe-Lauf fand ein `aria-label` auf einem rollenlosen Container; die
benannte Szene besitzt jetzt `role="region"`. Ein früher mobiler Lauf deckte eine
Footer-Überlagerung durch den semantischen Abschnitt auf; dessen Beginn liegt nun
stabil unterhalb des Viewports. Die ursprünglichen drei.js-HTML-Portal-Labels
verursachten beim Weltwechsel einen DOM-Aufräumfehler; die finale Lösung projiziert
native HTML-Labels mit der echten Kamera und benötigt diese Portale nicht.

Nach dem erfolgreichen Gesamtlauf wurde aus dem unabhängigen Mobile-Review noch
die Randprüfung der Labels präzisiert: halbe tatsächliche Elementbreite plus 16 px
statt fixer 32 px. Damit wird ein Label an der Bildkante vollständig verborgen,
statt einen halb sichtbaren Button anzubieten. Es verändert nur DOM-Sichtbarkeit,
keine Kamera-, Geometrie- oder Projektlogik. Auf Lead-Anweisung prüft diese letzte
Korrektur die unabhängige QA in ihrem seriellen Browserfenster. E führte
`verify-label-edges.mjs` erfolgreich aus: vollständig sichtbare Labels mit
mindestens 16 px Seitenabstand bei 390/1440. Die zehn kuratierten Bilder stammen
aus dem anschließenden vollständigen Capture auf dem reparierten Stand.

| Reales Canvas-Bild            | Draw Calls | Dreiecke | geprüfte Farbbereiche |
| ----------------------------- | ---------: | -------: | --------------------: |
| Sternwarte Desktop-Übersicht  |        126 |   78.410 |                    79 |
| Sternwarte Desktop-Entdeckung |         89 |   71.006 |                   105 |
| Sternwarte Mobile-Übersicht   |        107 |   74.702 |                    80 |
| Sternwarte Mobile-Entdeckung  |         77 |   70.122 |                    88 |
| Origin Desktop-Übersicht      |         46 |   65.646 |                    54 |
| Origin Mobile-Übersicht       |         46 |   65.646 |                    58 |

Die Pixelwerte stammen aus `WebGLRenderingContext.readPixels`, nicht aus
HTML-Text oder Screenshot-Dateigrößen. Die Zahl der Farbbereiche zählt auf vier
Bit quantisierte RGB-Kombinationen in einer Stichprobe. Sie ist ein technischer
Renderbeleg, keine Art-Bewertung. Draw Calls zählen den eigentlichen sichtbaren
Renderdurchlauf; zusätzliche Schattenpass-Kosten sind damit nicht vollständig
beschrieben. Es liegen 126 geladene Geometrien in der Sternwarte beziehungsweise
35 in Origin vor. Diese Kosten begründen Optimierungsbedarf vor Produktion.

Nachweise: [Skript](../../../experiments/g2d-design/direction-b/capture.mjs),
[Messwerte](../evidence/g2d/b/render-and-interaction-evidence.json),
[Laufprotokoll](../evidence/g2d/b/capture.log).

| Zustand              | Desktop                                                  | Mobile                                                 |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| Origin Einstieg      | [1440](../evidence/g2d/b/origin-overview-1440.png)       | [390](../evidence/g2d/b/origin-overview-390.png)       |
| Origin Passage       | [1440](../evidence/g2d/b/origin-open-1440.png)           | [390](../evidence/g2d/b/origin-open-390.png)           |
| Sternwarte Übersicht | [1440](../evidence/g2d/b/observatory-overview-1440.png)  | [390](../evidence/g2d/b/observatory-overview-390.png)  |
| Nexus Annäherung     | [1440](../evidence/g2d/b/observatory-approach-1440.png)  | [390](../evidence/g2d/b/observatory-approach-390.png)  |
| Nexus Entdeckung     | [1440](../evidence/g2d/b/observatory-discovery-1440.png) | [390](../evidence/g2d/b/observatory-discovery-390.png) |

Die zehn Bilder wurden tatsächlich geöffnet und visuell geprüft. Weder ihr
Vorhandensein noch das grüne Protokoll ersetzt die Freigabe des Nutzers.
Lokale `first-*`- und Referenzaufnahmen sowie Server-Logs/PID sind per lokalem
`.gitignore` von der kuratierten Lieferung ausgeschlossen. Kein historisches
G0/G1/G2-C-Artefakt wurde verändert oder gelöscht.

## Grenzen und nächste Entscheidung

Stärke: Eine kohärente helle Raumwelt mit tatsächlicher Tiefe und einer sinnvollen
Öffnung; Mobile zeigt große Formen statt winziger Punkte. Der menschliche Maßstab
entsteht durch Durchgänge und Innenhöfe, nicht durch erfundene Personenmodelle.

Schwäche: Die Sternwarte liest sich weiterhin teilweise als Architekturmodell.
Die weitgehend gemeinsame Materialsprache braucht bei einer Freigabe mehr
ortsbezogene Oberflächen und eine feinere Lichtregie. Die starre Öffnung ist
funktional; eine fertig inszenierte, unterbrechbare Material-/Bewegungsfolge fehlt.
Die breiten Landschaftskanten sind räumliche Einfassung, haben selbst keine
interaktive Projektinformation. Diese Punkte bleiben Art-Arbeit, auch bei grünen
Tests.

Keine echten Smartphone-Felddaten, keine Safari-/Firefox-Abnahme, keine belastbare
LCP-/TBT-Messung dieses Entwurfs. Software-WebGL lief teilweise parallel zu anderen
Agenten; seine Laufzeit ist kein vergleichbarer Performance-Benchmark. Aufwändige
Geometrie-/Schatten-Duplikate sollten nach einer Richtungswahl zusammengefasst
werden. Keine behauptete Produktionsreife oder menschliche Designfreigabe.

**Status: visueller Vergleichsentwurf für den menschlichen Checkpoint.**
Großflächige Übertragung auf Produktions-Origin und -Observatory bleibt gesperrt,
bis der Nutzer eine Richtung wählt. Kein G3.
