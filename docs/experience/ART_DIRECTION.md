# Art Direction — Living Atlas / Crafted Universe

**Interne Designgrundlage; keine sichtbare Recode-Erklärung.** Die Website ist der Ort selbst: räumlich erkundbar, offen, technisch ehrliche Projektgeschichten und eine klare Persönlichkeit.

## Gestalterische Grammatik

**Sehen → Ansteuern → Berühren → Reaktion → Verstehen → Weiterziehen.** Die Kamera ist ein Erzähler: veränderte Perspektive deckt reale Beziehungen auf; ein Signal zeigt Folgen, nicht Dekoration. Die neun geplanten Orte erhalten unterschiedliche Material- und Bewegungslogiken. Für G0 wird nur **ein** isolierter physischer Raum realisiert, kein Satz neun dekorativer Welten.

- **Farbsemantik:** Deep Space `#070914` / Navy `#101726`; Editorial-Text `#E9EDF4`; Beziehungen `#78E8E8`; Fokus `#A891FF`; Schmiedearbeit `#F3B867`; Organisches `#96BFA3`.
- **Komposition:** 80–100 % der Immersive-Bühne als Raum; große kontrollierte Typografie außerhalb der Interaktionsgeometrie, wenige Hotspots. Vordergrund, mittlere Bühne, tiefe Landmarken und Verdeckung statt einer starren, skalierbaren SVG-Tapete.
- **Bewegung:** Fokusfahrten kontrollierbar/abbrechbar. Eingaben haben Vorrang vor Dramaturgie; Reduced Motion springt an denselben Ort ohne Tunnel.
- **Orientierung:** Ein ruhiges DOM-Ortsregister und Rückkehr zur gespeicherten Pose funktionieren unabhängig von Raycasting. Keine generische Neon-Dashboard-UI, keine erfundenen Telemetrie- oder Projekttatsachen.
- **Mobile:** perspektivisch geführte Kamera, größere Touch-Ziele, klarer Ortswechsel und echtes Pinch/Drag nur über der Bühne. Kein blockierender Onboarding-Film.
- **Visuelle Referenz:** [Basement](https://basement.studio/) ausschließlich als Anspruch an Qualität und Mut; kein Kopieren von Code, Layout, Material oder Animation.

## Storyboard 1 — Origin: Distanz gibt Bedeutung

- **Wide** `position [0,12,42]`, `target [0,0,-5]`: Ein leer wirkender, in Wirklichkeit tiefer Raum. Die klare Hero-Zeile steht vor drei gestaffelten Landmarken. Drag zeigt unterschiedliche Parallaxe.
- **Approach** `position [-6,7,22]`, `target [-8,1,-9]`: Ein kuratierter Projektcluster wächst perspektivisch. Seine Signalverbindungen reagieren auf die Auswahl; kein neues Popup ersetzt die Bewegung.
- **Threshold** `position [-11,3,8]`, `target [-13,1,-18]`: Eine Landmarke füllt das Sichtfeld. Kamera-Match-Cut zur Sternwarte, Rückkehr zur ursprünglichen Origin-Pose.

## Storyboard 2 — Observatory: Die Karte ist größer als das Fenster

- **Atlas** `position [0,0,54]`, `target [0,0,0]`: 7 Projektknoten und fernere Archive in kuratierten Clustern. Karte erstreckt sich über den Bildschirmrand; Drag und kontinuierlicher Zoom bleiben echt.
- **Network** `position [13,2,29]`, `target [13,2,0]`: Projekte und **belegte** Verbindungen werden klar. Filter modifiziert Knoten und Kanten, nicht lediglich Labels.
- **Nexus** `position [-14,7,12]`, `target [-14,7,0]`: Nexus ist groß, die übrige Karte bleibt räumlich an ihrem Ort. Übergang in Nexus; Back restauriert exakte Pose, Selektion und Filter.

## Storyboard 3 — Nexus: Eine Mitte, vier Blickwinkel

- **System** `position [0,13,31]`, `target [0,0,0]`: Vier räumlich unterscheidbare Clients um einen gemeinsamen Kern. Sichtbare UI-Fragmente und echte versionsgebundene Nexus-Captures.
- **Client** `position [-12,5,11]`, `target [-10,2,-1]`: Perspektive wandert von der Architektur zu einer Produktoberfläche. Ein belegbares Beispielereignis signalisiert nur beteiligte Actors.
- **Core** `position [1,5,8]`, `target [0,1,0]`: Der Kern wird verständlich. Pausierbarer Eventpfad, klare Quellen- und Demo-Grenzen, Rückflug zur Systempose bzw. zur Sternwarte.

*Diese 9 Posen sind **Kamera-Storyboards**, noch keine implementierten Welten. G0 überprüft die Kamera-/Input-Grammatik anhand eines separaten räumlichen Prüfaufbaus.*
