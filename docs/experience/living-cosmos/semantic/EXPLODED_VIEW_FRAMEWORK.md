# Exploded View Framework

15. Oktober 2026 · G2-D · erster implementierter Referenzfall: Nexus.

Eine Öffnung erklärt eine belegte Beziehung. Sie ersetzt weder eine Produktaufnahme
noch eine laufende Anwendung. Die nächste Welt übernimmt den kleinen Vertrag,
nicht automatisch die Form oder Choreografie von Nexus.

## Erklärende Bewegungen

| Bewegung           | Erkenntnis                                               | Geeigneter späterer Einsatz                 |
| ------------------ | -------------------------------------------------------- | ------------------------------------------- |
| Orbit-Auffächerung | Eigenständige Anwendungen teilen eine Grundlage          | Nexus, jetzt implementiert                  |
| Ringöffnung        | Eine Regel begrenzt mögliche Wege                        | Cerebri; nur mit belegtem Regelbeispiel     |
| Kernfreilegung     | Ein sichtbares Produkt beruht auf tiefer liegender Logik | NovaCore oder Nexus                         |
| Layer-Separation   | Zwei Ebenen haben verschiedene Aufgaben                  | YjsE: Engine, Client, Beispielinhalt        |
| Segmententfaltung  | Bausteine ergeben gemeinsam eine lesbare Welt            | Adventura: illustrative Chunks              |
| Satellitenablösung | Ein Begleiter ist ein eigenständiges Werkzeug            | YJarvis: Oberfläche und lokale Verarbeitung |
| Signalverbindung   | Eine konkrete Abhängigkeit wird nachvollziehbar          | Nexus-Core; NovaCore → Nemisis              |
| Schalenöffnung     | Eine äußere Anwendung gibt einen inneren Aufbau frei     | Nexus-App-Hüllen, jetzt implementiert       |

Die Liste ist ein Gestaltungswortschatz, kein vorgebautes Animationssystem. Für
andere Projekte sind diese Zuordnungen Entwürfe. Eine künftige Signalbewegung
muss eine erklärbare Ursache und ein Ende haben; zufällige Datenströme und
dauerhafte Umkreisung erklären keine zusätzliche Information.

## Kleiner technischer Vertrag

`src/experience/worlds/cosmos/explodedView.ts` enthält keine Three-, React- oder
Browser-Abhängigkeit:

- `ExplodedPart`: stabile ID, geschlossene und geöffnete 3D-Position.
- `ExplodedRelation`: Ausgang, Ziel und benannte Bedeutung einer Verbindung.
- `ExplosionMotion`: gemeinsame Bezeichnungen der acht Bewegungsarten.
- `getDiscoveryOpen`: Auswahl **und reale Kameradistanz**, Öffnen bei ≤172,
  Schließen nach >176 Welteinheiten. Die Hysterese verhindert Flattern.
- `advanceExplosion`: umkehrbare, begrenzte Annäherung an 0 oder 1. Reduced
  Motion erreicht denselben Endzustand sofort. Ein Frame-Delta über 50 ms
  verursacht keinen Sprung; unter 0,001 Restabweichung gilt der exakte Endwert.
- `getExplodedPosition`: geklemmte Interpolation mit optional wiederverwendetem
  Ergebnis-Tupel. Der Aufrufer überträgt es auf echte Objekttransformationen.

Die Entfernungen sind der bestehende Nexus-Discovery-Vertrag. Sie werden nicht
als universell passende Schwellen für alle künftigen Welten ausgegeben. Vor einer
zweiten Welt muss deren tatsächlicher Kamerarahmen geprüft werden; erst bei
konkretem Bedarf wird der Vertrag parametriert.

`nexusSemantic.ts` hält Namen, Aufgaben und Positionen zusammen. Canvas und
Dossier verwenden dieselbe Definition. Das Diagramm beschreibt vier Clients,
die den gemeinsamen Runtime-Kern nutzen; es simuliert keine Synchronisation.

