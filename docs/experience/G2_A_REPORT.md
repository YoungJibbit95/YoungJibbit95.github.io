# G2-A — Origin vertical slice

2026-10-11 · `feat/living-atlas-v3` · [Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1). Gate: **PENDING final HEAD CI** at this implementation checkpoint.

## What works

“Signal senden” lights the source path and opens the split lamellar body. “Signal weitergeben” activates the path to the far threshold. Reset restores the quiet geometry. Camera exploration remains independent; real mesh clicks focus the corresponding place, while dragging changes the physical camera without selecting it. Named HTML alternatives and all seven original project links work even without WebGL.

The preview remains `/?atlas=preview`. The legacy prerendered root and original hash destinations remain available. The current Observatory is still the G1 prototype; this report does not claim completed G2-B/C or G3 worlds.

## Change and evidence

| Area                                | Files                                                                                   | Reason                                                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original sculpture and causal model | `OriginWorld.tsx`, `originModel.ts`, `originSignalStore.ts`, `OriginSignalControls.tsx` | Pure shared graph drives the light paths, split-body transform and accessible response.                                                                 |
| Larger space                        | `SceneRegistry.ts`, `worldTypes.ts`, `CameraRig.tsx`, `SceneDirector.ts`                | Wider real bounds and mobile entry pose; destination boundaries precede flights to avoid old-world clamping.                                            |
| Editorial composition               | `ExperienceRoot.tsx`, `experience.css`                                                  | Almost full viewport room, restrained overlays and semantic content below.                                                                              |
| Evidence                            | `origin.spec.ts`, `origin.unit.test.ts`, existing render/interaction tests              | 9 new browser cases, 2 unit tests; old target assertion follows the new model; old render threshold is unchanged. DOM overlays masked in pixel samples. |
| Design decisions                    | Art direction, skill record, Lenis ADR/probe                                            | Explicit planned versus implemented work and reproducible dependency decision.                                                                          |

No runtime dependency added. Existing MIT ecosystem packages retained. New authored geometry needs no third-party texture/asset license. Taste, Vercel and editorial reference usage is documented in [G2_SKILL_PROVENANCE.md](G2_SKILL_PROVENANCE.md).

Implementation commit: `eda76e0a42090add691e2db908ab663e0c47a74f`. Evidence/report commit follows without runtime changes.

## Local validation

| Gate                                 | Result            | Evidence / limit                                                                                                                       |
| ------------------------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Root `npm ci`                        | PASS              | Clean install; 0 reported vulnerabilities at run time.                                                                                 |
| Format / unit / build                | PASS              | Prettier, **6/6** unit tests, TypeScript, Vite and prerender.                                                                          |
| Full root Playwright/Axe             | PASS              | **42/42**, one Chromium worker, about 3 minutes; includes old portfolio behavior and no-JS HTML.                                       |
| Repeated persistent-world pixel test | PASS              | **3/3**, separate `test-results/g1-stress` output; unchanged >35 lit / >6 shade thresholds.                                            |
| Origin-specific tests                | PASS              | **9/9**; repeated successfully after final label positioning.                                                                          |
| Lenis integration                    | PASS; not adopted | **8/8** native/Lenis × desktop/touch × full/reduced; [raw measurements](evidence/g2a/lenis-result.json).                               |
| G0 unit / build / browser            | PASS              | 6/6 unit; typecheck/build; 16 browser passes and 8 existing device-specific skips. Clean install: 0 vulnerabilities.                   |
| Art review                           | PROVISIONAL       | Actual 320/390/768/1440/1920 captures inspected. Signature, depth and causal response present; human approval is not inferred from CI. |
| Physical devices / real GPU          | UNVERIFIED        | Chromium SwiftShader and CDP touch emulation are not iOS/Android hardware, FPS, thermals or battery evidence.                          |

Browser console inspected in the in-app browser after actual world navigation: no recorded errors/warnings. Initial mobile body clipping and desktop occlusion of the second signal consequence were repaired based on screenshots and a failing pixel assertion, not by relaxing tests. A final tablet/mobile location-label overlap was corrected in CSS.

Local G0 tooling note: the inherited Windows PATH was 7,686 characters long. Nested npm calls could not resolve their compiler/server shims. The unchanged scripts passed after shortening PATH only within the test process to the project bin, Node and Windows directories. No persistent machine setting or G0 source was changed.

## Bundle observations

Local production build, decimal kB reported by Vite: Origin lazy chunk **6.59 kB / 2.25 gzip** (G1 2.22 / 1.02). ExperienceRoot **15.34 / 5.18** (G1 17.23 / 5.98). CSS **125.46 / 29.57** (G1 122.73 / 29.10). Main index **495.71 / 162.96** (G1 495.54 / 162.83); existing shared Three chunk **862.87 / 229.12**. The >500 kB Vite warning still exists; no performance/FPS claim is made. Geometry is procedural, repeated ribs instanced, DPR remains capped by G1, no continuous ambient effect or added postprocessing.

## Screenshots and preview

See [evidence index](evidence/g2a/README.md). Desktop and mobile images are real Playwright Chromium/WebGL captures; reduced motion is used for deterministic static endpoints. No generated background or montage.

From this local checkout:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000/?atlas=preview`. Send twice, reset, drag, use the named places below the stage, enter the Sternwarte and return with browser Back. This is a local preview, not a deployment.

## Precise handoff

[PHASE_STATUS.md](PHASE_STATUS.md) is the resume hook. Next: formalize the complete Origin signal journey with pause/step/replay/reset and explicit history semantics, then implement its focused mobile composition and controlled portal passage. Keep camera pose independent of signal state; preserve exact physical pose on world return. G2-C then owns seven project nodes and real semantic zoom; G2-D owns complete acceptance. No G3 without express approval, no main merge or production deploy.
