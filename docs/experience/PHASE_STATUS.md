# Living Atlas: G2-D — Cosmic Reset / Visual Review

**Maßgeblicher Stand vom 14. Oktober 2026:** Der Nutzer hat die mineralische
Schnittwerk-Richtung ausdrücklich durch einen dunkelblau-violetten, frei
erkundbaren Kosmos ersetzt. Der aktuelle Auftrag endet nach einem begrenzten
Cosmic Vertical Slice und der Vorlage zur **visuellen Nutzerfreigabe**.
Kein vollständiger Weltumbau, G3, Merge oder Deploy ist freigegeben.

Start-HEAD lokal/remote/PR: `32e6a87a238fb3ea14fc2f3cf77f7df0a739b60f`.
Recovery-Commit: `61541b60187c9c5a6ee69d0873e22cecfc2f342c`.
Die genaue technische Abschlussprüfung und der aktuelle Code-Checkpoint stehen
im [Cosmic-Reset-Bericht](living-cosmos/REPORT.md). [Bildreview](living-cosmos/REVIEW.html),
[Art Direction und konkrete Skill-Anwendung](living-cosmos/ART_DIRECTION.md),
[Recovery mit Original-Trace-Befunden](living-cosmos/RECOVERY.md).

Der Review-Einstieg `/atlas/observatory/?cosmos=preview` verwendet die vorhandene
SceneRegistry, denselben persistenten Canvas, SceneDirector, die Kamera und
History. Implementiert sind die kosmische Übersicht und Nexus-Annäherung mit
distanzabhängiger Öffnung. Die sechs anderen Projekte haben kompakte eigene
kosmische Signaturen und behalten ihre verifizierten Dossiers; ihre vollständigen
Detailwelten und Origin sind nicht neu gestaltet. Die zweite Bildinterpretation
bleibt ein isoliertes Labor unter `experiments/living-cosmos/`.

Zwei tatsächliche Subagents wurden mit getrennten Schreibbereichen eingesetzt.
Die sechs lokalen Skills wurden konkret auf Design, Interaktion, Performance
und QA angewandt; die Nutzer-Vision hat Vorrang vor generischen Beispielen.
Vorhandene lokale Nutzerdateien, ZIP, Lockfile-Metadaten und ältere Berichte
bleiben erhalten. Nicht verfügbare V2-/V3-/V4-Masterdateien wurden nicht als
gelesen ausgegeben. **Technische Checks ersetzen keine Bildfreigabe.**

## Historischer Arbeitsstand vor dem Cosmic Reset

Die folgenden Schnittwerk-Notizen wurden aus dem übernommenen lokalen
Arbeitsstand bewahrt. Ihre Aussagen zur gestalterischen Freigabe sind durch
den neuen Nutzerauftrag überholt; sie sind keine aktuelle Abnahme.

**Phase:** Die vom Nutzer ausdrücklich gewählte Richtung **B — Schnittwerk** ist
in Origin und Observatory integriert. **Aktueller Schritt:** abschließende
unabhängige QA, Bilder, Performance und beide Engineering-Workflows.
G3 bleibt gesperrt. Die frühere G2-C-Gestaltung ist ausdrücklich nicht abgenommen.

Der neue Auftrag begann mit identischem lokalen/Remote-/PR-HEAD
`c2e338cf723f1ec6e20b4493175a8783ac95b405`. Fünf Spezialisten und Lead lieferten
drei echte R3F-Konzepte, 1440-/390-Aufnahmen, unabhängige 390-/768-/1440-QA und
einen isolierten Performance-Kandidaten. [G2-D-Checkpoint](G2_D_REVIEW.md),
[Bildvergleich](g2d/REVIEW.html), [QA](g2d/QA.md), [Performance](g2d/PERFORMANCE.md).
Die Nutzerentscheidung ist erfolgt; die Produktionsübertragung verwendet die
bestehende Kamera, SceneRegistry, SceneDirector, Filter und einen persistenten
Canvas. Statische Einstiege: `/atlas/` und `/atlas/observatory/`. Ursprung bietet
zwei kausale Öffnungen; die Sternwarte sieben eigene Architekturen und einen
tatsächlich geöffneten Nexus-Innenhof. Keine neue Laufzeitabhängigkeit.

[Umsetzung und weiterer G2-Übergabepunkt](g2d/INTEGRATION.md),
[unabhängige integrierte QA](g2d/INTEGRATED_QA.md),
[integrierte Performance](g2d/INTEGRATED_PERFORMANCE.md),
[kuratierter Bild-/Messindex](evidence/g2d/README.md).

**Engineering:** endgültige Verifikation läuft. **Visual Experience:** integrierte
Ausführung benötigt die ausdrücklich verlangte menschliche Beurteilung. Die
Freigabe der Richtung ersetzt diese Abnahme nicht.

## Historische G2-C-Baseline

Die folgenden Ergebnisse gehören zum vorherigen G2-C-Abschluss und werden nicht
als Messung oder Verifikation der neuen Gestaltung ausgegeben.

