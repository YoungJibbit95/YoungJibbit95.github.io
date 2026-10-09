# Living Atlas V3 — verbindlicher ZIP-Ausgangsstand

Stand: 2026-10-09

## Source of truth

Der vom Auftraggeber hochgeladene Snapshot `youngjibbit95.github.io.zip` ist die **verbindliche Ausgangsversion** für die Website und alle weiteren V3-Schritte. Weder der aktuelle Stand von `main` (Portfolio 0.3.0) noch der historische GitHub-Commit 0.2.0 dürfen als inhaltlich identischer Ersatz behandelt werden. Der ZIP-Snapshot umfasst u. a. `src/components/CosmicDeepDives.tsx`, `TechSolarSystem.tsx`, `Constellation.tsx` und `src/data/projects.ts`.

## Migration / Freigabe

1. Exakte ZIP-Dateien auf `feat/living-atlas-v3` importieren, ohne `main` zu überschreiben. Snapshot-Dateien ersetzen auf dieser Branch ihre Gegenstücke; zuvor hinzugefügte Main-only-Dateien müssen inventarisiert und bewusst entfernt werden.
2. `package-lock.json` reproduzierbar aus der ZIP-`package.json` auflösen, **nicht** unverändert von Portfolio 0.3.0 übernehmen.
3. `npm ci`, Typecheck, Build, Format und Playwright ausführen; erst danach ersten PR gegen `main` öffnen.
4. G0/G1 als kleinen Kamera-Spike und die nachfolgenden G-Gates gemäß Master-Recode-Plan auf **dieser** Basis umsetzen.
5. Keine Freigabe / kein Deploy auf `main`, bevor die vollständige ZIP-Übernahme und die relevanten Checks belegt sind.

## Status

Der ZIP-Import wurde **noch nicht** in diesen GitHub-Branch übertragen. Die aktuelle Branch-Erstellung allein ist kein abgeschlossener Baseline-Import. Der lokal vorbereitete ZIP-basierte G0-Worktree ist das nächste zu importierende Artefakt.
