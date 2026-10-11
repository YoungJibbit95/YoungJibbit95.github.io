# G2 Skill-Adoption und zweiter Designpass

Arbeitsbasis: lokaler Branch `feat/living-atlas-v3`, Start-HEAD
`b2a3028020c608d2a5ef5a3471f13c46c5e91921`, identisch mit GitHub. Datum: 2026-10-11.
Dieser Bericht ergänzt die frühere G2-A-Provenienz: Dort wurden Skills gelesen;
jetzt sind sie dauerhaft im Repository installiert.

## Installation und Aktivierung

Installer: npm `skills@1.7.2`, MIT, `--copy -a codex -y`, ohne `--global`.
Telemetrie durch `DO_NOT_TRACK=1` abgeschaltet; npm-Lifecycle-Skripte deaktiviert.
Vorher existierten keine projektlokalen Skills. Alle sechs folgenden `SKILL.md`
wurden nach Installation vollständig aus ihrem tatsächlichen Pfad geladen.

| Skill                          | Quelle / Revision                                                                | Installierter und geladener Pfad                         |
| ------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| design-taste-frontend          | Leonxlnx/taste-skill `717446e07a78d4e6d7918b1fde1a263378eebac9`                  | `.agents/skills/design-taste-frontend/SKILL.md`          |
| redesign-existing-projects     | dieselbe Taste-Revision                                                          | `.agents/skills/redesign-existing-projects/SKILL.md`     |
| vercel-react-best-practices    | vercel-labs/agent-skills `063bee94c3f4df8453406c830b0a7df0f2860278`, Skill 1.0.0 | `.agents/skills/vercel-react-best-practices/SKILL.md`    |
| web-design-guidelines          | dieselbe Vercel-Revision, Skill 1.0.0                                            | `.agents/skills/web-design-guidelines/SKILL.md`          |
| living-atlas-experience-design | vollständiger V4-Handoff, unveränderte Kopie                                     | `.agents/skills/living-atlas-experience-design/SKILL.md` |
| living-atlas-world-qa          | vollständiger V4-Handoff, unveränderte Kopie                                     | `.agents/skills/living-atlas-world-qa/SKILL.md`          |

Der angegebene Installationsname `react-best-practices` scheiterte mit
`No matching skills found`. Der Installer listete `vercel-react-best-practices`;
Installation unter diesem aktuellen Namen war erfolgreich. Kein Ersatz durch
bloßes Lesen. `npx skills list -a codex` weist alle sechs als Project Skills aus.

Die Taste-MIT-Lizenz liegt bei beiden Kopien. Vercels README erklärt MIT,
React-SKILL.md ebenfalls; im Quellrepository gibt es keine separate LICENSE-Datei.
Die ausgewählten Skills enthalten Markdown-Regeln, keine ausführbaren Helfer.
Tastes `skill.sh` gibt lediglich einen lokalen Pfad aus; seine Bild-/README-Skripte
wurden geprüft und nicht ausgeführt. Vercel-Deploy-Skripte wurden nicht installiert.
Die zwei Atlas-Skills stammen aus dem vom Nutzer freigegebenen Handoff.

