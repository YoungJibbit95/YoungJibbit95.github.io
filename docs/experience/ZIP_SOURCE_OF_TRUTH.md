# Living Atlas — verbindliche Quellbasis

**Stand:** 2026-10-09 · **Ausgangsversion:** vom Auftraggeber hochgeladenes `youngjibbit95.github.io.zip` · **SHA-256:** `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`

## Source of Truth

Die hochgeladene ZIP-Website ist die ausdrücklich autorisierte Produkt- und Inhaltsbasis. Nicht mit dem historischen GitHub-Tag/Commit v0.2.0 verwechseln: Im ZIP liegen zusätzlich `CosmicDeepDives.tsx`, `TechSolarSystem.tsx`, `StarfieldBackdrop.tsx`, `GalaxyGuide.tsx`, drei CSS-Welten-Dateien und Änderungen an bestehenden Komponenten. Der aktuelle `main` (Release 0.3.0) ist **nicht** Quelle für Layout oder Inhalte.

Ein Git-Reset auf den alten v0.2-Commit stellt das ZIP **nicht** vollständig wieder her. Nicht auf `main` veröffentlichen, solange der wiederhergestellte Quellstand nicht mit dem ZIP abgeglichen ist und die Build-/Browser-Gates offen sind.

`package-lock.json` ist im ZIP nicht enthalten, im historischen GitHub-Release 0.2.0 aber vorhanden. Der vorhandene v0.2-Lockfile passt zur Paketliste inklusive Caveat; zur reproduzierbaren Installation beibehalten und CI prüfen. Originale Nexus-Captures und `public/media/nexus/SOURCES.md` unverändert erhalten.

## Iterative Release-Strategie

1. **ZIP-Restore:** 43 ZIP-Dateien inkl. aller Weltkomponenten exakt abgleichen; Lockfile ergänzen. Test-Gate: `npm ci`, Format, Typecheck, Build, Playwright/Axe; erst danach `main`.
2. **G0 — Audit und Kameraspike:** Inhalts- und Quelleninventar, Kamera-Prototyp mit echten Koordinaten, Pan/Zoom/Focus/Return, Zugänglichkeits-Fallback. Im isolierten Bereich, nicht als Pseudo-Welt ins Live-UI.
3. **G1 — Shell und gemeinsame Kamera:** SSR-sicherer Canvas, World-/Navigation-State, Input-Schiedsrichter, Deep Links/Back, Fallback.
4. **G2 — Origin und Observatory:** echte kameragesteuerte Pan-/Zoom-Welten.
5. **G3 — Nexus:** zwei belegte Sample-Events, nachvollziehbare Reaktionen, Pause/Replay, identische Rückkehrpose (hartes Gate).
6. **G4–G9:** Core stabilisieren; Cerebri/Heliosphere, Forge, YJarvis/Thinking, Garden; finale Content-/Mobile-/Perf-/Accessibility-Abnahme.

Verbindliche Detailanforderungen: vom Auftraggeber bereitgestellte `YoungJibbit95_MASTER_PROMPT_V3.md` und `YoungJibbit95_MASTER_RECODE_PLAN_V3.md`. UI zeigt kein V3/Recode-Tagebuch und stellt illustrative Funktionsweisen nicht als live integrierte Produktfeatures dar.

**Release-Regel:** Jeder PR erhält geänderte Dateien, Browser-Demo, tatsächliche Testergebnisse, Risiken und Gate-Status. Keine Tests lockern; `main` erst nach bestandenem Check und Freigabe. Kein weiterer Weltenbau, solange der aktuelle Quality Gate offen ist.
