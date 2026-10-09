# Living Atlas — G1 architecture and review

Status: **implementation candidate, CI verification required**. The existing ZIP website and the G0 camera experiment remain preserved. This document describes the opt-in G1 architecture, not visitor-facing copy.

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
