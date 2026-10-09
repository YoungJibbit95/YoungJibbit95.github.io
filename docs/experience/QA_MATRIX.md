# G0 — QA-Matrix / Ergebnisstand

## Historische Baseline

| Check | Ergebnis / Nachweis |
| --- | --- |
| Original-ZIP, SHA-256 | `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15` |
| 43 Originaldateien (Git Blob + Einzel-SHA) | **43/43 verifiziert** bei [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959), [Manifest](./ORIGINAL_ZIP_MANIFEST.sha256) |
| 9 originale Prettier-Fehler | Reine Formatierung in [18873785](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/1887378555c9e31d18ae51f210fb28c8ffa4e563) |
| Temporäre Hilfsworkflows | Nach Verwendung wieder entfernt, reguläre Root-/G0-Jobs bleiben |

## Bereits grüne GitHub-Workflows

| Pfad | Letzter bestätigter grüner Run auf `255587d2` | Bestanden |
| --- | --- | --- |
| Root | [37947749214](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749214) | npm ci, format:check, TypeScript/Vite/prerender Build, **13 Playwright inkl. Axe** |
| Kamera | [37947749259](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749259) | npm ci, **6 Unit**, Typecheck/Build, **14 Playwright bestanden + 6 absichtliche gerätespezifische Skips**, Axe |
| Screenshot und Traces | [Artefakt 11624087986](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37947749259/artifacts/11624087986) | Desktop-/Mobile-Fokus-Screenshots; Bildschirmbeweis ≠ Kameramessung |

## Technische G0-Abnahmematrix

| Verhalten | Prüfmethode | Grenze |
| --- | --- | --- |
| Tatsächliche Kamera statt CSS-Scale | Playwright-Pose: Truck, Dolly, Fokus, Back | `position` + `target` mit max. 0.05 Welteinheiten Abweichung zur **am Fokusbeginn** gespeicherten Pose |
| Rückkehr inkl. kompletter Pose und Selektion | E2E prüft `fov`, `zoom`, `aria-pressed`; Unit prüft Snapshot-Klonierung | Keine großzügigere Toleranz |
| Abbruch von Kamerafahrt | Wechsel zu manueller Geste, FlightToken/Controls | Keine späteren Zielüberschreibungen |
| Rechtsklick-Orbit | Desktop-Maustaste rechts, Winkeländerung | Azimut > 0.08 rad, Fokuszieländerung < 0.2 Welteinheiten |
| Pinch/Dolly + 2-Finger-Truck | Playwright Chromium mobile CDP Touch | Zoomdistanz > 0.25 und Truck-Delta > 0.1; kein Scrollen außerhalb Bühne |
| Bedienalternativen | Keyboard Enter/Escape/Arrow, Reduced Motion, No-JS, WebGL2-Probe | Direkte Projektlinks und Ortsliste erhalten |
| Barrierefreiheit | Root und Spike Playwright/Axe; Responsive Layouts | Keine relevanten Axe-Probleme in untersuchten WCAG-2.1-Profilen |

**Nicht gemessen:** echte iOS/Android-Geräte und FPS/Performance auf spezifischer GPU. **Kein Merge / kein Start von G1**, bevor die beiden regulären CI-Checks des aktuellen HEAD erfolgreich sind und die Auftraggeber-Freigabe vorliegt.
