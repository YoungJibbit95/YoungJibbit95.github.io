# Living Atlas: G2-B checkpoint

**Phase:** Skill-Adoption, zweiter Origin-Designpass und G2-B implementiert.
**Nächster Schritt:** G2-C. G3 bleibt ausdrücklich gesperrt.

**Branch:** `feat/living-atlas-v3` · [Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1)

**Start dieses Auftrags:** `b2a3028020c608d2a5ef5a3471f13c46c5e91921`, lokal und
remote vor Änderungen identisch. Skill-/Design-Commit: `5ee3ac1`.
Den zu diesem Checkpoint gehörenden SHA mit
`git log -1 --format=%H -- docs/experience/PHASE_STATUS.md` ermitteln und gegen
aktuellen Remote-HEAD sowie [beide PR-Checks](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1/checks)
prüfen. Der Abschluss in PR/Chat benennt die verifizierten Runs auf diesem SHA.

## Erreicht

- Sechs Skills dauerhaft unter `.agents/skills`, geprüfte Quellen und Lizenzen,
  tatsächliche Codex-Discovery mit `forceReload:true`, vollständiges Laden und
  Anwendung. [Adoption](G2_SKILL_ADOPTION.md), [Discovery](evidence/g2b/skill-discovery.json).
- Zwei echte Canvas-Studien mit Desktop/Mobile-Vergleich; Faltarchiv gewählt:
  mineralische Lamellen, dunkle Terrassen, stärkere Tiefenstaffelung. Bestehende
  Origin-Silhouette bleibt erhalten. [Bildindex](evidence/g2b/README.md).
- Automatisches Abspielen, Pause/Fortsetzen, Einzelschritt, Wiederholen, Reset.
  Graphzustand steuert Öffnung, Licht, zwei Kanten und Portal. Freie Kamera bleibt.
- Drei eigene mobile Fokusposen, zugängliche Signalweg-Steuerung, kontrollierter
  Übergang und exakte History-Rückkehr. Session-/Playback-Vertrag im
  [G2-B-Review](G2_B_REVIEW.md).
- Vercel-Audit korrigiert navigierende Buttons, globale Hover-/Radius-Kollisionen,
  Textunterlage und Theme-Color. Native Deep Links und mittlere Maustaste geprüft.
- React-Audit trennt den Legacy-Ladepfad: Einstieg 223,63 kB / 70,21 gzip statt
  495,74 / 162,98. Preview lädt/mountet die alte App nicht mehr. No-JS-HTML bleibt.
- Lenis-Entscheidung aus ADR-003 beibehalten; keine neue Runtime-Abhängigkeit.

## Verifiziert und ausdrücklich offen

| Gate                     | Stand / Nachweis                                                                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code lokal               | PASS: Format, 7 Unit-Tests, TypeScript, Production Build, Prerender                                                                                                                             |
| Interaktion/Render lokal | PASS: 48 Playwright-/Axe-Tests; zusätzlich 3 Weltwechsel-Stressläufe. Bestehende Pixelgrenzen unverändert.                                                                                      |
| Journey                  | PASS: Pause hält tatsächliche Frames und Restzeit, freie Kamera während Pause, Replay/Step/Reset ohne veraltete Timer; alle mobilen Fokusposen und Back geprüft.                                |
| G0                       | PASS: frisches npm ci, 6 Unit-Tests, Build, 16 Browser-Tests; 8 unveränderte gerätespezifische Skips.                                                                                           |
| GitHub CI                | Beide Workflows auf dem exakten finalen PR-HEAD prüfen; Root-Deploy muss `skipped` bleiben. Keine historische grüne SHA als Ersatz.                                                             |
| Art                      | Zwei Alternativen und finale Ansichten visuell geprüft; sichtbare Material-/Raum-Evolution. Menschliche Designabnahme bleibt offen.                                                             |
| Performance              | PARTIAL: echter Ladepfadfehler behoben; Lighthouse Mobile nur 33/100, LCP 10,9 s im gedrosselten lokalen SwiftShader-Labor. Kein bestandenes CWV-Gate. Siehe Messwerte/Limitierungen im Review. |
| Geräte                   | Chromium und Touch-Emulation geprüft. Echte Android-/iOS-GPU, Safari/Firefox und Screenreader-Hardware nicht verifiziert.                                                                       |

Alle Screenshots entstanden aus dem laufenden Canvas. `g2b-origin-*` deckt
320/390/768/1440/1920 ab; Quiet/Open/Horizon zeigt dieselbe Kamera. Drei mobile
Detailkameras, Pause, Reset und Übergang sind separat archiviert. Kein Bild ersetzt
die Interaktions-/Pixeltests. G0/G1 wurden nicht neu implementiert.

## Konkreter Übergabepunkt: G2-C

1. Fetch, Status/HEAD und beide CI-Runs prüfen. Die unveränderte untracked Datei
   `youngjibbit95.github.io.zip` erhalten. Weiter im lokalen Checkout arbeiten.
2. Mit den sechs lokalen Skills die sieben Projektquellen erneut verifizieren:
   `nexus,cerebri,novacore,nemisis,adventura,yjse,jarvis`. Herkunft und Grenzen pro
   Knoten dokumentieren. Die Sternwarte ist weiterhin der G1-Prototyp.
3. Vor größerer Geometrie das gemessene Startbudget adressieren: komprimierte
   Auslieferung und echtes Zielgerät als getrennte Messungen, 3D-Initialisierung,
   Long Tasks und Font-/HTML-Last untersuchen. Kein erfundener FPS-/INP-Erfolg.
4. Große Sternwarte mit sieben unterscheidbaren Systemen, tatsächlichem Pan/Zoom,
   sichtbarem Semantic LOD und belegten Beziehungen implementieren. Search/Filter,
   Leerzustand, URL/Back und DOM-Parität gemeinsam bauen und testen.
5. G2-D-Abnahme einschließlich Origin → Observatory → Projektstern → Back,
   Screenshots, A11y, Render und CI durchführen. **G3 erst nach ausdrücklicher
   Nutzerfreigabe. Kein main-Merge, kein Produktionsdeploy.**

Vollständige V4-Unterlagen einschließlich V2-/V3-Referenzen liegen unverändert
unter `C:/Users/Administrator/Downloads/YoungJibbit95_Codex_Master_Handoff_V4/YoungJibbit95_Codex_Handoff_V4`.
