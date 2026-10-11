# G2-B: Origin Journey und Skill-Review

## Verhalten und Grenzen

Origin behält seinen deterministischen Graphen mit zwei gerichteten Kanten:
Signal → Verbindung → Horizont. `step=0` ist ruhig, `step=1` öffnet den Körper
und aktiviert ausschließlich die erste Kante, `step=2` beleuchtet zusätzlich
die zweite Kante und den Durchgang. Quelle und Verbindung sind ein gemeinsamer
erster fachlicher Schritt; es wurde kein zusätzlicher künstlicher Zwischenknoten
eingeführt. Diese Metapher behauptet keine reale Projekt-Telemetrie.

- **Einzelschritt:** „Signal senden“, danach „Signal weitergeben“. Übernimmt
  manuelle Kontrolle und verwirft einen laufenden Auto-Timer.
- **Abspielen:** startet beim ersten Abschnitt. Nach 4,2 Sekunden folgt der
  Horizont; nach weiteren 4,2 Sekunden endet die Wiedergabe. Kein Autostart.
- **Pause/Fortsetzen:** friert Restzeit, sichtbaren Impuls und Öffnungsbewegung
  ein. Pan/Zoom/Orbit bleiben verfügbar. Keine Kamera-Autofahrt durch Playback.
- **Wiederholen:** beginnt dieselbe Kette erneut, ersetzt ausstehende Arbeit.
- **Reset:** löscht Kanten, Öffnung, Portal und ausstehende Timer, ohne die Kamera
  zu versetzen. Reversibler visueller Reset, kein destruktiver Datenvorgang.
- **Orte:** direkte Fokusaktionen im Signalweg und Deep Links in der Ortsliste.
  Alle drei mobilen Posen sind eigenständig komponiert. Der Kontrollbereich
  verdeckt in der angepassten Übersicht nicht mehr die Unterkante der Skulptur.
- **Übergang:** ein ausdrücklicher Link am erreichten Horizont führt zur
  Sternwarte. Freie Navigation ist weiterhin möglich. Kein erzwungener Wechsel.

Zustandsvertrag: Kamera/Selektion/Filter liegen weiterhin in der vorhandenen
SceneDirector-History. Signalzustand ist ein vorübergehender Zustand dieser
Seitensitzung, unabhängig von der Navigationshistory. Weltwechsel und verborgene
Tabs pausieren Playback. Back erhält Signalzustand und exakte gespeicherte Pose;
nach Rückkehr aus einer anderen Welt beginnt beim Fortsetzen eine neue Verweildauer
für den aktuellen Abschnitt. Innerhalb der Welt bleibt die Restzeit bei Pause
exakt erhalten. Reload beginnt die Metapher wieder ruhig. Keine LocalStorage-
Persistenz, kein heimliches Autoplay beim Öffnen eines Links.

## Vollständiger Web-Guidelines-Audit

