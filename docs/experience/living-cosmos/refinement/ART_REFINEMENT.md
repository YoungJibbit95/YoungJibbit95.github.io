# Galactic Atlas Refinement — Art-Pass

14. Oktober 2026, auf Basis von `e21dd2a9deb7d629c096d16371711d5f09584dd8`.
    Nebelraum bleibt die verbindliche Richtung. Diese Notiz beschreibt den begrenzten
    Art-Pass an den drei vorhandenen Cosmos-Modulen; die menschliche Bildfreigabe
    bleibt offen.

## Design Read und gezielte Änderungen

Das Entwicklerportfolio soll einen zusammenhängenden, erkundbaren Kosmos zeigen.
Die sieben realen Projekte bleiben seine Mitteldistanz. Die erste integrierte
Übersicht hatte erkennbare Silhouetten, wirkte aber durch gleichmäßig verteilte
Punkte und wenige diffuse Wolken zu sehr wie eine kleine Objektgruppe.

`DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 5`, `VISUAL_DENSITY: 4`.
Die zusätzliche Dichte entsteht durch räumliche Konzentration, nicht durch mehr
Sterne oder Dauerbewegung. Die zuvor untersuchte stille Alternative wird hier
nicht weiterentwickelt.

- **Hintergrund:** dieselben 2.800 Sterne verteilen sich auf 550 ferne Feldsterne,
  1.450 Sterne in zwei ungleichen Armen, 600 Sterne in einer entfernten Linse
  und 200 nähere Sterne. Die Linse ist eine frei gestaltete kosmische Landmarke,
  kein neuer Softwareknoten und keine astronomische Tatsachenbehauptung.
- **Atmosphäre:** acht räumlich getrennte Sprites verwenden dasselbe vorhandene
  256²-Asset. Vier ferne Wolken, zwei dunkle Staubspuren und zwei angeschnittene
  Randwolken bilden eine asymmetrische Komposition. Ihre Zentren liegen in 3D;
  die Flächen selbst bleiben zur Kamera gerichtete Sprites. Das ist keine
  volumetrische Nebelsimulation. Die untere Wolke bleibt auch hinter der steil
  nach unten blickenden Nexus-Detailkamera sichtbar.
- **Projekte:** etwas stärkere Kanten und Emission, geringfügig größere
  Silhouetten und zwei kleine formbezogene Akzente bei Cerebri und YJarvis.
  Die bestehenden 55-Einheiten-Bounds werden eingehalten. Andere Detailwelten
  werden durch diesen Pass nicht fertiggestellt.
- **Nexus:** unveränderte vier Segel und ihre Auslenkung von 0 auf 9 Einheiten;
  Öffnen bei 172, Schließen über 176. Der Öffnungsgrad verstärkt nun die
  vorhandenen Materialkanten und das Kernlicht. Die vier Lichtwege enden an den
  tatsächlichen Clientmodulen bei Radius 30 und Höhe 7. Die fünf echten Namen
  bleiben erhalten; ein enges Schrift-Halo ersetzt schwarze Textrechtecke.
  Camera-Space-Tiefe hält die Text-Quads bei 29 CSS-Pixeln Höhe, die sichtbaren
  Glyphen sind kleiner. Seitliches Verschieben hält Text innerhalb des Viewports,
  ohne notwendige Namen nur auszublenden.

Globale Projektlabels, technische/thematische Kanten, mobile Bedienoberfläche
und die vollständige Abnahme werden separat vom Lead und dem Engineering-Agent
bearbeitet. Dieser Pass ändert weder Kamera-Posen noch History, Canvas-Lebensdauer,
SceneDirector, Projektkoordinaten oder Datenbehauptungen.

## Skills im konkreten Ergebnis

| Lokal gelesener Skill            | Konkrete Anwendung                                                                                                                            | Prüfbarkeit                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `living-atlas-experience-design` | Reale bestehende Wide-/Approach-/Detailposen, unveränderte distanzbedingte Segelöffnung; Leitungen an denselben sichtbaren Clientkoordinaten. | Approach und Detail bleiben unterschiedliche räumliche Zustände; vier Clients und Kern bleiben benannt.            |
| `design-taste-frontend`          | Komponierte Sternkonzentrationen, dunkle Zwischenräume und asymmetrische Tiefenebenen; Navy/Violett folgt dem expliziten Nutzerbrief.         | Gesamtzahl der Sterne unverändert; Bildreview prüft Raumwirkung statt bloßer Menge oder Helligkeit.                |
| `redesign-existing-projects`     | Bestehende integrierte Screenshots zuerst beurteilt, nur drei vorhandene Module lokal verfeinert.                                             | Keine neue Engine, neue Welt oder parallele Designrichtung; Vergleich mit den bisherigen Evidence-Bildern möglich. |
| `vercel-react-best-practices`    | Memoisierte Geometrien, refs für kurzlebige Öffnungswerte, begrenzte Texturen; kein React-State pro Frame.                                    | `invalidate()` ausschließlich bis zum Abschluss derselben Öffnungsbewegung; kein dauernder Environment-Frame-Loop. |

