# Nexus: semantischer Art-Checkpoint

## Lesart und Begrenzung

Ein räumliches Entwicklerportfolio für neugierige Besucher und technische
Betrachter. Der bestehende tiefblau-violette Nebelraum bleibt; Nexus wird darin
ein verständliches Sternensystem. Design-Dials: Varianz 6, Bewegung 5, Dichte 4.
Die Bewegung dient der Erklärung einer Architektur und endet wieder in Ruhe.

Der bisherige Stand zeigte vier große, technisch sauber animierte Bögen.
Ihre Bewegung verriet jedoch weder die Aufgabe eines Clients noch die Bedeutung
des Core. Deshalb ersetzt diese Etappe gezielt den Nexus-Körper. Sternkarte,
Navigation, Canvas, Kamera und die sechs anderen Projektkörper bleiben bestehen.

## Sichtbare Entscheidungen

- Der Core erscheint als klarer weißblauer Stern mit begrenzter Korona. Seine
  Mitte bleibt zwischen den vier App-Planeten sichtbar.
- Workspace- und Code-Planeten öffnen sich unterschiedlich: geschichtete
  Workspace-Oberflächen gegenüber gedrehten Editor-Nähten. Breite Desktop-
  und schlanke Mobile-Meridiane ergänzen die ausgeschriebenen Rollen.
- Vier konkrete App-Namen ersetzen die anonyme Vierergruppe. Zwei Zeilen pro
  Label zeigen Namen und Funktion; der Core nennt seine gemeinsame Runtime.
- Annäherung öffnet Schalen, vergrößert Abstände und legt vier Verbindungen frei.
  Diese Linien enden tatsächlich an den bewegten Planeten. Ihre Bedeutung ist
  gemeinsame Grundlage, nicht beobachteter Datenverkehr.
- Das lokale Modell `nexusSemantic.ts` versorgt Canvas und Dossier mit den
  gleichen Namen und Rollen. Die pinned README ist am Modell verlinkt.

## Räumlicher Ablauf

Die bestehende Übersicht bleibt `position [320,300,620]`, `target [0,0,-220]`.
Nexus liegt bei `[-230,35,-120]`. Die Desktop-Annäherung addiert `[85,60,145]`,
die mobile Annäherung `[95,100,210]`. Detail addiert `[55,130,90]`;
FOV 48, bei kompaktem Detail 62. Diese Posen wurden nicht durch neue
Bildkompositionen ersetzt.

Unter 172 Welteinheiten öffnet das ausgewählte System; über 176 schließt es.
Die vier Clients bewegen sich jeweils mehr als 12 Einheiten, und ihre beiden
Schalen trennen sich entlang ihrer lokalen Achse um 4,8 Einheiten. Bei Workspace-
Planeten weicht die obere Schale zusätzlich seitlich und nach hinten aus; dadurch
werden zwei geschichtete Arbeitsflächen sichtbar. Reduced Motion erreicht
dieselben Endpositionen direkt. Endliche Interpolation ruft nur während der
Bewegung weitere Demand-Frames ab. Es gibt keine dauerhafte Umlaufanimation.

Die erste echte Bildprüfung bei 1440 und 390 zeigte lesbare, getrennte Namen,
aber einen zu planetenähnlichen Core und verdeckte Workspace-Innenflächen.
Eine begrenzte Korrektur entfernte deshalb den Core-Ring, verstärkte die weiche
Korona und versetzte die Workspace-Schalen. Die Rollen wurden von rund 12,3 auf
14,4 CSS-Pixel angehoben; App-Namen liegen bei rund 15,2 CSS-Pixel. Finale
Bildprüfung und Testergebnisse werden im Bericht separat festgehalten.

## Konkrete Anwendung der sechs Skills

| Skill                            | Auswirkung in dieser Etappe                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `design-taste-frontend`          | Brief zuerst, bewusste Blau/Violett-Ausnahme, weniger Formdeko; klare Mitte und nur motivierte Bewegung.                                  |
| `redesign-existing-projects`     | Audit der bedeutungsarmen Bögen; gezielter Ersatz von Nexus bei Erhalt des Nebelraums und der funktionierenden Oberfläche.                |
| `living-atlas-experience-design` | Macro/Meso/Micro-Erklärung, echte räumliche Öffnung, verifizierte Projektrollen, gleicher Inhalt im DOM.                                  |
| `vercel-react-best-practices`    | Transiente Werte in Refs; kleine Memo-Komponenten, keine React-Updates pro Frame, keine neue Abhängigkeit, Texturen/Geometrien aufräumen. |
| `web-design-guidelines`          | Frische Richtlinie gelesen; Funktion und Plattform stehen als Text, Reduced Motion und zugängliche DOM-Gegenstücke bleiben erhalten.      |
| `living-atlas-world-qa`          | Reale 1440-/390-Pixelbilder und Positions-/Labelprüfung sind Voraussetzung; CI-Erfolg ist kein Ersatz für das Art-Urteil.                 |

