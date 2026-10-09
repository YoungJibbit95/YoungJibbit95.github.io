# G0 camera spike — isolated, non-production

This is a technical proof, **not** a new portfolio route, visual mockup of nine worlds, or a deployed website. The existing production App/HTML/CSS and release pipeline are not touched. The sibling `docs/experience` directory contains G0 audit and storyboards.

## Versions and verification

Target: React 19.3.0, R3F **9.8.1**, Drei 10.7.0, Three 0.179.1, Camera Controls 3.1.2. R3F 9.8.x is important because 9.7.x excluded React 19.3. Versions are intended exact, but **registry-resolution/lockfile/build have not been verified in this environment** (outbound npm blocked). No lockfile has been fabricated.

With network-capable Node >=22.12:

```sh
cd experiments/camera-spike
npm install --package-lock=true
npm ci
npm run test:unit
npm run build
npm run dev
# Browser: http://127.0.0.1:5174
npm run test:e2e  # run npm run build first; Playwright Chromium must be installed
```

Commit `package-lock.json` only after a successful resolver check. Then use `npm ci` exclusively in CI.

## Manual camera checklist

1. On desktop, drag with left button: the **actual Three camera truck** moves around the 3D anchors. Drag with right button to orbit. Use scroll to dolly continuously; zoom is constrained between 3 and 50 world units. On touch, one finger trucks; two fingers pinch/dolly and truck.
2. Choose **Kern**, **Signal**, or **Verbindung** using DOM buttons or 3D mesh clicks. The full position+target pose changes as the camera flies to the anchor.
3. Choose **Zurück** after focus to return to prior camera position/target/orientation even when that pose was established by dragging and dollying.
4. Interrupt a flight with drag, wheel, or touch; the transition must stop without a stale completion overwriting new input. Try another point immediately.
5. Click **Kamerafahrten reduzieren** or set OS reduced-motion. Focus jumps without a motion tunnel. Use **Übersicht** to reset.
6. Disable WebGL2 or JavaScript and ensure the fallback headings, links, and location list (where JavaScript exists) remain accessible. The independent spike deliberately only includes a small neutral content sample.

## What has not been proved

Real-browser/WebGL test, mobile device/touch gesture measurement, current live-branch merge integration, long-run context-loss recovery, production SSR/hydration, performance budgets, full selection/URL history. These belong to G1 and G2 or remain Gate G0 blockers until a real test run is available.
