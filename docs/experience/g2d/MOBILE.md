# G2-D: Mobile Experience, checkpoint before the direction decision

Agent D worked only in `experiments/g2d-design/mobile/`, this report, and
`docs/experience/evidence/g2d/mobile/`. No production scene, camera, history or
router was changed. This is a proposal and a partial prototype review, not mobile
or human art acceptance.

**Lead update after the independent serial run:** E subsequently completed all
nine A/B/C viewport cases and the native component case. Real CDP pinch/drag at
390/768, corrected target sizes, modal inertness/Escape/focus return and Axe now
pass. See [independent QA and disclosed first failures](QA.md). The pending
statuses below preserve D's earlier handoff, not the final checkpoint result.

## Design read and diagnosis

A personal spatial portfolio for curious visitors: one understandable first
encounter, depth beyond it, and deliberate movement to the next project. Native
CSS and the existing React/CameraControls stack are sufficient. Taste dials for
the mobile control proposal: variance 6, motion 3, density 2. Art direction remains
the user's choice; the component provides no visual theme for the worlds.

The actual G2-C 390 px screenshot was inspected. Large introductory copy, separate
orientation controls and the bottom project bar surround seven small objects.
Fit All is valuable for finding a place; it should not be the first impression on
a narrow screen. Nearby architecture should have a legible silhouette and name,
with a second landmark providing depth.

Skills applied: Living Atlas Experience Design (real camera positions and HTML
parity), Taste (explicit design read and reduced density), Redesign (audit existing
screenshots before changing layout), Vercel React (no per-frame React state), and
current Web Interface Guidelines (native controls, safe areas, focus and gesture
alternatives). The guidelines were fetched on 2026-10-11 from
<https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md>.
The project's verified names and evidence override generic skill suggestions.

## Mobile contract for the selected direction

- Entry is a close, composed first stop. The explicit overview command still
  frames the whole world. It must not silently replace history or the user's
  restored camera when they return.
- Reserve approximately the upper 160 px (including the header) and bottom
  110 px at 390 × 844. Keep the named first landmark in the remaining central
  area. Check its complete silhouette, not just its bounding-sphere center.
- Headline plus one short line are enough at entry; collapse introductory copy
  after selection. Do not show an entry pitch and a selected-project dossier
  simultaneously.
- One primary action and a labelled native seven-project select expose all
  destinations. Do not depend on a partially hidden horizontal strip. A closed
  `Ansicht` disclosure contains overview and zoom alternatives.
- Every actionable HTML target is at least 44 × 44 CSS px, including world labels,
  source links and short project names. Viewport-clipped labels must not become
  half-visible focus targets.
- Use `100dvh`, `viewport-fit=cover`, safe-area inset padding and no fixed minimum
  stage height that forces controls below a short viewport. The 768 px portrait
  composition needs its own inspection rather than assuming desktop spacing.
- Full project text opens a native modal dialog: background controls are inert,
  Escape closes, focus returns to the opener, the reader scrolls internally with
  `overscroll-behavior: contain`. A nonmodal alternative is acceptable only when
  it does not cover any focusable controls.
- Touch drag and two-finger pinch change the actual existing camera. Overview,
  zoom buttons and keyboard commands remain equivalent alternatives. Reduced
  motion reaches the same destination with no long flight. Gestures must not
  start over the reading sheet or select.
- No new router, Canvas or camera controller. The production SceneDirector owns
  selection, exact pose and navigation history. Mobile controls emit intents.

## Direction-specific feedback delivered

### A: Aperture Archive

Its entrance-first position is suitable for mobile: `eye [-21, 10.3, 31]`,
`target [-2, 6.1, -1]` in the inspected Observatory source. This is a near entrance
with rooms beyond it, not an all-seven fit. Agent A was told to raise the 38 px
orientation targets to 44 px, use a focus-safe reader, and add safe-area/reader
scrolling rules. The artist acknowledged these changes and was still refining
materials/camera during this checkpoint. Final 390/768 capture and gesture checks
are pending serial independent QA.

