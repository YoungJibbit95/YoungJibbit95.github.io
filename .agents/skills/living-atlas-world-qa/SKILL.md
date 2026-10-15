---
name: living-atlas-world-qa
description: Independently verify a YoungJibbit95 world via GitHub CI, true Canvas pixel evidence, real navigation/history gestures, accessibility, source-backed claims and visual art direction. Use before each G2-G9 phase acceptance.
---

# Living Atlas — World Acceptance Review

## Rules

Be a skeptical quality reviewer, not a completion cheerleader. Read `07_QA_AND_RELEASE_GATES.md` and last `docs/experience/PHASE_STATUS.md`; compare **current** GitHub HEAD. Do not assert a test passed without a concrete command/log or successful Actions conclusion. An in-progress/cancelled run is not success. The public site stays unchanged until release approval.

## Evidence steps

1. Reproduce or inspect `npm ci`, format, Unit, TypeScript/Vite/Prerender, full Playwright/Axe and dedicated G0 camera tests.
2. Check the G1 world-switch stress test for 3 repeated runs, working one persistent canvas and no black frame. Watch the historical Playwright `locator.screenshot()` scroll auto-stability trap: prefer explicit viewport position and correct visible Canvas crop.
3. Inspect 390/1440 screenshots and one pre/post interaction pair. Pixel metrics are not enough; look for memorable form, depth, true offscreen exploration and readable overlays. Additional 768/1920 layouts when world goes to G2 quality gate.
4. Verify camera pose + target + FOV + zoom + selection + filters and browser history after Back/Forward. Test interrupted flights and rapid focus.
5. Verify Model/graph outcomes actually drive geometry, light/edges and DOM; examine truth/evidence source for claims.
6. Test No-JS/No-WebGL/ReducedMotion/Keyboard/Touch; note simulated vs real device.
7. Inspect bundle/network/perf trends where tooling allows. No fabricated FPS, VRAM or Web Vitals.
8. Publish concise `PASS|FAIL|BLOCKED|PENDING` for each gate with evidence links and exact next repair.

## Severity

`P0`: main accidentally changed, losing source data, inaccessible content, fabricated project fact, persistent black canvas, broken Back/History.

`P1`: critical input gesture broken, wrong filter/LOD behavior, serious/critical Axe errors, flaky world switch, visible mobile clipping, severe performance regression.

`P2`: visual roughness, secondary overlay hierarchy, polish gaps.

Never hide P0/P1 by loosening tests or rewording acceptance. Report independent art quality separate from CI.