Codex dokumentiert automatische Erkennung von `.agents/skills`:
[offizielle lokale Skill-Discovery](https://learn.chatgpt.com/docs/build-skills).
Zusätzlich wurde mit dem installierten Codex-Binary eine neue, kontrollierte
App-Server-Discovery gestartet und `skills/list` mit `forceReload:true` ausgeführt:
alle sechs `scope:repo`, `enabled:true`, keine Discovery-Fehler. Der Versuch über
den bestehenden Control-Socket war auf diesem Windows-Host nicht verfügbar
(OS 10050). Die laufende Arbeit wurde nicht beendet. Die aktuelle Anwendung
erfolgt durch explizites Laden der sechs Dateien; `AGENTS.md` sichert diesen
Workflow für Folgesitzungen. Die externe Discovery ist kein behaupteter Nachweis
eines aktualisierten Skill-Pickers der bereits laufenden Desktop-Sitzung.

## Art Direction: prüfen, vergleichen, verbessern

Reading: räumliches Entwicklerportfolio für neugierige Besucher und technische
Reviewer; skulptural, erforschbar, ruhige Materialien. Targeted evolution mit
DESIGN_VARIANCE 8, MOTION_INTENSITY 6, VISUAL_DENSITY 3. Vorhandene Manrope,
Off-black/Cyan, Landmarken, freie Kamera und Lamellensilhouette bleiben erhalten.

1440- und 390-px-Ausgangsbilder wurden visuell geöffnet:
`evidence/g2a/g2a-origin-1440-quiet.png`, `evidence/g2a/g2a-origin-390.png`.
Die Silhouette funktioniert. Gleichmäßig blaugraue Flächen, schwebende Hilfsobjekte
und kaum Bodenkontakt lassen den Raum jedoch wie ein Objektviewer wirken.
Headline und mobile Lesbarkeit sind bereits stark; ein Fontwechsel ist unnötig.

Zwei implementierte R3F-Studien, jeweils Quiet/Open bei 1440 und 390, wurden nach
SceneReady und FontsReady aufgenommen. Die Signalaktion wurde für jedes Paar
ausgeführt und der Modellzustand geprüft. Keine gerenderten Mockups.

| Vergleich  | A: Faltarchiv                                                                 | B: Schwebende Seiten                                             |
| ---------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Referenz   | `evidence/g2b/study-archive-1440.png`, `study-archive-390.png`                | `evidence/g2b/study-floating-1440.png`, `study-floating-390.png` |
| Raum       | 18 dunkle, gestaffelte Steinplatten, entfernte Wandblätter und Horizontsockel | offener Hintergrund, horizontal gedrehte Struktur ohne Boden     |
| Silhouette | bestehende vertikale Teilung, stärkere Materialstärke 0.5                     | Rotation Z 1.2 rad, filigrane Lamellenstärke 0.22                |
| Signal     | Öffnung als Durchgang, Kontrast gegen ruhigere Architektur                    | horizontale Öffnung, mobil schwächer erkennbare Wegrichtung      |
| Urteil     | gewählt, bessere Staffelung und Maßstab                                       | verworfen, bleibt näher am isolierten Objekt                     |

Die gewählte Studie wurde weiter verfeinert: Wand tiefer/links aus der Headline,
Terrassen dunkler, Lamellen mit instanzierten Tonwerten statt uniformer Fläche.
Keine Partikel hinzugefügt. `OriginArchitecture.tsx` nutzt für 18 Terrassen einen
Draw Call. `OriginWorld.tsx` behält vier instanzierte Lamellengruppen. Der
temporäre Studienparameter wurde aus dem Runtime-Code entfernt.

Taste/Redesign konkret: Silhouette erhalten, Material und räumliche Staffelung
verbessert, violette Fokusmarken auf Cyan vereinheitlicht. Browserprüfung fand
außerdem geerbte globale Button-Hover-Stile und runde Ecken; im Atlas-Scope
korrigiert. Echte Bilder stehen in den obigen Vorher-/Studienframes und den
abschließenden G2-B-Frames. Die Dateien `experience.css`, `OriginWorld.tsx` und
`OriginArchitecture.tsx` tragen die sichtbaren Änderungen.

`gpt-taste` vollständig geprüft, nicht installiert/aktiviert: verpflichtende
simulierte Zufallsauswahl, AIDA/Bento und GSAP-Scroll-Pinning widersprechen der
kuratieren freien 3D-Navigation. Taste-Defaults für Bildgenerierung, neue Fonts,
Tailwind/Motion und Dual-Theme sind hier nicht anwendbar: Der Nutzer verlangt
eine echte bedienbare 3D-Welt im bestehenden Stack. Das Canvas ist das Originalbild.
Keine erfundenen Fotos, Metriken, Testimonials oder rechtlichen Seiten.

Lenis bleibt entsprechend ADR-003 abgelehnt. Keine neue Runtime-Abhängigkeit.
Keine verfügbare/benötigte Manus-Integration eingesetzt.

## G2-B Audit und Abschluss

Die konkreten Vercel-Datei-/Zeilenbefunde, React-Bewertung, Tests und finalen
Bildnachweise werden mit dem G2-B-Abschlussbericht festgehalten. Die Atlas-Skills
steuern den deterministischen Graphen, die räumliche Reaktion und die echten
Pixel-/History-/Fallback-Gates; CI und gestalterisches Urteil bleiben getrennt.
