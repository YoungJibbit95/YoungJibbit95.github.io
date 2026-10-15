# Living Atlas V3 — G0-Abnahmebericht

Stand: 09.10.2026 · Branch `feat/living-atlas-v3` · [Draft-PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1) · `main` am geprüften Stand `e1e1da1cdb395d7fbb561b678f19a799d0a15043` unverändert.

## 1. Verifizierte Ausgangsbasis — abgeschlossen

- **Originale ZIP:** `youngjibbit95.github.io.zip`, SHA-256 `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`.
- **43/43 Originaldateien** am unveränderlichen [Commit 93a581ee](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959) als identische Git-Blob-SHAs bestätigt; [Einzeldatei-SHA-256](./ORIGINAL_ZIP_MANIFEST.sha256). Originalzustand bleibt trotz späterer Prettier-Änderungen rückverfolgbar. **Kein Reset / kein erneuter Import.**
- [Commit 51ade2cd](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/51ade2cd7433b9a80569ef6fb3793788740dd96b): korrigierter ZIP-/Quellen-Status, Art Direction, drei Storyboards. [Commit 18873785](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/1887378555c9e31d18ae51f210fb28c8ffa4e563): reine Prettier-Formatierung der neun Originaldateien.

## 2. Fehleranalyse und Korrekturen

1. **Kamera-Rückkehr:** Vorheriger Test verglich eine veraltete React-Pose-Anzeige mit der echten Kamera, deren Wheel-Dolly noch auslief; die scheinbare Abweichung betrug teils mehrere Welteinheiten. `CameraRig` sichert beim Fokusbeginn die tatsächliche `CameraControls`-Pose in History; `saved-pose` dient nur der Testbeobachtbarkeit. Nach `Back` werden echte Kamera, Zoom/FOV und Selektion wiederhergestellt. `FlightToken` verhindert die späte Übernahme abgebrochener Fahrten. [Implementierungsfix ec6e3c3](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/ec6e3c3aefe7676a0641e95d376b870de1c68cc0), Regressionstest für Fokus während auslaufendem Wheel und nach beendeter Navigation.
2. **No-JavaScript:** Das persönliche Zitat existiert an zwei beabsichtigten Stellen innerhalb von `#mensch`. Statt eines pauschalen `.first()` wählt der Test gezielt `#mensch .person-copy blockquote`; beide Texte bleiben im Original erhalten. [Fix 8dff48fb](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/8dff48fb4f5664f59150c9b96e35e01cc29c6914).
3. **Nexus-Animation:** GSAP-`ScrollTrigger` wurde bei Kapitelwechsel erneut als Startbedingung angewandt; daher konnte `.story-media` auf `opacity: 0.4` stehen bleiben. Kapitelwechsel starten ihre eigene Timeline ohne Scroll-Trigger, Initialeinblendung bleibt scrollgesteuert, `useGSAP` kümmert sich um Revert/Cancel bei Motion-Änderungen. Regression über Chapter-Wechsel und `Bewegung: off`. [Fix ec6e3c3](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/ec6e3c3aefe7676a0641e95d376b870de1c68cc0).
4. **Rechtsklick-Orbit:** Der erste neue Test griff wegen einer bei 720px teilweise unter dem Fold liegenden Canvas außerhalb des Viewports. `canvas.scrollIntoViewIfNeeded()` positioniert die Geste innerhalb des sichtbaren Canvas; Winkeländerung und unverändertes Fokusziel bleiben streng geprüft. [Testfix 79ec6fbe](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/79ec6fbe483e548a3b20a574d1c43e19fce4fa0d).
5. **Mobile und Selektion:** CDP-Zwei-Finger-Gesten prüfen Zoom und gemeinsames Truck sowie den Ausschluss von Seitenscroll. Ergänzte E2E-Assertions prüfen Position, Target, FOV, Zoom und ausgewähltes Objekt nach Rückkehr und bei aufeinanderfolgenden Fokussierungen. Keine pauschalen Toleranzerhöhungen.

- **Weitere Regression:** Die Canvas wird vor Desktop-Drag in den sichtbaren Viewport gescrollt ([79ec6fbe](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/79ec6fbe483e548a3b20a574d1c43e19fce4fa0d)); ein separater Test prüft Rückkehr mit Auswahl sowie mobile Seitenscroll-Sperre. Kein Assertion-Gate wurde abgeschwächt.

## 3. CI-Verifikation

**Vollständig grüner Code-Stand vor dem abschließenden Dokumentationscommit:** [`79ec6fbe`](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/79ec6fbef366fac9bd147752127601cdc471ff9e).

**Website-Root — [CI-Run 37951732950](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732950):** Erfolgreich: `npm ci`, `npm run format:check`, `npm run build` (TypeScript + Vite + Prerender), Chromium/Playwright `npm test` — **13 von 13 bestanden**, Axe eingeschlossen.

**Kamera-Spike — [CI-Run 37951732921](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732921):** Erfolgreich: `npm ci`, **6 von 6** Modelltests, Typecheck, Build, Chromium/Playwright — **16 bestanden, 8 gezielte Desktop/Mobile-Projekt-Skips**, Axe eingeschlossen.

**Gate-Regel:** Nach diesem Dokumentations-/Regressionstestcommit gelten die **neuen** GitHub-Checks auf dessen HEAD als maßgeblicher Freigabenachweis. Ein Lauf mit `action_required`, `in_progress` oder fehlgeschlagenen Tests ist **nicht** grün; der Draft-PR bleibt ohne Merge.

## 4. Browser-/Bildbeweis

[GitHub-Actions-Kameralauf 37951732921, Screenshot-Artefakt `g0-camera-browser-evidence`](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37951732921/artifacts/11625819236): `g0-desktop-focused.png`, `g0-mobile-focused.png`, Browser-Traces bei Fehlern. Desktop zeigt Perspektive, die drei echten räumlichen Anker, Grid und große Typografie. Mobile zeigt Bühne und DOM-Ortsliste ohne horizontalen Overflow. Gestentests prüfen mathematische Kameraposen; Screenshots allein gelten **nicht** als Bewegungsbeweis.

## 5. Abgrenzung und nächster technischer Schritt

- Getestet: Ubuntu/Chromium mit Software-WebGL (SwiftShader), Playwright Mobile-Preset/Chromium-Touchsimulation, Keyboard, Reduced Motion, No-WebGL, No-JS, WCAG 2.1 A/AA Axe.
- **Offen:** echte iOS-Safari-/Android-Chrome-Geräte, Performance-/FPS-/GPU-Messungen, detailliertes Motion-/Art-Review auf realer Hardware. Kein FPS-Wert wird erfunden.
- **G0-Entscheidung:** Der Code-Stand `79ec6fbe` besteht beide vollständigen PR-Workflows. Nach diesem Dokumentationscommit ist der neue HEAD erneut zu prüfen; erst dann wird G0 als abgeschlossen markiert.
- **G1-Startpunkt nach ausdrücklicher Freigabe:** Den bewiesenen `CameraRig`-/History-/Gesture-Vertrag in SSR-sichere `ExperienceRoot`/SceneRegistry und Zustand-Navigation auf der bestehenden ZIP-basierten Website integrieren. **Keine** dekorativen neun Scheinwelten, **kein** Merge oder Release auf `main`.
