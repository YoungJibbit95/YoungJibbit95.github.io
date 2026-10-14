# Galactic Atlas: mobile UI and accessibility

Agent B works only on the existing Cosmic review at
`/atlas/observatory/?cosmos=preview`. Starting HEAD:
`e21dd2a9deb7d629c096d16371711d5f09584dd8`. No changes to SceneDirector,
camera/history, geometry, data models, dependencies, Origin or ordinary Atlas.

## Design checkpoint

Reading this as an explorable developer portfolio with a calm, navy/violet
atmosphere. The existing Manrope typography, native CSS, square control shapes
and Nexus discovery remain. UI density decreases; camera motion remains causal.
Taste settings for this bounded UI refinement: variance 6, motion 3, density 2.

The previous real 390 px arrival image had three separate bottom rows: camera,
discovery and two secondary actions. Their duplicated overview functions and
large heading competed with the universe.

Implemented corrections:

1. One discovery action beside a compact Projects trigger; the existing camera
   controls occupy the second row. The duplicate “Alle einrahmen” action moves
   inside the explorer. The discovery, overview, zoom and Back functions remain.
2. Smaller desktop and mobile headline, leaving more space for spatial objects.
3. Responsive compact layout through 900 px, including the requested 768 px
   tablet check. Tablet controls are bounded to 30 rem and aligned right; its
   world label moves to the top, clearing Adventura. Bottom and side spacing respect CSS safe-area insets. Controls
   remain at least 44 × 44 CSS pixels. No tiny icon-only overflow menu is added.
4. A taller, scrollable nonmodal panel uses 14 px body text and retains its visible
   close button. Selecting a new result reveals and focuses its dossier heading;
   it does not scroll the document or alter navigation state. Escape restores
   the trigger. Covered camera controls use `visibility: hidden`, which removes
   them from hit testing and sequential focus.
5. The explorer exposes a native anchor to the complete seven-project text list.
   Bar and panel declare `data-cosmos-occluder` for the lead's projected label
   placement. Native project links, filter controls and actual source claims stay.

## Concrete skill effects

| Local skill                      | Applied result                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `design-taste-frontend`          | Audited existing frames before editing; reduced competing headline and repeated overview action; preserved the explicitly requested violet palette.                      |
| `redesign-existing-projects`     | Targeted CSS/component changes in the existing stack, with clear Primary/Secondary hierarchy and no framework or asset replacement.                                      |
| `living-atlas-experience-design` | The central scene retains gesture space; navigation, source-backed dossiers and native links preserve the DOM counterpart of the spatial exploration.                    |
| `vercel-react-best-practices`    | Discrete disclosure state and project-ID effect dependencies; refs for focus/scroll; no camera-frame React state, animation loop or added runtime module.                |
| `web-design-guidelines`          | Current upstream guidelines fetched on 14 October 2026; visible focus, 44 px targets, native anchors, safe areas, 16 px input font and contained sheet scrolling.        |
| `living-atlas-world-qa`          | Dedicated tests measure actual control bounds and focus hit targets at 320/390/768 px; real browser screenshots and Axe verification are required before reporting PASS. |

Current guideline source:
[Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).
Project facts and the user's narrow Cosmic scope override unrelated marketing
examples, fake-name advice, image generation and palette substitution.

## Validation

PASS on the coordinated integrated working checkpoint, 14 October 2026:

- `npm run build`: TypeScript, Vite and all three prerendered entries passed.
  The existing shared Three.js chunk-size warning remains.
- `node node_modules/@playwright/test/cli.js test tests/cosmos-mobile.spec.ts --workers=1 --retries=0`:
  **3 passed in 11.1 s**, no retries, after the final tablet CSS adjustment.
- 320 × 640, 390 × 844 and 768 × 1024: all six initial controls at least 44 × 44
  CSS pixels, no mutual overlap or viewport clipping; two-row dock within the
  116 px limit (112 px in these zero-safe-inset browser viewports).
- Every viewport: panel entirely visible, dossier name correctly revealed and
  focused after selecting the native project link, body text at least 14 px,
  ten real Tab moves to visible unobscured hit targets, covered camera controls
  excluded, Escape restores trigger, native text-list link opens all seven
  original project articles.
- 390 px: zero serious/critical Axe violations with the dossier open.
- Existing pixel and exact-history assertions were not edited.

The first run exposed an incorrect name in the newly written test locator:
the verified full project name is “Nexus Ecosystem”, not “Nexus”. Only that test
locator was corrected. A subsequent three-case run passed in 11.0 s, and the
final run above followed the small tablet refinement. This was not an application
failure or an assertion relaxation.

Real integrated frames saved and inspected:

| Viewport   | Arrival                                      | Dossier                                           |
| ---------- | -------------------------------------------- | ------------------------------------------------- |
| 320 × 640  | [Arrival](evidence/mobile/cosmos-ui-320.png) | [Dossier](evidence/mobile/cosmos-dossier-320.png) |
| 390 × 844  | [Arrival](evidence/mobile/cosmos-ui-390.png) | [Dossier](evidence/mobile/cosmos-dossier-390.png) |
| 768 × 1024 | [Arrival](evidence/mobile/cosmos-ui-768.png) | [Dossier](evidence/mobile/cosmos-dossier-768.png) |

Visual finding: the 320/390 compositions expose substantially more uninterrupted
Canvas; the narrower tablet dock no longer looks like a full-width footer, and
the world label no longer overlaps Adventura. Text and touch controls are clear.
The existing focusProject navigation intentionally scrolls the stage into view;
the new dossier focus does not add page scrolling. Main scene label spacing and
galactic depth still require the lead/art review on the final integrated scene.
The lead subsequently refreshed all six linked UI frames from the full Root
suite on integrated code checkpoint `4bf2ece`, after the final nebula polish,
and inspected them again. They supplement the six final Macro/Approach/Detail
images; neither set substitutes for user visual approval.

Browser test runner and its preview server exited; no process was left occupying
port 4173. No full suite or performance job was started by this agent. Integrated
technical acceptance belongs to the lead's final checks and CI report.
