# G0 — prüfbarer Zwischenstand (2026-10-09)

## Quelle und Branch
Source of Truth ist ausschließlich das hochgeladene Website-ZIP (SHA-256 `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`). `main` bleibt bis zum vollständigen, geprüften ZIP-Restore unangetastet.

## Bereits im Feature-Branch
- Git-Tree auf die historischen, zum ZIP bytegleichen Dateien einschließlich Nexus-Captures und v0.2-Lockfile umgestellt.
- ZIP-spezifisches `GalaxyGuide.tsx` als eigenständige Komponente ergänzt.
- Renderer-unabhängiges CameraModel aus dem vorhandenen G0-Experiment unter `experiments/camera-spike/` ergänzt: Position, Blickziel, Zoom, Focus-Pose, exakter Return-Snapshot, Token für abgebrochene Kamerafahrten.
- Sechs Unit-Tests: lokal mit Node 22 `node --experimental-strip-types --test tests/*.test.ts` **6 bestanden, 0 fehlgeschlagen**. Das beweist keine Canvas-/Touch-Funktion.

## Noch NICHT abgeschlossen
- Großer ZIP-Quellcode, u. a. `App.tsx`, `CosmicDeepDives.tsx`, `TechSolarSystem.tsx`, `StarfieldBackdrop.tsx`, geänderte NexusStory und alle weiteren CSS-Welten-Dateien, noch nicht committed.
- Der isolierte G0-Spike ist bis jetzt nur mit Model, Tests und Readme auf GitHub; R3F Canvas/CameraRig liegen im separaten übergebenen G0-Paket, noch nicht im Branch.
- Keine vollständigen `npm ci`-/Build-/Playwright-/Axe-Nachweise dieser Wiederherstellung; keine GPU-/Mobile-Messung.
- **ZIP-Restore-Gate: offen. G0: noch nicht bestanden. Main/Deployment: nicht verändert.**

Nächster verbindlicher Schritt: ZIP-Dateien bytegenau gegen Git-Blobs abgleichen, Canvas-Spike integrieren, CI auf PR laufen lassen, erst danach Release auf main.
