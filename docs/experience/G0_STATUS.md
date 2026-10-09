# G0 — Nachweisbarer Arbeitsstand

Stand: 2026-10-09 · Branch: `feat/living-atlas-v3` · Draft-PR [#1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1).

## ZIP-Restore: bestanden

**Originalquelle:** Nutzer-Upload `youngjibbit95.github.io.zip`; gesamtes ZIP SHA-256: `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`.

**Unveränderlicher GitHub-Nachweis:** [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959). Die 43 ZIP-Dateien wurden durch Vergleich der Git-Blob-SHAs mit den vor Ort aus den ZIP-Bytes berechneten Git-Blob-SHAs überprüft: **43 von 43 identisch, null Unterschiede**. Das überprüfte Git-Tree enthält außerdem acht ergänzende Dateien (Dokumentation, Lockfile und Kamera-Modelltests). Einzelne Originaldatei-SHA-256 stehen in [ORIGINAL_ZIP_MANIFEST.sha256](./ORIGINAL_ZIP_MANIFEST.sha256). Formatierung späterer Commits verändert absichtlich einzelne Blob-SHAs, nicht den Nachweis dieses Ursprungszustands.

**Kein erneuter ZIP-Import, kein Branch-Reset.** Die ehemals anderslautenden Statusangaben sind überholt.

## Vorheriger CI-Befund

[GitHub Actions Run 37939388290](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37939388290): `npm ci` erfolgreich; `npm run format:check` schlug an neun Originaldateien fehl. `npm run build`, Playwright und Axe wurden **übersprungen**, nicht bestanden. Die neun Formatfälle: `metadata.json`, `src/App.tsx`, `src/components/CosmicDeepDives.tsx`, `src/components/NexusStory.tsx`, `src/components/StarfieldBackdrop.tsx`, `src/components/TechSolarSystem.tsx`, `src/cosmic-deepdives.css`, `src/cosmic-worlds.css`, `src/portfolio.css`.

## G0-Gate

**ZIP-Gate bestanden; technisches G0-Gate noch offen**, bis der isolierte 3D-Kameraspike mit Browser-Tests sowie Format, Typecheck, Build, Playwright/Axe reproduzierbar grün ist. `main` bleibt unverändert und der PR ein Draft. Nicht automatisch G1 starten.
