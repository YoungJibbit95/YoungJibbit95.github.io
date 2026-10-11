# Living Atlas — phase checkpoint

**Phase:** G2-A implemented; local validation completed/in review. **Gate:** PENDING final feature-HEAD CI.  
**Branch:** `feat/living-atlas-v3` · [Draft PR #1](https://github.com/YoungJibbit95/YoungJibbit95.github.io/pull/1)  
**Starting / last accepted CI HEAD:** `9dd986c6218824d1c83739ae6b7726f01c598ca4`

This file is committed with the implementation. Resolve its containing commit with `git log -1 --format=%H -- docs/experience/PHASE_STATUS.md`; final validation links belong in [G2_A_REPORT.md](G2_A_REPORT.md). Always compare with current remote HEAD before continuing.

## Done

- Local checkout updated from outdated main to the existing remote PR branch before edits. No reset; original untracked ZIP preserved.
- Origin signature body, large physical bounds, authored signal graph, real geometric response, reset, mobile overview and accessible HTML controls.
- Destination camera bounds applied before flights; existing persistent Canvas and render-ready contract retained.
- Three Origin and three Observatory desktop/mobile camera storyboards in [G2_ART_DIRECTION.md](G2_ART_DIRECTION.md). Observatory remains the G1 prototype.
- Taste and Vercel guidance applied; [provenance](G2_SKILL_PROVENANCE.md). Real [Lenis comparison](decisions/ADR-003-document-scroll.md) rejected runtime adoption.

## Tested

- Root clean install, format, 6 unit tests, TypeScript/Vite/prerender.
- Full root 42 browser/Axe tests; 3 additional world-switch repetitions.
- 9 new Origin cases: real pixel change, reset, raycast/drag, far-field history, five widths, reduced-motion/fallback. Pixel samples mask DOM overlays.
- Final screenshot captures and G0 result: see report for current status and CI links.
- Chromium/software WebGL and touch emulation; real mobile hardware is not verified.

## Resume at G2-B

1. Read this file and report, `git status`, fetch, compare actual HEAD and both PR checks. Preserve the local ZIP. No G0/G1 rewrite.
2. Smallest next task: expand the pure Origin graph to an explicit staged journey (idle / source / connection / horizon), define pause/step/replay/reset and its session/history contract before adding motion. First add a model test demonstrating that each step changes only the intended authored edge and that reset clears every consequence.
3. Drive geometry and DOM from that model; test full-motion interruption, reduced-motion equivalence and world return from an arbitrary panned pose. Author mobile focus poses and visible geometry affordances; retain free camera ownership.
4. Then G2-C: verify the seven project sources, build the larger Observatory with semantic distance-based detail, source-backed edges and URL-synchronized search/filters. Complete G2-D independently before requesting G3 approval.

G2-B does not require another authorization. Human art review remains open. G3 requires express user permission. No main merge or production deploy.
