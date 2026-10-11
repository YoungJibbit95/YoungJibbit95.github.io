# G2-D design lab

These independent, interactive R3F documents are proposals for a human design
checkpoint. They are not production scenes and do not replace the shared Atlas
Canvas, CameraRig, SceneDirector or history. No visual direction has approval.

Run the existing root Vite dev server, then open:

- `/experiments/g2d-design/direction-a/index.html`
- `/experiments/g2d-design/direction-b/index.html`
- `/experiments/g2d-design/direction-c/index.html`

For the checked-in capture scripts, start a server for each assigned port from
the repository root: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port
3011 --strictPort`, and repeat for 3012 and 3013. A uses 3011, B 3012, C and the
mobile interaction lab use 3013. These are local experiments; the production
build does not import or ship them.

Run artist captures sequentially, followed by
`node experiments/g2d-design/qa/check.mjs`. Do not benchmark software WebGL while
multiple capture browsers run. The static screenshot comparison is at
`/docs/experience/g2d/REVIEW.html`; `capture-review.mjs` checks all 18 linked
overview/discovery/Origin images and renders the two side-by-side review sheets.

Use installed project dependencies, real project source data, one Canvas and
CameraControls per document, demand rendering and actual geometry responses.
Every direction owns its source/CSS/capture script and exports a small read-only
diagnostic bridge where possible: world, selection, camera/target and current
renderer calls/triangles/resources/frame. No test-only rendering shortcut.

Capture 1440×900 and 390×844 after painted geometry and settled camera, including
overview, meaningful discovery and Origin. Keep DOM controls in art captures;
use separate masked captures for pixel proof if required. Do not claim visual
approval from automated metrics or a production performance result from a dev
prototype.
