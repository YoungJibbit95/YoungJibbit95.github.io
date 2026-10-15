# Nexus: Interaction, UX and Readability

## Scope and design decision

Nexus keeps the existing discovery path: choose the project, approach it physically,
then discover the core. The dossier remains available at every camera distance and
without WebGL. This pass gives that dossier the same semantic vocabulary as the new
stellar system, without adding a separate panel, modal or navigation mechanism.

`@nexus/core` is introduced first. Four definition-list rows then identify Nexus Main
and Nexus Mobile as workspace clients, and Nexus Code and Nexus Code Mobile as code
editors. Desktop/mobile is written out. Readers do not have to infer function from
color or recognize a particular 3D silhouette.

The names and roles come from the same dependency-free `nexusSemantics` module used
by the scene. The existing pinned [Nexus README](https://github.com/YoungJibbit95/Nexus-Ecosystem/blob/835cd116174981efe2f330b1083552091f52f808/README.md)
supports the four clients and their shared runtime. The dossier's existing source
disclosure preserves the limitations on Cloud, sync and AI. Its Cosmic Nexus
interpretation now describes a shared foundation rather than the previous campus;
it explicitly does not present the connections as live data flow.

## Concrete skill application

| Skill                            | Decision in this pass                                                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `design-taste-frontend`          | Calm, compact typography within the existing cosmic sheet. A single violet rule groups the system; no repeated cards or competing controls. The user's blue-violet universe remains authoritative.                             |
| `redesign-existing-projects`     | Improve the existing dossier rather than replace its layout. Remove the outdated sail/campus explanation only in the Cosmic Nexus variant.                                                                                     |
| `living-atlas-experience-design` | Shared TypeScript semantics connect physical discovery, Canvas names and readable DOM. All four app roles remain available independently of camera LOD.                                                                        |
| `vercel-react-best-practices`    | Import only static data, not a Three.js component. No React animation state, listeners, timers or additional runtime dependency are introduced by the dossier.                                                                 |
| `web-design-guidelines`          | Fresh guideline source reviewed on 2026-10-15. Native section/heading/definition-list semantics, text roles, 14px minimum app typography, wrapping and existing visible focus. No artificial Tab stops or app-launch controls. |
| `living-atlas-world-qa`          | New tests inspect actual sprite glyph bounds as well as DOM, explicit source limits and the no-WebGL path. Art judgment remains separate from technical results.                                                               |

Guideline source: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Verification contract

`tests/cosmos-semantic.spec.ts` adds three cases:

- At 1440 and 390 px, verify all four names and their distinct roles, the common
  core, actual 14px text, complete rows within the scrolling sheet, no horizontal
  overflow, pinned evidence and preserved Escape/focus behavior.
- In both cases, physically enter the detail view and measure the five rendered
  label footprints through scene diagnostics. Require at least 14px total footprint height, an
  8px viewport margin, no mutual overlap and no DOM-control/heading collision.
  The bounded follow-up also requires each projected name and role font size to
  reach 14px; that strengthened assertion awaits the final run.
- With WebGL unavailable, verify the full core/four-client explanation remains in
  the dossier and the seven-project text alternative is available.

The existing mobile regression now checks the four names in order rather than a
single prose sentence. Its camera, focus, touch-target, accessibility and layout
assertions remain unchanged. Existing physical transform, history, pixel and touch
tests are owned by the integration pass and retain their meaningful thresholds.

## Review status

**Final affected-suite checkpoint: PASS, 9/9 in 51.9 seconds, one worker,
no retries.** The lead inspected `.verification/semantic-nexus/final-nexus.log`
after the Corona/workspace polish and the targeted Main-label clearance fix.
Both projected name and role font assertions now pass at 1440/390, as do the
actual shell-displacement and rendered relation-endpoint assertions. The lead
opened the final desktop/mobile detail captures and confirmed that the upper
workspace label no longer intersects its open lid. The earlier checkpoint below
documents the independent review that led to these bounded corrections.

**First targeted checkpoint: PASS, 9/9 in 53.5 seconds, one worker.** The lead's
`.verification/semantic-nexus/targeted.log` records all three new semantic cases and
the six existing Cosmic cases passing. This includes actual Canvas pixels,
four-client transforms, physical camera/history, wheel/pan/orbit, mobile gestures,
keyboard/reduced motion, accessibility and WebGL fallback. This result precedes
the one bounded Corona/workspace-shell art adjustment; final integration and CI
are still pending.

**Independent image review:** the actual `nexus-dossier-1440.png`,
`nexus-dossier-390.png`, `cosmos-nexus-detail-1440.png` and
`cosmos-nexus-detail-390.png` from that targeted run were opened and inspected.
The four app names and roles are readable in both dossiers. Their scrolling
surface contains complete text without horizontal clipping. The detail views
clearly identify one shared core and four connected clients. Code-client shell
separation reads more strongly than the workspace shells in this first image
checkpoint; the lead's bounded art adjustment addresses that imbalance.

The first 14px label assertion concerns the **whole two-line footprint**, not each
text line's font size. At that checkpoint, names use approximately 15.2 CSS pixels
and secondary roles 12.3 CSS pixels. This review identified that distinction: the
lead's bounded follow-up increases the role font and adds projected name/role font
sizes to the scene diagnostic. The updated test now checks both text lines at
14px, as well as the footprint and collision gates; execution of this stronger
version is pending. DOM app names and roles already have separately checked 14px
font sizes.

**Code review:** no new P0/P1 focus, semantic HTML, lifecycle or demand-rendering
defect found in this scope. Label maps and the star texture have explicit cleanup;
the connection BufferGeometry is disposed. Declarative meshes/materials retain
R3F ownership. Interpolation snaps to exact 0/1 endpoints, and invalidation stops
there; no new RAF or React state updates per frame were introduced. The existing
Canvas still uses demand/never scheduling. These are code findings, not a measured
FPS, memory-usage or final performance-budget claim.
