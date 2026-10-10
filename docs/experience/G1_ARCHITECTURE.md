# Living Atlas — G1 architecture and review

Status: **G1 implementation and browser proof verified on code commit `351c6c13`; final documentation-HEAD CI pending**. The existing ZIP website and the G0 camera experiment remain preserved. This document describes the opt-in G1 architecture, not visitor-facing copy.

## Entry and SSR contract

- Default `/`, every existing `/#anchor` and prerender output still render the original `App` without needing WebGL or JavaScript.
- `/?atlas=preview` opts into the G1 shell **only after client hydration**. `src/experience/Entry.tsx` returns the original `App` on the server and during the initial client render, then lazy-loads the G1 client experience after a query-flag check.
- Deep links: `/?atlas=preview&world=observatory&focus=nexus`. Both IDs are allow-listed. Invalid world IDs resolve to `origin`, and invalid focus IDs resolve to the world's overview. Browser entry uses query parameters to remain compatible with GitHub Pages static hosting. Existing hash anchors are untouched in the original version.

## G1 scope and two spatial prototype states

Exactly two prototype worlds are registered: `origin` and `observatory`. The strict WorldId type already includes all nine future IDs, but **unimplemented worlds do not mount placeholder scenes or pretend to be released**.

Every WorldDefinition declares stable IDs, title, camera bounds and poses, accessible hotspots, a dynamic scene import, destinations, assets, fallback copy, Motion policy and optional enter/exit hooks. This is enough for G2 to replace the spatial studies with substantive Origin/Observatory implementations without rewriting the camera, routing or store.

The new shell is not a technical case study on the actual public site. Internal provenance distinguishes illustrative spatial landmarks from project text derived from `src/data/projects.ts`. Real repository links remain accessible in HTML without any canvas interaction.

## Camera and navigation contracts

- The single `WorldCanvas` mounts a persistent CameraRig and switches between two lazy scenes. No parallel Canvas, global canvas router, or world-spanning asset preload.
- G0-derived CameraControls is the physical source of truth: live position, target, fov, zoom. Drag trucks, right-button drag orbits, wheel and pinch dolly, DOM focus choices fly to 3D coordinates.
- The `SceneDirector` exclusively owns `idle`, `transitioning`, `focused`, `returning`, `interrupted`, and `error`. A new command cancels the old flight and invalidates its sequence. Store poses update at navigation boundaries and Controls rest/sleep, not on every frame.
- At navigation, the actual current CameraControls pose and selection are written to the outgoing browser history entry _before_ `pushState`. The new entry holds its own snapshot and bounded stack. `popstate` validates and restores it without adding another history entry. In-app Back delegates to browser history; direct-entry fallback returns to overview.
- A non-passive wheel handler inside the canvas-owned stage prevents page scroll while camera zoom runs. Outside the stage, document scroll works normally. Touch-action none applies only to the stage. HTML controls and text inputs retain their default keyboard behavior.

## Rendering, fallbacks and performance

- Canvas and all Three imports load only from the client lazy boundary. Probe for WebGL2 in an effect; use a semantic HTML path and Error Boundary if unavailable.
- WebGL context loss triggers a real fallback; an invisible tab switches to frameloop `never`, with demand rendering otherwise.
- DPR capped at 1.5, fixed deterministic star layouts, no physics engine, sound, expensive postprocessing or runtime geodata. Scene resources are disposed through R3F on scene unmount.
- Reduced motion replaces animated flights with immediate positional changes while retaining every navigation action.
- Note: SSR renders the **complete legacy portfolio** on the preview query when JavaScript is off; that is the intentional fallback. The G1-specific DOM list appears when JavaScript is enabled even if WebGL is unavailable.

## Verification

Root tests, existing G0 tests, Registry/History unit checks and G1 Playwright (single Canvas, focus/back, deep links, interruption, wheel isolation, reduced motion, WebGL/no-JS, Axe and viewport screenshots) must all pass in the normal PR workflows. Screenshots show composition but do not prove gesture function. Real Safari/iOS/Android touch, real-GPU FPS and visual art sign-off remain separate reviews.

G2 starts only after user acceptance of G1: replace the two prototype scenes with meaningful Origin and Observatory, seven verified nodes and responsive semantic zoom. G3 Nexus later; no G1 merge to `main` is authorized.


