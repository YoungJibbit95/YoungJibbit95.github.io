# G2-C · Projektquellen und räumliche Daten

Geprüft am **11. Oktober 2026** durch Subagent B (Project Data & Evidence).
Ausgangs-SHA des Portfolio-Checkouts:
`85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Arbeit im gemeinsamen lokalen Checkout, Branch `feat/living-atlas-v3`, mit exklusivem
Schreibbereich `src/experience/observatory/data/**`, diesem Bericht und
`tests/observatory-data.unit.test.ts`. Kein eigener Commit, Installationsprozess,
Build, Server oder Push; Integration und finale Abnahme gehören dem Lead.

## Prüfverfahren und Grenzen

Die bestehende `src/data/projects.ts` bleibt die Quelle für Projektidentität,
autorisierte persönliche Kernfragen und Beschreibungstexte. Das neue typisierte
Observatory-Modell ergänzt Statuspräzisierungen, Provenienz und räumliche Daten.
Alle sieben öffentlichen Repository-Metadaten, ihre Default-Branch-HEADs und
READMEs wurden live mit `gh api` gelesen. Die relevanten README-Aussagen wurden
anschließend erneut **auf den unten festgeschriebenen SHAs** abgerufen.
YjsE verwendet `master`; die übrigen geprüften Default-Branches sind `main`.
Nemisis' `CMakeLists.txt` und Cerebris `Cargo.toml` wurden zusätzlich im Quelltext
geprüft. Ein zunächst angenommener Adventura-Pfad `build.gradle` lieferte 404;
die Tree-Abfrage bestätigt `build.gradle.kts`. Dieser fehlgeschlagene Abruf wird
nicht als Codebeleg verwendet.

Das ist eine Quelltext-/Dokumentationsprüfung, kein Ausführen der sieben Produkte,
kein unabhängiger Funktions- oder Sicherheitstest und keine Release-Freigabe.
README-Aussagen sind als `repository-doc` gekennzeichnet. Die Daten halten
`claim` und `limits` getrennt. Keine Nutzungszahlen, Leistungswerte, abgeschlossenen
Releases oder produktiven Integrationen wurden aus Beschreibungen abgeleitet.
Externe Produktseiten werden nur aus bereits autorisierten Projektlinks übernommen;
ihre Erreichbarkeit oder Produktfunktion wurde nicht geprüft.

## Sieben Projekte

| ID          | Festgeschriebene Quelle                                                                                                                                                                                                                                 | Belegter Stand und Grenze                                                                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nexus`     | [README · 835cd116](https://github.com/YoungJibbit95/Nexus-Ecosystem/blob/835cd116174981efe2f330b1083552091f52f808/README.md#L53)                                                                                                                       | Nexus Ecosystem: vier öffentliche React-/TypeScript-Clients mit Electron/Capacitor und gemeinsamem Core. Cloud, Sync und KI-Dienste sind geplant/privat und nicht produktionsverifiziert. Status bleibt „In Entwicklung“.                                      |
| `cerebri`   | [README · 7acff32c](https://github.com/YoungJibbit95/Nexus-Cerebri/blob/7acff32c266c1fdab91847388cbeff3854e2d0a2/README.md#L235), [Cargo.toml](https://github.com/YoungJibbit95/Nexus-Cerebri/blob/7acff32c266c1fdab91847388cbeff3854e2d0a2/Cargo.toml) | Nexus Cerebri: Rust, deterministische zeitliche Planung und begrenzte Suche, Svelte-Lab. Software 0.2.0 ausdrücklich unveröffentlicht. Keine produktive Kalenderintegration, kein gelerntes Ranking, keine autonome Kalendermutation.                          |
| `novacore`  | [README · dbdfc38d](https://github.com/YoungJibbit95/Novacore-Engine/blob/dbdfc38d092e018952ead43d9cb669333ebf70bc/README.md#L28)                                                                                                                       | NovaCore Engine: experimentelle C++23-/Vulkan-/SDL3-/CMake-Grundlage mit fester Simulation und ECS. Vollständiges GPU-Mesh-Rendering und UDP sind im geprüften README noch geplante Schritte.                                                                  |
| `nemisis`   | [README · 6b0f411e](https://github.com/YoungJibbit95/Nemisis/blob/6b0f411eab1a717656adfd7f70f10e2f76a5dcbf/README.md#L93), [CMakeLists.txt](https://github.com/YoungJibbit95/Nemisis/blob/6b0f411eab1a717656adfd7f70f10e2f76a5dcbf/CMakeLists.txt)      | Nemisis: frühe Entwickler-Sandbox mit eigener FPS-Spielschicht auf NovaCore. Kommerzielles 6v6 ist Zielsetzung, kein belegter fertiger Spielmodus.                                                                                                             |
| `adventura` | [README · 04b4e2dd](https://github.com/YoungJibbit95/Adventura/blob/04b4e2dd8e50db2a3fefd35647e0b7e08028b380/README.md#L30)                                                                                                                             | Adventura: früher Java-/LWJGL-/Netty-Voxel-Prototyp, eigener Client und dedizierter Server. Vorhandene Serverbausteine bedeuten kein fertiges Multiplayer-/Survival-Produkt.                                                                                   |
| `yjse`      | [README · 5ceb1154](https://github.com/YoungJibbit95/2D-Game-Engine/blob/5ceb115420cc91ae2cdd36d0b63e4c8c476e05ee/README.md#L14)                                                                                                                        | YjsE: spielbare 2D-Prototyp-Hülle, C#/.NET 8/MonoGame DesktopGL, Trennung von Core, Client und Beispielinhalt. Kein Nachweis einer Verwendung durch Adventura oder Nemisis.                                                                                    |
| `jarvis`    | [README · bad64ef4](https://github.com/YoungJibbit95/YJarvis/blob/bad64ef4b9ce67a11b72f11d930e6bf5603ec761/README.md#L8)                                                                                                                                | YJarvis Local v1: experimenteller lokaler macOS-Assistent, Python/FastAPI, Electron/React, Ollama, whisper.cpp/Piper. Aktionen brauchen Freigabe. V2 beginnt mit Infrastruktur; Setup für Windows/Linux bedeutet keine native Audio-/Automationsunterstützung. |

Die Statuspräzisierungen ändern ausschließlich das Observatory-Modell. Der aktuelle
YJarvis-SHA vom selben Tag ersetzt keine Behauptung über eine abgeschlossene V2.
Die bereits vorhandene persönliche Frage „Wie kann Software helfen, ohne einfach
die Kontrolle zu übernehmen?“ bleibt eine redaktionelle Frage, keine Sicherheitsgarantie.

## Beziehungen

| Kante              | Art                       | Begründung                                                                                                                                                                                                                                                                               |
| ------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `novacore-nemisis` | **Technisch belegt**      | Nemisis löst `NOVACORE_ENGINE_ROOT`, einen benachbarten Checkout oder `find_package(Novacore CONFIG REQUIRED)` auf und linkt `nemisis_game` mit `Novacore::Engine`. Die Richtung NovaCore → Nemisis bezeichnet die bereitgestellte Grundlage; die Build-Abhängigkeit besteht beim Spiel. |
| `nexus-cerebri`    | Thematische Nachbarschaft | Workspace und zeitliche Planung. Der gemeinsame Name belegt keine technische Integration.                                                                                                                                                                                                |
| `adventura-yjse`   | Thematische Nachbarschaft | Voxel-/Tile-Welten und Weltbausteine, mit unterschiedlichen Runtimes. Keine Engine-Abhängigkeit zwischen diesen Projekten nachgewiesen.                                                                                                                                                  |
| `cerebri-jarvis`   | Thematische Nachbarschaft | Beide Beschreibungen ziehen Grenzen zwischen Vorschlag und Ausführung. Kein Nachweis, dass YJarvis Cerebri verwendet.                                                                                                                                                                    |

Die thematischen Kanten zitieren die beiden jeweiligen Projektquellen als Grundlage
der redaktionellen Einordnung. Ihr `kind: 'thematic'` muss in Darstellung und
Dossier erhalten bleiben. Durchgezogene technische Kanten dürfen nur für die
geprüfte NovaCore-/Nemisis-Beziehung verwendet werden. Es gibt keine weiteren
behaupteten technischen Beziehungen; dieser begrenzte Audit beweist nicht, dass
anderswo keine Verbindung existiert.

## Kuratierter Raum

Alle Koordinaten, Größen, Farben, Ringe, Module und Satelliten sind **Illustration**.
Sie codieren keine LOC, reale Leistung, Abhängigkeitszahl oder Produktreife. Jeder
Knoten trägt eine eigene `visual.interpretation`. Die vom Spatial-Agent entworfenen
Positionen wurden mit dem Lead abgestimmt und unverändert übernommen; Radius jeweils
55 Atlas-Einheiten.

| ID          | Position x/y/z    | Cluster          | Silhouette              |
| ----------- | ----------------- | ---------------- | ----------------------- |
| `nexus`     | −230 / 35 / −120  | Arbeit & Planung | Offener Campus          |
| `cerebri`   | −110 / 95 / −370  | Arbeit & Planung | Geteiltes Zeitrad       |
| `novacore`  | 115 / 15 / −190   | Weltenbau        | Offene Turbine          |
| `nemisis`   | 310 / 5 / −300    | Weltenbau        | Gerichtetes Fragment    |
| `adventura` | 255 / −70 / 40    | Weltenbau        | Voxel-Terrassen         |
| `yjse`      | −70 / −105 / −470 | Weltenbau        | Schwebende Tile-Ebenen  |
| `jarvis`    | −400 / −15 / −520 | Lokale Assistenz | Verwobener Signalkörper |

Die drei Cluster sind kuratorische Orientierung. Sie sind keine Softwarepakete.
Der Datensatz spannt 650 Einheiten horizontal und 520 in der Tiefe auf. Die echte
Kamerakomposition, Silhouettenqualität und Sichtbarkeit prüft die gemeinsame
Browser-/Art-Abnahme; diese Zahlen allein sind kein visueller Qualitätsnachweis.

## Implementierung und Verifikation

- `src/experience/observatory/data/index.ts`: sieben vollständige Knoten, drei
  Cluster, vier typisierte Beziehungen, revisionsfeste Evidenz. Übernimmt die
  gemeinsamen Lead-Verträge aus `contracts.ts`, importiert weder React noch Three.
- `src/experience/observatory/data/validate.ts`: reine Validierung für Vollständigkeit,
  endliche Koordinaten, Knoten-/Cluster-Konsistenz, Kantenendpunkte, visuelle Erklärung,
  gepinnte Quellen und zusätzliche Code-Evidenz bei technischen Beziehungen.
- `tests/observatory-data.unit.test.ts`: vier Tests inklusive fehlerhafter Datensätze,
  ungepinnter Quellen und einer unerlaubt technisch umklassifizierten Themenkante.
- `node node_modules/tsx/dist/cli.mjs --test tests/observatory-data.unit.test.ts`:
  **4/4 bestanden**. Betroffene TS-Dateien mit dem installierten Prettier formatiert.
  Gesamtbuild, Browser-/Axe-Prüfung und CI sind Verantwortung der Integration.

Angewandte Skills: `living-atlas-experience-design` führt zur expliziten Trennung
von Zustand, belegten Beziehungen und illustrativer Geometrie;
`vercel-react-best-practices` führt zu statischen, gemeinsam wiederverwendbaren
Moduldaten ohne Client-Fetch, Renderer-Import oder Aktualisierung pro Frame.

**Übergabe:** Ready für Integration. Quellenprüfung und Daten-Unit-Tests sind
abgeschlossen; keine eigene Browseraufnahme durch den Data-Agent. Ein finales
Art-/Accessibility-/Performance-Gate wird durch diesen Bericht nicht vorweggenommen.
