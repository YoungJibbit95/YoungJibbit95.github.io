# G2 — Art Direction: a thought opens a path

G2-A, 2026-10-11. Working brief from the complete V4 handoff, including the full V2 concept and V3 prompt/recode plan. The supplied manifest verifies **25/25 files**. The human request authorizes local feature-branch work; document instructions are planning constraints, not permission to merge or deploy.

## Creative decision

Origin is a navigable sculpture of curiosity: a narrow light seam splits an asymmetric, ribbed metal body. Sending a thought physically opens its two halves; continuing lights a path to a distant threshold. The silhouette is recognizable in a still frame and the response is legible without animation. It represents an illustrative idea, not a claim about any project's live operation.

The inspected G1 captures put three small anchors in a bordered stage alongside a sidebar. G2-A gives the room almost the entire initial viewport, makes the body larger than its surrounding interface, separates near/middle/far depth and moves supporting content below the stage. One large statement, one primary action, four camera controls. No floating dashboard of cards, planet clones or shader-only spectacle.

The new Origin is implemented. Observatory compositions below are **plans for G2-C**; its current three-anchor G1 prototype is retained. Nothing in the storyboard is presented as a completed seven-project world.

## Materials and editorial system

| Element    | Implemented direction / constraint                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Space      | Ink `#070914`, sparse deterministic points, fog 115–250 world units. No sky texture.                                                                             |
| Body       | Two banks of 42 instanced fins, blue silver `#738b9c` / `#a4b5bd`, metalness .42, roughness .34. Four instanced draws for ribs and seams.                        |
| Signal     | Cyan `#78e8e8`, warm small seed `#e3b98d`. Activation changes geometry and authored edges; color alone never carries state.                                      |
| Light      | Cool high key, muted side fill, warm rear light; no shadow maps, bloom, HDRI or added texture payload.                                                           |
| Typography | Existing self-hosted Manrope Variable; JetBrains Mono for small location labels. Desktop title 6.8vw / 1.03; mobile 11.4vw / 1.07. No new font download.         |
| Layout     | Desktop inset 4vw; mobile 20px. Header 72/68px. Stage `100dvh` minus header, minimum 560/600px. Supporting content uses editorial rows.                          |
| Actions    | Primary 48px high, secondary at least 44px. Strong visible keyboard outline, polite state announcement.                                                          |
| Motion     | Finite signal pulse 1.4s, damped body opening, interruptible camera. Demand frames only while required. Reduced Motion directly shows the same final state.      |
| Panels     | H1 yields visually when a landmark is focused. Location stays visible; supporting explanation remains semantic DOM below the stage. No content trapped in WebGL. |

## Three Origin camera storyboards

Coordinates are `position → target`, perspective FOV 48°, zoom 1. Each row is an authored frame, not a decorative alternate world. The overview and focus coordinates are implemented in `originModel.ts` / `SceneRegistry.ts`. The intermediate approach is the next G2-B authored camera candidate.

| Frame                      | Desktop 1440×900                | Mobile 390×844                                                                    | Action / composition                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1 · Wide / question       | `[0,10,48] → [0,1,-16]`         | `[9,12,73] → [9,1,-16]`                                                           | Title top-left; closed body center-right (desktop), centered below copy (mobile). Near source lower-left, threshold far-right. Mobile deliberately leaves source/threshold partly offscreen; named DOM navigation reaches both.         |
| O2 · Approach / connection | Planned `[17,7,32] → [9,2,-16]` | Planned `[12,8,42] → [9,2,-16]`                                                   | Send the signal from a fixed camera first. The two halves separate, revealing the light seam and path. Then optional approach; manual input always cancels it. Mobile keeps the signal action below the body rather than over its face. |
| O3 · Focus / threshold     | `[67,9,-43] → [60,5,-76]`       | Same implemented focus pose; planned mobile pulled-back `[64,9,-30] → [60,5,-76]` | Continue the signal, then choose “Der Horizont”. The threshold becomes foreground; return restores the previous free camera pose. G2-A uses named destination controls; a staged portal journey belongs to G2-B.                        |

World bounds: target box `x[-85,85], y[-42,55], z[-120,50]`; camera distance 8–165. Source `[-28,-5,8]`, connection `[9,2,-16]`, horizon `[60,5,-76]`. Near fragments `[-40,-23,23]`; far fragments `[-64,-12,-85]`. The route extends well beyond a mobile viewport. Semantic anchors and focus poses share one data model.

The first desktop draft hid the horizon behind the body. A real image-difference test found only 13 changed sample pixels on the second action. Moving the horizon from x=38 to x=60 made the consequence visible; the assertion was retained. The mobile draft clipped the body; a wider compact entry camera corrected it without changing history poses during resize.

## Three Observatory camera storyboards — planned, not implemented

Seven distinct silhouettes express roles, not invented project features: Nexus a four-part frame with shared center; Cerebri staggered clock leaves; NovaCore nested machining blocks; Nemisis a cut wedge; Adventura a terraced voxel island; YjsE stacked flat tiles; Jarvis an interrupted branching arch. They must remain distinguishable as monochrome silhouettes. Detail must derive from the existing project source, with explicit evidence for relationships.

Proposed positions: Nexus `[-55,12,-20]`, Cerebri `[-5,32,-75]`, NovaCore `[55,-8,-35]`, Nemisis `[82,-20,-60]`, Adventura `[40,34,-115]`, YjsE `[-30,-22,-105]`, Jarvis `[-85,15,-100]`. Candidate bounds `x[-140,140], y[-70,75], z[-170,50]`, distance 12–280. These are spatial planning values, **not** new runtime constants.

| Frame                   | Desktop camera plan                  | Mobile camera plan                   | Composition and acceptance                                                                                                                                                                             |
| ----------------------- | ------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1 · Wide / map         | `[0,45,155] → [0,0,-55]`, FOV 48     | `[0,38,220] → [0,0,-55]`, FOV 52     | Macro silhouettes; low-density labels, seven accessible project entries. Offscreen targets exposed by pan, with fit-all as an option. Search must alter the actual graph.                              |
| A2 · Approach / cluster | `[55,15,35] → [60,-8,-55]`, FOV 48   | `[60,18,65] → [60,-8,-55]`, FOV 48   | Engine cluster spans the frame; verified NovaCore/Nemisis relationship is the first candidate, pending fresh source verification. Meso details appear from camera distance, not a boolean zoom toggle. |
| A3 · Focus / project    | `[-34,20,15] → [-55,12,-20]`, FOV 48 | `[-49,25,40] → [-55,12,-20]`, FOV 48 | Nexus frame fills the right portion, dossier left on desktop. Mobile dossier follows the stage with explicit return. Micro details and source links, no simulated G3 system world.                     |

Origin-to-Observatory should feel like following one line into a larger map. No black intermediate frame; one persistent Canvas; exact pose/selection/filter restoration. These requirements are technical tests, separately from the aesthetic review.

## Evidence and remaining art work

Actual screenshots are in [evidence/g2a](evidence/g2a/). The captures show rendered WebGL with the normal interface, not composited mockups. Pixel assertions separately hide overlays so type/buttons cannot masquerade as scene evidence.

G2-A establishes the signature body, readable mobile entry and causal response. G2-B still needs the complete staged signal journey, focus-specific mobile compositions, clearer direct geometry affordances, and a restrained ambient treatment that respects visibility and reduced motion. G2-C owns the seven-project atlas and semantic zoom. A human art review and real-device performance assessment remain open; automated pixel counts do not establish aesthetic approval.