Installierter Skill: `.agents/skills/web-design-guidelines/SKILL.md`, vollständig
geladen. Frische [Richtlinien](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
vom 2026-10-11, Upstream-Commit `434b7f91364665f2f733b310ec54809bf8f37937`.
Geprüft wurden die vollständigen geänderten UI-Dateien: `ExperienceRoot.tsx`,
`ui/OriginSignalControls.tsx`, `experience.css`, `worlds/OriginWorld.tsx` und
`worlds/OriginArchitecture.tsx`. Die beiden letzten liefern R3F-Geometrie; ihre
bedienbare/lesbare DOM-Entsprechung wurde mitgeprüft.
Nach dem Ladepfad-Fix wurden die Richtlinien erneut geladen (identischer SHA256)
und zusätzlich `Entry.tsx`, `main.tsx` sowie `scripts/prerender.tsx` geprüft.

Konkrete Befunde, Zeilen des final formatierten Quelltexts:

- `src/experience/ExperienceRoot.tsx:135` - behoben: Weltwechsel waren reine
  onClick-Buttons trotz URL-Navigation; jetzt echte Links mit `aria-current`.
- `src/experience/ExperienceRoot.tsx:290` - behoben: Ortsnavigation hat nun
  echte Deep Links. Modifizierte Klicks und mittlere Maustaste werden nicht
  abgefangen; der bestehende Director verarbeitet nur normale Linkaktivierung.
- `src/experience/ExperienceRoot.tsx:307` - behoben: Übergang zur Sternwarte
  als Link statt navigierendem Button.
- `src/experience/ExperienceRoot.tsx:62` - behoben: Browser-Theme-Farbe war
  weiterhin die Legacy-Farbe; scoped auf Atlas gesetzt, beim Unmount restauriert.
- `src/experience/ui/OriginSignalControls.tsx:21` - behoben: automatische
  Wiedergabe hat Timeout-Cleanup und Pause bei verborgenem Dokument/World-Unmount.
- `src/experience/ui/OriginSignalControls.tsx:42` - PASS: atomare höfliche
  Statusansage; Pause ist nicht ausschließlich durch Farbe erkennbar.
- `src/experience/ui/OriginSignalControls.tsx:73` - PASS: Reset hat einen Namen,
  dekorative Lucide-Symbole sind versteckt; alle Aktionen funktionieren per Enter.
- `src/experience/experience.css:42` - behoben: globale Legacy-Radien vereinheitlicht.
- `src/experience/experience.css:251` - behoben: helle Skulptur lief mobil hinter
  Statustext. Kamerakomposition plus zurückhaltende Unterlage und lesbare Textfarbe.
- `src/experience/experience.css:326` - behoben: globale Legacy-Hover-Farbe
  überschrieb die Signal-Schaltfläche; scoped Hover behält kontrastierende Schrift.
- `src/experience/worlds/OriginWorld.tsx` - PASS: Pause invalidiert einmal und
  hält die Animation tatsächlich an; Reduced Motion erreicht dieselben Zustände.
- `src/experience/worlds/OriginArchitecture.tsx` - PASS: keine DOM-Attrappen,
  keine zusätzlichen Pointer-Fallen, statische wiederverwendete Geometrie.
- `src/experience/Entry.tsx:4` - behoben: statischer Legacy-Import und App als
  Suspense-Fallback luden/mounteten die alte Anwendung zuerst. Jetzt bedingte
  Lazy-Grenze und ein benannter Ladezustand mit funktionierendem Ausgang.
- `src/main.tsx:15` - behoben: Preview initialisiert direkt ihren richtigen
  Modus, ohne vorherige Hydration der Legacy-Animationsbäume. Die klassische
  Route behält ihre Hydration und erhält ihr Modul separat.
- `scripts/prerender.tsx:5` - PASS: rendert dieselbe echte App direkt in HTML;
  die No-JS-Projektinformationen bleiben erhalten. Keine Hydration-Suppression.

Jede Regelgruppe wurde geprüft:

| Gruppe                | Ergebnis / Anwendung                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility, Medien | Semantische Links/Buttons, H1/H2/H3, Skip-Link, beschriftete Checkbox, Live-Status und Textentsprechung des Graphen. Canvas-Gesten haben DOM-/Tastaturalternativen. |
| Fokus                 | sichtbare Cyan-Outlines; Controls nicht sticky über Seiteninhalt; Weltwechsel fokussiert Welttitel, Back bleibt im vorhandenen Vertrag.                             |
| Formulare             | Ein benanntes, umschlossenes Checkbox-Control. Keine Text-/Auth-Eingaben, Übermittlung, Platzhalter oder Validierung nötig.                                         |
| Animation             | Keine Autoplay-Schleifen, Pause/Reset, `prefers-reduced-motion`, Interrupt und Cleanup. CSS nennt Eigenschaften ausdrücklich.                                       |
| Typografie            | Manrope selbst gehostet, lesbare Zeilen, balancierte Headline, deutsche Satzschreibung statt englischem Title Case. Keine neue Zierschrift.                         |
| Content Handling      | Statische kurze Inhalte, keine User-Strings; geprüft bei 320/390/768/1440/1920 px. Keine leeren Listen oder Fake-Daten.                                             |
| Bilder                | Kein neues `<img>`/Video/GIF. R3F ist die interaktive Originaldarstellung; keine Bild-Ladeattribute auf Canvas übertragen.                                          |
| Performance           | Keine Layoutmessung in React-render, kleine Listen, keine CDN-Verbindungen. Die aktuelle Font-Ladesituation wird im Lighthouse-Laborlauf bewertet.                  |
| Navigation/State      | URL enthält Welt/Fokus, native Links, Back/Forward. Playback ist bewusst kein teilbarer URL-Zustand, wie ein lokaler Medien-Playhead.                               |
| Touch                 | 44-px-Steuerflächen, `touch-action:manipulation` auf Controls, Canvas besitzt explizites Gestenrouting, Tap-Highlight und Tastaturalternativen.                     |
| Safe Areas/Layout     | Vorhandene Notch-/Bottom-Abstände erhalten, kein horizontaler Overflow; mobile Fokusansichten einzeln aufgenommen.                                                  |
| Theme/Locale          | `color-scheme:dark`, Theme-Color korrigiert, keine Datums-/Währungsformatierung; reale Projektnamen bleiben `translate=no`.                                         |
| Hydration             | Keine Datums-/Zufallsberechnung in DOM, kontrollierte Checkbox mit Handler, keine Hydration-Suppression.                                                            |
| Hover/Copy            | Legacy-Kollision behoben, klare Aktionsnamen, beschreibender Fallback mit direkt zugänglichen Projekten.                                                            |

Bewusst nicht übernommen: CSS-`overscroll-behavior:none` auf der ganzen Seite
würde native Browsernavigation beeinflussen; die Seite behält bestehendes
Inputrouting. Keine erzwungene englische Title-Case-Schreibung, kein zusätzliches
URL-State-Framework. Keine neuen Cookies/Formulare/rechtlichen Behauptungen.

## React- und Rendering-Review

Installierter Skill: `.agents/skills/vercel-react-best-practices/SKILL.md`.
Zusätzlich gelesen und angewandt: `rerender-use-ref-transient-values`,
`rerender-defer-reads`, `rerender-memo`, `rendering-hoist-jsx`,
`bundle-dynamic-imports` aus dem installierten `rules/`-Verzeichnis.

| Prüffeld                 | Konkrete Entscheidung                                                                                                                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kontinuierlicher Zustand | `OriginWorld.tsx`: Impulsalter, Position und Öffnung bleiben Refs/Three-Objekte. Kein React-setState pro Frame.                                                                                                                                                                           |
| Playback                 | `originSignalStore.ts`: nur diskrete, nachvollziehbare Zustandswechsel. `OriginJourneyClock.ts`: genau ein endlicher Timeout; Pause speichert Restzeit. Unit-Test prüft Restart, Ende, Reset und manuelle Übernahme.                                                                      |
| Subscriptions            | `OriginSignalControls.tsx`: gezielte Selektoren; Play/Pause/Replay lesen Actions erst im Event-Handler. Kein Subscribe auf den ganzen Store.                                                                                                                                              |
| Instancing               | 168 Lamellen-/Nahtinstanzen in vier Draw Calls bleiben bestehen. Neue 18 Terrassen in einem Draw Call. Tonwertvariation durch InstanceColor, keine Materialkopie pro Lamelle.                                                                                                             |
| Statischer Raum          | `OriginArchitecture` und `QuietSpace` memoisiert, Matrizen nur beim Mount aufgebaut. Keine absichtlichen Dauerschleifen oder Schattenmaps.                                                                                                                                                |
| Lazy Loading             | Bestehende React.lazy-Grenzen für Experience, Canvas und Welten bleiben. Zusätzlich wird die Legacy-App bedingt geladen. Netzwerktest: kein App-Chunk und kein Legacy-Animationsbaum in der Vorschau.                                                                                     |
| Bundle                   | Finaler lokaler Production Build: Origin 8,09 kB / 2,60 gzip; ExperienceRoot 18,31 / 6,28; Canvas 56,00 / 14,36. Einstieg von 495,74 / 162,98 auf 223,63 / 70,21 reduziert. Separates App-Modul 265,18 / 90,11 wird in Origin nicht geladen. Gemeinsamer Three/R3F-Chunk 862,86 / 229,12. |
| Render-Budget            | Demand-Rendering bleibt; verstecktes Dokument stoppt Canvas und Playback. Keine unendliche Clock.                                                                                                                                                                                         |

Verworfen: `next/dynamic`, RSC-/Server-Cache-/SWR-Regeln sind für diese statische
Vite-Anwendung nicht anwendbar. Keine vorsorgliche Memoisierung jeder kleinen
Expression. Kein Austausch funktionierender Lucide-Icons oder Zustandbibliotheken.
Keine Erhöhung der Vite-Warngrenze: der bestehende große Three-Chunk bleibt als
bekannte Budgetfrage sichtbar; dieses Teilgate löst keine Engine-Neuarchitektur aus.

Lighthouse 13.5.0 wurde tatsächlich zweimal auf dem Production Preview ausgeführt:
[Messwerte und identische Einstellungen](evidence/g2b/lighthouse-comparison.json).
Mobile Simulation, CPU-/Netzwerk-Throttling, Chromium mit SwiftShader, lokale
unkomprimierte Vite-Auslieferung. FCP sank von 8,4 auf 4,1 s, CLS von 0,015 auf 0,
LCP von 11,8 auf 10,9 s. TBT stieg in diesem einzelnen Laborpaar von 1.860 auf
2.530 ms. Performance 30 → 33, Accessibility/Best Practices/SEO jeweils 100.
**Performance bleibt offen**, diese Zahlen sind weder gute mobile Ladezeiten noch
ein bestandener Core-Web-Vitals-Nachweis. Der Ladepfad-Fix ist durch Netzwerk und
Bundle belegt; er löst das gemeinsame 3D-/Startbudget nicht vollständig. Keine
FPS-, INP- oder echte Smartphone-Messung behauptet. Das V4-Dokument nennt diese
Budgets Planungsziele; G2-B-Funktion/Render und Performance-Abnahme sind getrennt.

## Nachweise

Vorher und zwei echte Alternativen: [Skill-Adoption](G2_SKILL_ADOPTION.md).
Quellgleichheit aller sechs Installationen und Codex-Discovery:
[skill-discovery.json](evidence/g2b/skill-discovery.json).

Die finale Testbilanz, Screenshots und der G2-C-Übergabepunkt stehen in
[PHASE_STATUS.md](PHASE_STATUS.md). G3 bleibt gesperrt.