## G1 final recovery: rendering and motion stability

### Black desktop stage — reproduced and corrected

The [previous Root screenshot artifact](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/37959533980/artifacts/11630468220) rendered the 1440px Observatory stage black, although its mobile counterpart showed geometry. A real screenshot crop of the old stage was 99.31% near-black. DOM presence of a `canvas` proved neither lazy scene completion nor a painted frame.

The original `WorldCanvas` used `frameloop="demand"` with Suspense/lazy scenes, but did not explicitly request or acknowledge frames after a lazy-world commit or resize. `SceneRenderReady` now requests invalidation when the world/viewport commits, observes the `gl.info.render.frame` counter advance after an actual render, and reports scene readiness only after that frame. The ready output is non-visual test instrumentation; the renderer remains a single persistent R3F canvas with only the selected scene mounted.

The separate `tests/experience.render.spec.ts` decodes Playwright **composited canvas screenshots** to inspect visible landmark pixels and color variation, rather than trusting the readiness flag. Four required screenshots cover both Origin and Observatory at 390px and 1440px; additional tests switch the two scenes repeatedly without remounting Canvas and synthesize `webglcontextlost` to verify fallback. The screenshot pixel requirement is more than 35 colored pixels and more than six quantized shades in a 240 × 150 sample. This is a deliberate regression gate against an empty or all-black WebGL frame. It is not an FPS metric.

[New browser evidence on code commit `351c6c13`](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277487/artifacts/11675719143) shows all four populated stages and the original responsive screenshot pair. In the comparable Observatory desktop crop the black-pixel fraction dropped from 99.31% to 0%; the presence of three lit anchors and a connected grid was inspected visually.

### Nexus animation and reduced motion

The legacy `NexusStory` composed a scroll-activated initial GSAP timeline and new chapter timelines. During parallel software-WebGL CI the media fade could remain partway through the `opacity: 0.4 → 1` tween, and the interactive navigation bar itself was shifted by the global scroll-reveal `data-stage` animation, producing unstable click targets. G1 keeps the short geometry/translation animation but no longer fades the large media or context nodes; active chapter controls are no longer moving scroll-reveal targets. On non-full motion modes, GSAP-cleared `opacity` and `transform` styles prevent stranded intermediate presentation after timeline cleanup. Text and content remain fully readable.

`MotionProvider` already persisted explicit opt-out in localStorage, read the system preference on mount and restored it after reload. The single transient reduced-motion failure occurred during CPU-heavy concurrent Chromium/SwiftShader testing and passed its retry; no unsupported state defect was established. CI now uses a **single browser worker** on its software-WebGL runner (without changing assertions or timeouts), isolating animation scheduling from simultaneous GPU emulation. The existing reduced-motion persistence and Nexus motion-interruption tests remain mandatory.

### CI evidence and limits

- Root check [run 38069277487](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277487) on code commit `351c6c13`: `npm ci`, formatting, **4 unit tests**, TypeScript, Vite/prerender and **30 Chromium Playwright/Axe tests passed** on the initial attempt; a repetition of the job was requested to rule out a one-off success. Do not count an in-progress retry as green.
- G0 check [run 38069277355](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277355): successful standalone camera model, build and browser/Axe regression path.
- Screenshot artifact: [g1-preview-evidence](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38069277487/artifacts/11675719143). Screenshots show composition; mouse/touch/history assertions independently prove interactions.
- The final **documentation commit** must itself have two fully completed successful checks before G1 is declared accepted. A GitHub Pages PR run skips the deployment job by design. `main` stays unchanged.
- Known manual follow-ups: iOS Safari, physical Android devices, real GPU/thermal/FPS measurements and cross-browser compositing. No performance numbers are invented.

### Art-direction handoff for G2 (not implemented during G1)

The restored scenes are deliberately minimal greyboxes. The 1440px composition has a readable editorial hierarchy, three spatial anchors and controlled depth but still resembles a central canvas plus informational sidebar. G2 should let the room occupy most of the viewport, pull project navigation into a restrained overlay/compass, and make foreground/midground/background depth and occlusion part of the storytelling. Origin needs a curated wide composition with immediate camera freedom; Observatory needs an atlas larger than the screen with seven verified project nodes, semantic zoom and meaningful edges. Preserve direct project links and mobile readability. **No G2/G3 world content or assets were created in G1.**
