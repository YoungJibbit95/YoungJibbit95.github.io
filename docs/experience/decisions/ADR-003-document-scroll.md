# ADR-003: keep native document scrolling for G2-A

Date: 2026-10-11. Decision: **do not add Lenis to the runtime**.

## Context and experiment

Origin has a spatial input surface occupying the initial viewport. Wheel and pinch belong to CameraControls there; the document below uses native scrolling and hash links. A smoother document path would only be useful if an authored scroll journey justified it.

Reviewed Lenis README and MIT license at [revision bc152f90d7c9b04ef372718350e2f616f3c706b2](https://github.com/darkroomengineering/lenis/tree/bc152f90d7c9b04ef372718350e2f616f3c706b2). Queried npm metadata, then installed **lenis 1.3.26** only into ignored `.verification/lenis`, with lifecycle scripts disabled. Root package.json and lockfile are unchanged.

The reproducible [browser probe](../../../experiments/lenis-spike/run.mjs) injects the real distribution into the real local preview. Adapter: `autoRaf:false`, one owned RAF loop, `anchors:true`, `syncTouch:false`, `respectReducedMotion:true`, `prevent` for `[data-world-input]`, matching CSS. It destroys the instance and cancels the loop. The input marker is harmless without Lenis.

## Observed results

[Raw result](../evidence/g2a/lenis-result.json): Chromium 156.0.8078.4 on local Windows, desktop 1440×900 and Pixel 5 touch emulation, both OS motion modes, native versus Lenis: **8/8 cases passed**.

- Camera wheel zoom and emulated two-finger pinch/truck changed the physical pose with **0px document scroll drift**, all cases.
- Origin → Observatory → browser Back rendered successfully; project hash navigation and document wheel scrolling worked.
- Legacy `/#mensch` remained reachable after leaving the preview.
- Adapter cleanup stopped its callbacks; no page errors recorded.
- Native adapter adds zero callbacks. This Lenis adapter performed **30–31 callbacks in an idle 500ms sample**, including reduced motion. This measures the adapter loop, not GPU frames, FPS or battery impact.
- Minified Lenis distribution adds **5,431 gzip bytes** before integration/bundling. No runtime dependency was added.

## Reasoning and consequences

The integration is compatible in this tested Chromium setup. It does not currently supply a required visitor capability: the camera owns exploration, document sections work natively, and no scroll narrative exists yet. The added scheduler and synchronization ownership are unjustified. Native scrolling remains the production-preview behavior.

This does not establish that Lenis is intrinsically slow or incompatible. An event-driven adapter or future authored document choreography could change the tradeoff. Revisit only with a concrete experience requirement, actual device tests and the same input/history/reduced-motion checks. Real iOS, Android hardware, browser energy and thermal behavior remain unmeasured.

Run again from repository root after starting `npm run dev`:

```sh
npm install --prefix .verification/lenis lenis@1.3.26 --ignore-scripts --no-audit --no-fund
node experiments/lenis-spike/run.mjs
```