### B: Schnittwerk

The actually rendered [390 px entry](../evidence/g2d/mobile/b-entry-390.png) was
inspected. Nexus has useful foreground size; Cerebri and the layered landscape
give clear depth. This materially improves on the small G2-C mobile map.
YJarvis/Adventura labels at the edges are partly clipped and need culling or
complete visible placement. The seven-project register is an explicit way to
reach offscreen projects. The artist separately addressed 44 px targets, safe
areas, register focus, and projected labels. No other artist's design was shared
with B. Its inspected mobile entry pose was `eye [42, 62, 121]`,
`target [-15, 0, -7]`.

### C: Werkstatt nach Mitternacht

The first real C mobile image cropped Nexus at the left while Cerebri took the
center. Its headline occupied roughly 170 px, and the entry question/action panel
another 174 px. Recommended: one clear nearest workbench, reduced headline,
native project select, and collapsed secondary camera controls.

The lead implemented a proposed entry pose `eye [8, 24, 72]`,
`target [-18, 14, 8]` (48° FOV), reduced the mobile entry rail and headline, and
removed the forced 680 px stage minimum. These are concrete prototype changes;
the revised image still needs independent inspection and real touch verification.
The short project strip is hidden on mobile in favor of the select.

## Reusable isolated proposal

[`MobileJourneyShelf.tsx`](../../../experiments/g2d-design/mobile/MobileJourneyShelf.tsx)
contains a compact native select, primary action, collapsed view actions and a
source-backed reader using the existing seven project records. It has callbacks
for `onSelect`, `onPrimary`, `onOverview` and `onZoom`; it imports no 3D runtime and
owns no history. Native `showModal()` supplies actual background inertness, close
focus is explicit, and `onClose` restores the opener. Theme values are only the
component lab's sample palette, to be adapted after direction approval.

The isolated `mobile/index.html` is explicitly labelled **Mobile-Bedienlabor**.
It is a DOM interaction fixture, not a fourth art concept or a fake rendering.
The lead may reuse its pattern after approval; nothing imports it in production.

## Evidence status and exact handoff

- Actual prior G2-C mobile image inspected: **done**.
- Actual initial C mobile image inspected and feedback integrated by lead: **done**.
- Actual B 390 px screenshot captured and inspected: **done**.
- Native CDP touch and 390/768 captures for all three directions: **pending**.
- Component modal/focus/selection browser assertions: **pending**.
- Isolated TypeScript check (`tsc --project .../mobile/tsconfig.json --noEmit`):
  **passed**, exit 0. This does not imply browser success.
- Real Android/iOS hardware, mobile Safari, notch/orientation/virtual keyboard
  and screen reader acceptance: **not tested**.

The first runner stalled after B's painted 390 px entry during concurrent
software-WebGL captures. It produced no gesture PASS. The lead requested serial
QA. Only this runner's process tree was stopped: Node 76468 and its headless
Chromium descendants 91840, 10668, 93424, 93540. No server was started or stopped by
D. A/B/C ports 3011/3012/3013 remain their owners' responsibility.

Reproducible script, after artists finish their captures:

```powershell
node node_modules/typescript/bin/tsc --project experiments/g2d-design/mobile/tsconfig.json --noEmit
node experiments/g2d-design/mobile/check.mjs a b c
```

The script captures entry/touch images at 390 × 844 and 768 × 1024, samples real
camera position/target and renderer calls/triangles, asserts actual pinch-distance
and drag-position changes, records undersized visible HTML targets, and exercises
the separate component's selection, native modal, Escape, focus and view actions.
Touch dispatches have a 10 s bound. A timeout is a failed verification attempt,
never a device failure diagnosis or a PASS. Run serially, preserve failures, and
inspect the screenshots before changing this report's pending statuses.
