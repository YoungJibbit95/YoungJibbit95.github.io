# Richtung C: Werkstatt nach Mitternacht

Lead-Entwurf auf G2-C `c2e338c`, isoliert unter
`experiments/g2d-design/direction-c`. Kein Import in die Produktionsszenen.

## Leitgedanke und Persönlichkeit

Eine persönliche Werkstatt macht die Verbindung zwischen Neugier, Werkzeugen und
unfertigen eigenen Systemen räumlich greifbar. Sie zeigt Arbeitsplätze, an denen
etwas geöffnet und untersucht werden kann. Die Quelle ist die bestehende
Projektbiografie, keine behauptete reale Werkstatt des Entwicklers.

Die gebaute Form unterscheidet sich bewusst von einer Sternenkarte: gemeinsamer
Boden, hohe gebogene Tragstruktur, gealtert wirkendes Holz, gedämpfte metallische
Oberflächen und eine Folge von Arbeitsleuchten. Projektobjekte stehen in einem
durchgehenden Raum statt auf frei schwebenden Markierungen. Die Schilder sind
eigene Canvas-Texturen auf realen Flächen; keine nachträglichen Bildmontagen.

Materialien nutzen selbst erzeugte, deterministische Oberflächenstrukturen und
geometrische Rundungen. Three.js' installierte `RoomEnvironment` erzeugt einmalig
eine Reflexionsumgebung für die Metalle. Kein fremdes HDRI, Bild, glTF oder
zusätzliches Framework. Sonnen-/Arbeitslicht und Kontaktverschattung formen die
Objekte; kein Bloom, Partikelsystem oder permanenter Ambient-RAF.

## Räume und Entdeckung

- **Origin:** ein einzelner Arbeitsplatz. Der Gedanke liegt zwischen zwei
  geschlossenen Schalen. Öffnen trennt die Schalen tatsächlich und legt eine
  sichtbare Bodenspur zu den Projekten frei. Diese vereinfachte Studie ersetzt
  ausdrücklich nicht die bestehende getestete G2-B-Signalmaschine.
- **Macro:** Werkhalle mit räumlicher Folge, fernem Namensschild, gekrümmter
  Tragstruktur und sieben Stationen. Desktop `[74,53,95] → [0,11,-53]`.
- **Meso:** Kamera nähert sich einem Arbeitsplatz, dessen Material, Gerät und
  Name zusammengehören. Mobile beginnt bei `[8,24,72] → [-18,14,8]` direkt vor
  Nexus und lässt weitere Stationen in die Tiefe reichen.
- **Micro:** „Aufbau entdecken“ öffnet das jeweilige Modell. Nexus entfaltet
  vier Tafeln um einen gemeinsamen Körper und zeigt den gepinnten README-Beleg
  zu den vier Clients und `@nexus/core` direkt daneben.

Die übrigen Stationen unterscheiden sich als Zeitkarten-Rack (Cerebri), zerlegbare
Welle (NovaCore), gerichteter Prüfstand (Nemisis), Voxelgelände (Adventura),
geschichtete 2D-Flächen (YjsE) und lokales Audioobjekt (YJarvis). Alle sind
**Illustrationen, keine laufenden Softwaremodelle oder Leistungsmetriken**.
Das Datenmodell wird unverändert aus der belegten G2-C-Quelle importiert.

## Mobile-Rekonstruktion

Die erste Aufnahme beschnitt Nexus seitlich und belegte zu viel Platz mit
Headline, Kameraknöpfen und Projektleiste. Agent D prüfte diese Schwäche unabhängig.
Der überarbeitete Einstieg zentriert den ersten Arbeitsplatz; die untere Leiste
enthält nur den Einstieg und eine native Auswahl aller sieben Projekte.
Kameraoptionen liegen in „Ansicht“. Kein verstecktes letztes Projekt in einem
horizontalen Streifen. Safe-Area-Abstände, 44-px-Steuerung und ein begrenztes
Informationsfeld lassen mehr Raum für das eigentliche Objekt.

## Echte Nachweise und Grenzen

`node experiments/g2d-design/direction-c/capture.mjs` nutzt den Root-Vite-Server
auf Port 3013 und erzeugt 1440×900/390×844 für Überblick, Nexus-Entdeckung und
Origin. Der eigene TypeScript-Check lautet
`node node_modules/typescript/bin/tsc --project experiments/g2d-design/direction-c/tsconfig.json`.
Die Aufnahme prüft reale Kamerakoordinaten, aktuelle Draw Calls/Dreiecke,
ein ruhendes Demand-Frame, denselben Canvas, Quelleninhalt und keine Page Errors.
Der unabhängige QA-Bericht ergänzt die weitere Bedienprüfung.

Der abschließende eigene Lauf enthält acht Bilder einschließlich beider
Origin-Zustände. Desktop-Übersicht: 252 Draw Calls / 49.386 Dreiecke;
390-Übersicht: 143 / 26.416. Diese aktuellen Werte enthalten die Reflexionsumgebung
und den eigenen Nemisis-Prüfstand. E bestätigt zusätzlich native Touch-Gesten
auf 390/768, Tastatur, Axe, drei Canvas-erhaltende Weltwechsel und konstante
252 Geometrien / 18 Texturen am Desktop. [QA](QA.md) trennt diese Funktionsbelege
ausdrücklich von Produktionsbudget und menschlicher Art-Freigabe.

Stärke: ein verständlicher persönlicher Ort mit direkter Verbindung von Objekt
und Inhalt; Mobile bietet sofort einen nahen Einstieg.
Schwäche: die Werkbänke wiederholen sich und die Miniaturmodelle wirken teilweise
noch wie Ausstellungsstücke. Dieser Ansatz ist intimer als eine monumentale
Landschaft. Geometrie/Materialwiederverwendung ist im Prototyp noch nicht auf das
Produktionsbudget optimiert; Draw Calls sind deutlich höher als in G2-C.

Es gibt keine Produktions-History-/Filter-Integration in diesem isolierten
Entwurf. Quelle, zurückgesetzte Kameraziele und zwei Welten sind demonstriert;
vollständige SceneDirector-Integration folgt ausschließlich nach menschlicher
Richtungsfreigabe. Dev-Screenshots belegen keine Mobilgeräte-Performance.

Angewandte Skills: Taste/Redesign (eigener Ort, reduzierte Overlays), Atlas Design
(reale Koordinaten, kausale Geometrieantwort, belegte DOM-Information), Vercel React
(Demand-Rendering, Ressourcen-Cleanup, keine React-Updates pro Kameraframe).