Die QA-Skills und Web-Guidelines werden im gemeinsamen integrierten Durchlauf
angewandt. Dieser Art-Pass beansprucht keinen eigenständigen CI- oder G2-Pass.

## Technische Grenzen und bisherige Prüfung

- `npm run typecheck` besteht nach dem ersten Codepaket und dem Zuordnungsfix.
- Prettier wurde ausschließlich auf die drei bearbeiteten Cosmos-Dateien angewandt.
- Environment: zwei Points-Draws und acht Staub-Sprites statt zuvor eines Points-Draws
  und vier Sprites. Keine zusätzliche Asset-Datei, kein Laufzeit-Noise-Bake und
  kein Postprocessing. Mehr Transparenzflächen können Overdraw erhöhen; die
  gemeinsame Performanceprüfung muss das tatsächliche Ergebnis messen.
- Die zwei Points-Geometrien, fünf Runtime-Label-Texturen und Kerntextur werden
  entsorgt. Die einzige geladene Nebeltextur bleibt im bestehenden Loader-Cache.
  Background-Geometrien sind explizit nicht raycastbar.
- Perspektivzentren wurden zusätzlich mit `three.PerspectiveCamera.project`
  gegen die echte Desktop-Overview- und Detailpose kontrolliert. Das ersetzt
  keinen gerenderten Bildnachweis.

## Tatsächliches integriertes Bildreview

Zwei serielle Durchläufe der vorhandenen beiden Tests
`cosmic overview and Nexus discovery render real pixels` mit einem Worker und
null Retries, jeweils nach frischem Build/Prerender. Beide Durchläufe bestanden
mit unveränderten Pixel- und physischen Öffnungsassertionen: 22,2 und 22,4 Sekunden.
Die zwölf erzeugten Bilder wurden vollständig mit `view_image` betrachtet.
Der letzte Build einschließlich Typecheck und Prerender besteht ebenfalls.
Dies sind gezielte Bild-/Discovery-Prüfungen, keine vollständige G2-Abnahme.

Im ersten Bildpass war die ferne Linse noch ein zu schwaches gleichmäßiges
Sternoval. Genau eine begrenzte Politur verteilt dieselben 600 Sterne nun in
zwei gekrümmte Arme mit lokal konzentriertem Kern. Die zwei vorhandenen dunklen
Staubspuren erhalten stärkeres Alpha; vier vorhandene Wolken etwas mehr
lokalen Kontrast. Weder Sternzahl noch Zahl der Strata wurden dabei erhöht.

| Ansicht        | Desktop 1440 × 900                              | Mobile 390 × 844                               |
| -------------- | ----------------------------------------------- | ---------------------------------------------- |
| Macro          | [Bild](evidence/cosmos-macro-1440.png)          | [Bild](evidence/cosmos-macro-390.png)          |
| Nexus Approach | [Bild](evidence/cosmos-nexus-approach-1440.png) | [Bild](evidence/cosmos-nexus-approach-390.png) |
| Nexus Detail   | [Bild](evidence/cosmos-nexus-detail-1440.png)   | [Bild](evidence/cosmos-nexus-detail-390.png)   |

**Sichtbarer Fortschritt:** Das große diagonale Band läuft über den Bildausschnitt
hinaus. Dahinter ist jetzt eine kurvige Sternkonzentration als ferner Ort lesbar;
eine dunkle Spur trennt die helleren Schultern. Das ist gegenüber der bisherigen
flächigen rechten Wolke zusammenhängender. Die sieben Hauptformen bleiben
unterscheidbar. Beim Nexus sind geschlossene und geöffnete Segel eindeutig
verschieden; alle vier Clientnamen und `@nexus/core` sind auf beiden geprüften
Größen vollständig lesbar. Die aufgehellten Segelflächen behalten ihre dunkle
Identität. Die vom Lead unterdrückten Fremdsysteme stören die Nahansichten nicht.

**Offene Art-Grenze:** Die 1440er Übersicht liest sich weiterhin teilweise als
Diagramm aus sieben kleinen Symbolen. Das Feld wirkt größer und geordneter,
erreicht aber noch keine überzeugend monumentale, plastische Nebellandschaft.
Die acht Sprites erzeugen breite, relativ glatte Staubbänder; ihre sichtbare
Binnenstruktur bleibt durch das bestehende 256²-Asset begrenzt. Der neue ferne
Sternarm ist ein erkennbarer Orientierungspunkt, kein Ersatz für großflächige
volumetrische Raumtiefe. Die Mikro-Labels sind lesbar, wirken aber weiterhin
wie Beschriftungen einer technischen Illustration. Das bleibt ein ehrlicher
Gegenstand der menschlichen Bildentscheidung, kein durch Tests bestandenes
Design-Gate.

Eine engere neue Desktop-Ankunft wurde nicht eingeführt: Sie würde die sieben
Systeme vergrößern, löst aber die Begrenzung der Nebelstruktur nicht automatisch
und benötigt einen eigenen Beziehungs-/Randbeschnittvergleich. Die bisherigen
Kamera- und History-Verträge bleiben erhalten. Nach dieser einen Bilditeration
ist der Art-Pass eingefroren; keine weiteren Varianten oder Detailwelten.
