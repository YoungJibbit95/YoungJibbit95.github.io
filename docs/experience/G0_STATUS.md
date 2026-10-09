# G0 — Zwischenstand

Stand: 2026-10-09.

## Quelle

- Source of Truth: Nutzer-ZIP (SHA-256 `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`).
- Der aktuelle `main` wird vor vollständiger ZIP- und CI-Prüfung nicht überschrieben.

## Im Feature-Branch

- Historische, zum ZIP bytegleiche Quellen samt Nexus-Captures und v0.2-Lockfile.
- Aus der ZIP: `GalaxyGuide.tsx`.
- Isoliertes CameraModel mit Pose, Zoom, Return-Snapshot und Flight-Cancel-Token.
- Sechs Unit-Tests bestanden lokal unter Node 22.

## Noch offen

- Vollständige ZIP-Migration: App, DeepDives, SolarSystem, Starfield, NexusStory und CSS.
- R3F-Canvas und CameraRig vollständig in GitHub übernehmen.
- Reproduzierbare `npm ci`-, Build-, Playwright- und Axe-Checks.
- WebGL, Touch, Reduced Motion und Performance nachweisen.

**ZIP-Restore-Gate: offen. G0: nicht bestanden.**

Nächster Schritt: alle ZIP-Dateien exakt übertragen und Tests auf PR ausführen.