Branch `feat/living-atlas-v3`, [Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1).
Start lokal/remote/PR: `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Der aktuelle Feature-SHA ergibt sich aus `git rev-parse HEAD`.
Finale Actions müssen auf genau diesem Feature-HEAD bestehen; Run-Links stehen im
PR-Abschluss. Main bleibt `e1e1da1cdb395d7fbb561b678f19a799d0a15043`.

## Erreicht

- Fünf native Spezialisten plus unabhängiger Architecture Reviewer, echte parallele
  Wellen mit drei Agent-Slots; disjunkte Dateieigentümer und isolierter Perf-Worktree.
- Sieben individuelle Projektarchitekturen; echte Macro/Meso/Micro-Geometrie,
  große Distanzen, mobile Kameras, Fit All/Cluster und freier Pan/Zoom.
- Such-/Kategorie-/Technologie-/Status-/Clusterfilter verändern die tatsächliche
  Szene. Dossiers, Quellen, Leerzustände, Kantenwahl und native Links integriert.
- Vollständige Kamera-/Auswahl-/Filter-History, Touch, Tastatur, Reduced Motion,
  semantische Alternative und ein persistenter Canvas erhalten.
- Repository-Belege auf feste Revisionen pinnen die sieben Projekte; technische
  und thematische Beziehungen sind getrennt. Keine erfundenen Funktionen.
- Meridian und Strata als echte Desktop-/Mobile-Studien gebaut; Meridian ausgewählt.
- CSS-Offscreen-Layout verbessert in gepaarten Messungen den ersten echten
  Origin-Frame von median 12,085 auf 10,101 s. Integriert: 10,139 s.
- Drei P1-Reviewfehler und ein mobiler Tastaturfokusfehler repariert und abgesichert.

## Nachweise und Grenzen

[Gesamtbericht](G2_C_REVIEW.md), [Multi-Agent-Checkpoint](G2_C_EXECUTION.md),
[Quellen](G2_C_SOURCES.md), [Art](G2_C_ART.md), [unabhängige QA](G2_C_QA.md),
[integrierte Performance](performance/INTEGRATED_G2C_PERFORMANCE.md),
[CI-Reparatur und ursprüngliche Retry-Historie](G2_C_CI_REPAIR.md),
[Bildindex](evidence/g2c/qa/README.md).

TypeScript, Build/Prerender und 22 Root-Unit-Tests bestehen. Unabhängig: 16 Browser-
Tests ohne Retry plus zusätzlicher Tastaturfall 1/1. G0: 6 Unit-Tests, Build,
16 Browser-Passes und 8 unveränderte gerätespezifische Skips. Root: 65/65 und
G1-Stress: 3/3 ohne Retry. Exakte CI-Ergebnisse stehen im Gesamtbericht/PR-Abschluss.
Die erste CI auf `5b81237` benötigte zwei Root-Retries. Diagnosewerte werden jetzt
nach Browser-Leerlauf frisch gelesen; Legacy-Tests erhalten einen eigenen Browser.
Die reparierte Ressourcenprüfung besteht 3/3 ohne Retry. Der PR-Abschluss nennt
die vollständige erneute Prüfung auf genau dem finalen Reparatur-SHA.

Performance bleibt **PARTIAL**, menschliche Art-Abnahme offen. Origin-LCP 4,874 s,
TBT 2065 ms; Observatory-LCP 5,282 s, TBT 905 ms im wiederholten mobilen Labor.
Keine echte Smartphone-/Safari-/Firefox-/Screenreader-Hardware-Abnahme, keine
Feld-CWV-/INP-/FPS-Aussage. Gzip-Bytegrößen verifiziert, Browsertransport verhindert
hier eine direkte komprimiert/unkomprimiert-Ladezeitaussage.

## Konkreter Übergabepunkt: G2-D

1. Aktuellen HEAD, Status, Remote und beide Actions prüfen. Original-ZIP sowie
   die nicht zugeordnete lokale Lockfile-Metadatenänderung bewahren. Runtime-Versionen
   dieses Auftrags wurden nicht geändert. Alle Feature-Dateien sind lokal integriert.
2. Größten Origin-Starttask untersuchen und HTML-/Font-/Legacy-Ladepfad weiter
   entlasten. Die gemessenen G2-D-Budgets nicht anheben, um einen Pass zu behaupten.
   Separate Observatory-Grenzen stehen im Performance-Bericht.
3. Direkt ausgelieferte Kompression und mindestens ein echtes mittleres Android-
   Gerät sowie iOS Safari messen; Frame-, Kamera- und Pixelprüfungen beibehalten.
4. Mobile Gesamtübersicht und Cluster-Annäherung gemeinsam visuell abnehmen.
   Die Übersicht priorisiert Orientierung; einzelne Formen bleiben dort klein.
5. Gesamte Origin → Observatory → Projekt → freie Kamera → Back-Journey weiter
   als Regression halten. Kein zweiter Router, Canvas oder Kamera-Ersatz.

Sechs Skills bleiben unter `.agents/skills` geladen/anwendbar; Quellen und Lizenzen
siehe `G2_SKILL_ADOPTION.md`. Lenis bleibt gemäß echtem Test in ADR-003 abgelehnt.
Die V4-/V2-/V3-Unterlagen wurden zu Beginn gelesen; der ursprüngliche Downloadpfad
war später für QA nicht mehr verfügbar. Dieser Checkpoint und die verlinkten
Berichte erlauben Fortsetzung ohne erneutes Gesamtaudit.

**Die integrierte B-Ausführung vollständig verifizieren. Die Richtungsfreigabe ersetzt
nicht die abschließende menschliche Beurteilung des integrierten Ergebnisses.
Kein main-Merge, Produktionsdeploy oder G3.**
