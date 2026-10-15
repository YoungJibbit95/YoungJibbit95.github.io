# G2-D: erster menschlicher Design-Checkpoint

> **Cosmic Reset, 14. Oktober 2026:** Die frühere Schnittwerk-Themenfreigabe
> wurde durch den Nutzer ausdrücklich korrigiert. Maßgeblich sind jetzt
> [Cosmic Vertical Slice und technische Prüfung](living-cosmos/REPORT.md),
> [vier integrierte Browserbilder](living-cosmos/REVIEW.html) und
> [Living Cosmos Art Direction](living-cosmos/ART_DIRECTION.md).
> Das untenstehende Protokoll bleibt als historischer Arbeitsstand erhalten.
> Die aktuelle Bildfreigabe ist offen. Kein Gesamtumbau, G3, Merge oder Deploy.

Startpunkt: lokaler Branch, GitHub und Draft PR #1 identisch auf
`c2e338cf723f1ec6e20b4493175a8783ac95b405`. Der G2-C-Engineering-Stand bleibt
die Basis. Seine Gestaltung ist ausdrücklich nicht menschlich freigegeben.

**Richtungsentscheidung erfolgt:** Der Nutzer gab am 11. Oktober 2026 ausdrücklich
„B – Schnittwerk weiterentwickeln“ frei, nachdem beide Vergleichsbilder und die
Stärken/Schwächen vorlagen. Die Umsetzung auf Origin und Observatory ist damit
autorisiert. Die folgenden Prototypen dokumentieren diesen ersten Checkpoint;
die Richtungswahl ist noch keine Abnahme des fertig integrierten Ergebnisses.
G3 bleibt gesperrt.

## Vergleich und Empfehlung

[Interaktiver Bildvergleich](g2d/REVIEW.html): tatsächliche 1440×900- und
390×844-Aufnahmen, umschaltbar zwischen Sternwarte, Nexus-Entdeckung und Origin.
Die Bilder öffnen sich in voller Auflösung. Alle drei Entwürfe verwenden echte
R3F-Geometrie und dieselben quellengeprüften Projekttexte. Keine KI-Mockups.

| Richtung                                             | Raumidee                                                                   | Stärke                                                      | Noch nicht gelöst                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| [A · The Aperture Archive](g2d/DIRECTION_A.md)       | Kalkstein- und Kupferkammern hinter monumentalen Schwellen                 | Perspektive, Schwelle und tatsächlicher Öffnungsmoment      | Ausstellungsmodell-Anmutung, noch wenig persönliche Oberflächendetails |
| [B · Schnittwerk](g2d/DIRECTION_B.md)                | Durchgehende mineralische Landschaft mit Einschnitten und einem gelben Weg | Kohärente Orientierung und klare mobile Nexus-Entdeckung    | Teilweise Modellmaßstab; Licht und Material brauchen mehr Charakter    |
| [C · Werkstatt nach Mitternacht](g2d/DIRECTION_C.md) | Gemeinsamer Arbeitsort mit sieben individuellen Apparaturen                | Persönlicher Maßstab, materielle Nähe und Objektidentitäten | Wiederholte Werkbänke, weniger Monumentalität, höhere Renderkosten     |

**Lead-Empfehlung: B als räumliche Grundrichtung.** Die durchgehende Landschaft
verbindet Überblick und Annäherung am klarsten. Persönliche Details aus C könnten
nach einer konkreten Freigabe gezielt in diesen Ort eingehen. Die unabhängige QA
bewertet B ebenfalls als klarste Übersicht und C als persönlichsten Ort; daraus
entsteht keine automatische Freigabe. Auch „keine der drei“ bleibt eine mögliche
visuelle Beurteilung.

## Tatsächliche Zusammenarbeit

Fünf native Spezialisten arbeiteten in getrennten Bereichen: A und B entwickelten
unabhängig voneinander, Performance nutzte einen isolierten Worktree, Mobile
prüfte alle Kompositionen und baute eine native Auswahl-/Lesekomponente, QA
prüfte anschließend unabhängig. Der Lead lieferte C, koordinierte exklusive
Browserfenster, Vergleich und Integration. Die drei verfügbaren Child-Slots
wurden in parallelen Wellen genutzt; keine simulierten Rollenberichte.

[Ausführung und Zuständigkeiten](G2_D_EXECUTION.md), [Mobile](g2d/MOBILE.md),
[unabhängige QA](g2d/QA.md), [Performance und Artefaktinventar](g2d/PERFORMANCE.md).

Taste, Redesign, Vercel React und die beiden Atlas-Skills wurden gelesen und an
konkreten Änderungen angewandt: bewusste Raumidee, echte Kameraposen, kontrollierte
Palette, niedrigere mobile Overlay-Dichte, native Alternativen, Demand-Rendering,
Ressourcen-Cleanup und belegte Informationen. Die Live-Referenz
[basement.studio](https://basement.studio/) wurde als gebauter, ausgestatteter Ort
mit Perspektive untersucht. Übernommen wurden Gestaltungsprinzipien, keine Assets.

## Umsetzung nach der Richtungsentscheidung

1. **Erledigt: Nutzer hat B gewählt.** Der verlangte Checkpoint aus Abschnitt 4
   wurde mit tatsächlichen Desktop-/Mobile-Bildern durchgeführt.
2. **Implementiert:** B prägt Origin als gefaltete Schwelle und Observatory als
   zusammenhängende Landschaft mit sieben eigenen Projektarchitekturen. Nexus
   öffnet in der Nähe vier Dach-/Wandsegmente und legt belegte Client-Bereiche frei.
3. Bestehende SceneRegistry, SceneDirector, Kamera, History, Filter und ein
   persistenter Canvas bleiben verantwortlich. Beide Welten haben eigene statisch
   ausgelieferte HTML-Einstiege mit zugänglichen Projekt- und Quellenartikeln.
4. Die integrierte Ausführung erhält eigene Desktop-/Mobile-Aufnahmen,
   unabhängige Regression und wiederholte Leistungsmessungen. Maßgeblich sind
   [Integration](g2d/INTEGRATION.md), [integrierte QA](g2d/INTEGRATED_QA.md) und
   [integrierte Performance](g2d/INTEGRATED_PERFORMANCE.md); die ursprünglichen
   Konzeptbilder oben bleiben als historischer Richtungsvergleich erhalten.
5. Menschliches Visual-Experience-Gate separat abnehmen. Kein G3, main-Merge oder
   Produktionsdeploy aus diesem Checkpoint ableiten.

Die Entwürfe sind eine überprüfbare Richtungsentscheidung, kein behauptetes
außergewöhnliches Endprodukt. Die noch sichtbaren Modell- und Ausstellungseindrücke
stehen ausdrücklich auf der gestalterischen Arbeitsliste.