## Macro → Meso → Micro

1. **Macro:** identifizierbare Silhouette: ein heller Stern und vier umliegende
   Anwendungen. Der Projektname führt zur bestehenden Fokusfahrt.
2. **Meso / Annäherung:** die zwei Funktionsfamilien und die unterschiedlichen
   Körper werden unterscheidbar. Die geschlossene Ordnung bleibt erhalten.
3. **Micro / Entdeckung:** physische Nähe öffnet die Architektur. Die Clients
   entfernen sich nachvollziehbar von ihren Ausgangspunkten; Hüllen geben Raum
   für das Innere, Namen und Core-Beziehungen werden lesbar.
4. **Rückkehr:** dieselben Teile schließen wieder. Browser-Back restauriert die
   gespeicherte Pose einschließlich Ziel, FOV, Zoom, Auswahl und Filter.

Die vorhandene LOD-Entscheidung lädt beziehungsweise zeigt Detailinhalte. Sie
ersetzt die Prüfung der tatsächlichen Kameradistanz nicht. Der ruhende Endzustand
benötigt keine weiteren Frames. Unterbrochene Annäherung darf jederzeit umkehren.

## Text, Labels und Zugang

Jeder benannte Teil hat eine stabile ID und einen verständlichen Namen. Die
vier Clientnamen und ihre Rollen stehen auch im Dossier. Damit bleibt die
inhaltliche Erklärung bei jeder Entfernung und ohne WebGL zugänglich. Neue
informative Zeilen erzeugen keine zusätzlichen Tabstopps.

Räumliche Labels müssen an ihren tatsächlichen Körpern verankert bleiben. Bei
engen Bildschirmen sind kompakte Beschriftung und nachvollziehbare Zuordnung
wichtiger als das Festhalten an einem starren Weltabstand. Die Browserprüfung
misst sichtbare Glyphenrechtecke und inspiziert echte Bilder; ein im Scenegraph
vorhandenes Sprite ist allein kein Beweis für Lesbarkeit.

## Performance und Erweiterungsgrenzen

- Ein bestehender Canvas, bestehende SceneRegistry, SceneDirector und CameraRig.
- Refs für häufige Änderungen; keine React-Zustandsänderung je Frame.
- `invalidate()` ausschließlich während tatsächlicher Übergänge. Keine zweite
  RAF-Schleife und keine permanent rotierenden Planeten.
- Wiederverwendete beziehungsweise memoierte Geometrien und Texturen; Ressourcen
  beim Entfernen freigeben. Keine zusätzlichen Runtime-Abhängigkeiten.
- Kleine begrenzte Meshes und Linien statt wachsender Partikelsysteme oder einer
  Postprocessing-Kette. Der bestehende Nebelraum wird nicht erweitert.
- Aussagekräftige Details zuerst an einem Referenzsystem prüfen. Noch keine
  generische Timeline, kein Konfigurationseditor und keine neue Zustandsmaschine.

## Nachweis und nächster Einsatz

Unit-Tests prüfen Auswahl/Nähe/Hysterese, Umkehr, exaktes Auslaufen, begrenztes
Frame-Delta und Reduced Motion. Browser-Tests lesen die realen Client-Positionen,
vergleichen geschlossene und geöffnete Endpunkte, prüfen unveränderte Pixel- und
History-Grenzen und zeigen 390/1440-Pixel-Bilder. Die bestehenden Tests decken
Demand-Ruhe, Ressourcen nach Weltwechseln, Gesten und Fallbacks ab.

Die drei weiteren Deliverables stehen in [Project Semantic Language](PROJECT_SEMANTIC_LANGUAGE.md),
[Art Direction](ART_DIRECTION.md) und [Nexus Redesign Report](NEXUS_REDESIGN_REPORT.md).
Prüfergebnisse und verbleibende visuelle Grenzen werden im Redesign-Bericht
separat ausgewiesen. Ein bestandenes technisches Gate ist keine Nutzerfreigabe.
