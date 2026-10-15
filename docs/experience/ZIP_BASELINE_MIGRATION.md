# ZIP-Basis — Restore abgeschlossen

Das vom Auftraggeber hochgeladene `youngjibbit95.github.io.zip` ist die verbindliche Ausgangsbasis für Living Atlas V3. Es ist **nicht** mit dem Live-Release v0.3.0 auf `main` oder dem historischen GitHub-v0.2.0-Commit gleichzusetzen.

- **Restore-Nachweis:** [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959) auf der bestehenden Branch `feat/living-atlas-v3`.
- **SHA-256 Original-ZIP:** `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`.
- **Dateivergleich:** 43/43 der einzelnen ZIP-Einträge per Git-Blob-SHA mit dem Branch-Tree dieses Commits identisch; [Datei-Manifest](./ORIGINAL_ZIP_MANIFEST.sha256).
- **Lockfile:** Zusätzliches, zur v0.2-Paketbasis passendes `package-lock.json` liegt im Branch; `npm ci` war in [Run 37939388290](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37939388290) erfolgreich.
- **Weiterer Ablauf:** neun Prettier-Abweichungen isoliert beheben, bestehende Site-/A11y-Checks reproduzieren, dann echten R3F-v9-Kameraspike (isoliert, ohne Austausch des Live-App-Pfads) mit Browsernachweisen abschließen.
- **Sicherheit:** Keine erneuten Restore-Arbeiten, kein Reset, kein neuer Branch. `main` nur nach expliziter Freigabe verändern.

Dieser Status ersetzt die irrtümliche Aussage, die vollständigen Weltkomponenten fehlten noch im Feature-Branch.