Die generischen Verbote gegen blaue/violette Gestaltung oder Kugeln treten
hinter die ausdrückliche Nutzer-Vision zurück. Stern und Planeten sind hier
inhaltlich begründet. Andere generische Vorschläge wie neue Frameworks,
Stockbilder und zufällige Layoutwechsel wurden nicht angewandt.

## Ehrliche Grenzen des Entwurfs

Die Planeten sind erklärende Miniaturen, keine Produkt-Screenshots und keine
exakten Darstellungen interner App-Module. Der Stern ist keine Cloud, die
Linien sind kein Sync-Nachweis. Weitergehende Client-Details brauchen je einen
konkreten quellengestützten Ablauf. Die sieben Identitäten stehen in
[Project Semantic Language](PROJECT_SEMANTIC_LANGUAGE.md), technische
Akzeptanz und finale Bildbewertung im Nexus-Redesign-Bericht des Leads.

## Unabhängige Bildprüfung nach der Korrekturrunde

Subagent A hat alle vier tatsächlichen Canvas-Aufnahmen unter `evidence/`
geöffnet und visuell geprüft; dies ist ein Art-Urteil, kein CI-Ergebnis.

| Aufnahme                                                   | Visueller Befund                                                                                                                                                                                                                                                |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Annäherung 1440](evidence/cosmos-nexus-approach-1440.png) | Die leuchtende Mitte und vier kleinere Körper sind sofort als System lesbar. Die beiden Funktionsfamilien unterscheiden sich durch Form und Oberflächenteilung. Der Nebelraum bleibt die Umgebung.                                                              |
| [Detail 1440](evidence/cosmos-nexus-detail-1440.png)       | Auffächerung, geöffnete Workspace-Flächen, Code-Nähte und vier tatsächliche Core-Verbindungen erklären mehr als die vorherigen Bögen. Namen und Rollen sind lesbar. Die Main-Beschriftung steht nach der gezielten Nachführung frei über der geöffneten Schale. |
| [Annäherung 390](evidence/cosmos-nexus-approach-390.png)   | Alle fünf Körper bleiben im Bild. Der kompakte Ort erhält Luft um sich; Sternfeld und Nebel reichen deutlich darüber hinaus. Steuerung und Projektname verdecken die Körper nicht.                                                                              |
| [Detail 390](evidence/cosmos-nexus-detail-390.png)         | Die fünf Namen und vier App-Rollen bleiben voneinander getrennt, Workspace und Code sichtbar verschieden. Die nachgeführte obere Workspace-Beschriftung bleibt frei; keine abgeschnittenen Namen.                                                               |

**P2 behoben, gezielte Nachführung:** Die obere Schale von Nexus Main kreuzte
beim Öffnen die Rollenzeile „Workspace · Desktop“. Nur dieses obere Workspace-
Label wurde um sieben Welteinheiten nach oben geführt. Der Lead hat beide
aktualisierten Detailbilder geöffnet und geprüft: der Text steht frei über der
Schale. Alle neun betroffenen Cosmic-/Semantikfälle bestehen erneut (51,9 s),
einschließlich der stärkeren Schriftgrößen-, Hüllen- und Linienendpunktprüfungen.
Die verlinkten Bilder sind durch diese letzten Aufnahmen ersetzt. Keine weitere
Designrunde wurde begonnen.

**Art-Checkpoint:** Als semantischer Nexus-Referenzslice ist die neue Richtung
stark genug für die visuelle Nutzerentscheidung. Core, vier Clients und ihre
gemeinsame Grundlage sind lesbar; die Öffnung liefert eine nachvollziehbare
zusätzliche Erklärung. Die Körper bleiben bewusst stilisierte Miniaturen.
Aufwendigere App-Innenräume und konkrete Arbeitsabläufe sind noch offen, ebenso
die endgültige Nutzerfreigabe. Die nächste Detailwelt sollte eine andere Logik
prüfen: Cerebri mit begründeter zeitlicher Auswahl statt einer zweiten
Sternensystem-Kopie.
