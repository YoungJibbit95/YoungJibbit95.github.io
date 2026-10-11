# G2-A actual browser evidence

Captured locally on Windows, Playwright Chromium 156 / ANGLE SwiftShader. These are software-rendered WebGL browser screenshots, not design mockups. Static captures use `prefers-reduced-motion: reduce`, the actual DOM controls, and the production build. Mobile widths are emulated, not physical devices.

- [1440 quiet](g2a-origin-1440-quiet.png), [opened body](g2a-origin-1440-open.png), [second edge / horizon](g2a-origin-1440-horizon.png): same camera, before and after the causal interaction.
- [390 quiet](g2a-origin-390.png), [390 signal](g2a-origin-390-signal.png): compact physical camera. Visible focus outline in the signal image comes from keyboard Enter in the test.
- [320](g2a-origin-320.png), [768](g2a-origin-768.png), [1440](g2a-origin-1440.png), [1920](g2a-origin-1920.png), plus matching `-signal` captures: responsive review.
- [Lenis raw comparison](lenis-result.json): eight integration cases; measured adapter callbacks are not render FPS.

Reproduce screenshots with `npm run build` followed by `npx playwright test tests/origin.spec.ts --workers=1`. The normal PR artifact retains all browser screenshots and failure traces in `g1-preview-evidence` (the inherited artifact name includes G2 files). The separate repeated world-switch output does not clear those images.

The model, physical pose, raycast, touch and pixel assertions are in tests; still images alone do not prove interactivity. No post-capture retouching was applied.
