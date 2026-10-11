# G2-C0 performance investigation

Date: 2026-10-11. Base: `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Agent A, isolated worktree `F:/Coding/atlas-g2c-performance`, branch
`codex/g2c-performance`. No runtime dependency, engine, router or rendering
contract changed. The Lead subsequently integrated the selected patch; the
[final integrated measurement](INTEGRATED_G2C_PERFORMANCE.md) records both
complete worlds against an immutable production-build manifest. The causal
same-source experiment below remains separate from that expanded feature set.

## Result

The selected optimization is native `content-visibility: auto` on the existing
offscreen **legacy** prerendered chapters, with an estimated intrinsic block
size. Origin's real Canvas, scene, materials, geometry, DPR and input behavior
are unchanged. Below-fold semantic HTML is retained and rendered as it enters
the viewport. No 3D scene is hidden, disabled or replaced during measurement.

In three comparable runs, style/layout work falls **53%**, and the physical
Origin renderer becomes ready **1.985 seconds earlier**. Camera movement reaches
its recorded rest pose **2.396 seconds earlier**. This is a measured startup
improvement, **not** a Core Web Vitals pass. Lighthouse TBT remains noisy and its
median is worse; mobile field performance remains unverified.

| Metric                                                         | Base median [min–max]     | Selected patch median [min–max] |
| -------------------------------------------------------------- | ------------------------- | ------------------------------- |
| Lighthouse FCP                                                 | 4,236 ms [4,231–4,253]    | 4,233 ms [4,225–4,239]          |
| Lighthouse LCP                                                 | 4,415 ms [4,407–4,438]    | 4,494 ms [4,409–4,512]          |
| Lighthouse TBT                                                 | 1,926 ms [1,919–2,425]    | 2,425 ms [2,035–2,708]          |
| Lighthouse CLS                                                 | 0 [0–0.0146]              | 0.0146 [0.0146–0.0146]          |
| Lighthouse score                                               | 45 [44–45]                | 44 [43–45]                      |
| Lighthouse style/layout                                        | 1,539 ms [1,414–1,630]    | 717 ms [702–897]                |
| Render-ready after a real frame, CDP                           | 12,085 ms [11,855–12,605] | 10,101 ms [10,033–10,264]       |
| First successful camera input → recorded rest, from navigation | 14,940 ms [14,274–15,169] | 12,544 ms [12,508–12,648]       |
| Input → recorded rest                                          | 2,544 ms [2,399–2,840]    | 2,427 ms [2,311–2,461]          |

Camera timing deliberately includes the authored CameraControls easing and
SwiftShader rendering; it is **not INP**, input acknowledgement time or FPS.
Render-ready is the existing post-render contract observed with a
MutationObserver. Screenshots subsequently verify actual composited WebGL
pixels after camera movement. It is an estimate of the first visible 3D frame,
**not** an independently measured GPU presentation timestamp. All six measured
before/after captures exceed unchanged G1 limits (>35 lit pixels, >6 colors),
with 840–843 lit pixels and 67–69 colors after masking DOM overlays.

The G2-B single sample (33/100, LCP 10.9 s) is historical context, not the paired
baseline. This investigation uses the same pinned application SHA on both
sides. Lighthouse LCP observes DOM content and does not measure Canvas readiness.
Its 4.4-second LCP must never be described as the 3D world loading in 4.4 seconds.

## Method and reproduction

Node 26.3.1, pinned project Playwright 1.64.0, Chromium 156.0.8078.4 headless on
Windows, ANGLE SwiftShader. Lighthouse 13.5.0, default mobile **simulated**
network/CPU settings. Every run uses a new browser, cold cache, identical static
HTTP server and unchanged Origin route. `summary.json` stores complete settings;
compressed LHR, DevTools network and Chrome Trace artifacts are retained for
each Lighthouse run. Tests run separately from measurement batches. Other
agents share the host, so CPU contention remains a limitation; medians and
min/max are reported instead of a single best run.

`readiness.mjs` is a separate **actual CDP throttling** experiment: 390×844,
DPR 1.75, 4× CPU slowdown, 150 ms latency, 1.6 Mbps download, 750 Kbps upload.
It observes long tasks, context/shader calls, the actual scene-ready marker and
a successful ArrowRight camera pose change. These observations are not mixed
into Lighthouse's simulated metrics. Instrumentation has small overhead and
is identical in before/after samples.

```powershell
npm ci --ignore-scripts
npm run build
# Separate terminals, only these isolated ports:
node scripts/perf/serve.mjs dist 4181 identity
node scripts/perf/serve.mjs dist 4182 gzip
# Install Lighthouse 13.5.0 in a temporary directory, not package.json.
$env:LIGHTHOUSE_MODULE = '<temporary>/node_modules/lighthouse/core/index.js'
node scripts/perf/measure.mjs 'http://127.0.0.1:4181/?atlas=preview' sample-identity 3
node scripts/perf/readiness.mjs 'http://127.0.0.1:4182/?atlas=preview' sample-gzip 3
node scripts/perf/summarize.mjs
npx playwright test tests/portfolio.spec.ts --config scripts/perf/playwright.config.ts
```

Restart the static server after rebuilding: it caches files in memory. Do not
run simultaneous performance browsers, builds or Playwright suites on this
host. The scripts write uniquely named directories and do not change production
state. Open any decompressed `*.trace.json.gz` in Chrome's Performance panel.

## HTTP compression: proven bytes, blocked browser comparison

The identical Node server serves identity on 4181 and gzip on 4182, both
`Cache-Control: no-store`. Direct `curl.exe -I -H 'Accept-Encoding: gzip'` confirms
`Content-Encoding: gzip` and compressed Content-Length. The selected build has:

| Resource                  | Identity bytes | Gzip bytes (Node default level) |
| ------------------------- | -------------: | ------------------------------: |
| Prerendered HTML          |        144,814 |                          28,808 |
| All currently initial CSS |        127,001 |                          29,660 |
| Entry JS                  |        223,632 |                          69,488 |
| Shared Three/R3F JS       |        862,867 |                         227,052 |

The browser transport in this environment rewrites compressed responses:
DevTools records `X-Content-Encoding-Over-Network: gzip`, no Content-Encoding,
and decoded-sized transfers. For example the gzip entry response is 69,488 bytes
at the server but ~224 kB in the browser trace. Three gzip baseline Lighthouse
runs confirm there is consequently **no valid browser compression speedup** to
claim here. No transport or approval boundary was bypassed. Compression size
savings are real; its effect on a real mobile network requires a direct browser
or production-like staging server outside this normalizing transport.

## Bottlenecks and experiments

1. **Legacy prerender layout before preview mount:** 1,857 elements are styled
   before React replaces them with the requested experience. A trace contains
   a ~301 ms unthrottled Layout task; simulated total style/layout is ~1.5 s.
   The selected CSS addresses this cause without removing fallback content.
2. **React startup and long tasks:** the longest simulated task in baseline is
   ~1.7–2.2 s, attributed to the entry scheduler. Legacy replacement, DOM
   creation/style work and renderer startup share the main thread. TBT remains
   unresolved, with raw long-task entries in each `summary.json`.
3. **Three/R3F download:** ~863 kB decoded/~227 kB gzip, followed by Canvas and
   the requested world. This dominates the physically throttled raw transfer.
   Main-thread parse/compile is only ~3 ms in the Lighthouse audit; background
   parsing/streaming is separately summarized, so this number does not mean
   parsing is free. `comparison.json` reports both, plus decoded JS/download
   bytes and script evaluation.
4. **WebGL startup:** total capability-probe plus renderer context creation is
   ~15–19 ms in median CDP samples; synchronous shader/program calls ~2–3 ms.
   Those JavaScript wrappers do not capture asynchronous GPU work. Removing
   the capability probe would not address the measured dominant problem.
5. **Fonts/CSS:** initial HTML still pulls Manrope, JetBrains Mono and Caveat,
   with all legacy styles. Caveat is unnecessary for the preview. A dedicated
   static preview entry can eventually separate its HTML/CSS/font path while
   preserving the classic no-JS portfolio. This is a follow-up, not claimed done.
6. **Aggressive parallel preload rejected:** three runs improve median TBT to
   993 ms and render-ready to 11,071 ms, but regress FCP to 6,705 ms and LCP to
   9,351 ms by competing with the DOM. A double-rAF variant is also rejected:
   FCP varies 4,068–6,788 ms, LCP ~9,543 ms. Neither patch should be integrated.
7. **Honest static spatial preview evaluated:** an authored, local still from
   the same camera could provide early context, clearly labeled until real GL
   readiness. It must retain the real frame/input metrics. It is deferred until
   a separate preview HTML path can avoid loading both a legacy hero and a
   duplicate bitmap; no replacement of actual 3D occurred in these tests.

## Proposed G2-D budget

These are regression budgets for this repeatable lab, **not mobile field SLOs**:

- Same Origin baseline setup, at least three runs: median FCP ≤4.5 s, LCP ≤4.8 s,
  render-ready ≤11.0 s, first successful camera rest ≤13.5 s, CLS <0.1.
- TBT target ≤2.0 s and no startup task >1 s; **currently missed**, investigate
  startup task subdivision before any release recommendation.
- No growth of the existing shared renderer beyond ~230 kB gzip without a
  measured reason; initial world-specific code ≤20 kB gzip. No extra font or
  textures merely to mask slow loading. Report both actual and compressed bytes.
- Demand rendering at rest, no permanent animation timer, hidden-tab rendering
  stopped, same G1 actual-frame/pixel and camera/history gates.
- Measure a real midrange Android device and iOS Safari before defining FPS,
  thermal, energy, INP or field-CWV targets. Compression must be tested through
  a direct transport. These remain **unverified**, not failed browser tests.

The integrated Observatory build needs a final three-run regression sample;
scene complexity and its dossiers must not silently inherit the Origin budget.

## Integration and evidence index

- **Selected:** `content-visibility.patch` (only `src/styles.css`).
- **Rejected:** `parallel-preload.patch`, `deferred-preload.patch`.
- Baseline: `baseline-identity/`, `baseline-gzip/`.
- Selected after: `containment-identity/`, `containment-gzip/`.
- Counterexamples: `preload-identity/`, `preload-gzip/`, `deferred-identity/`,
  `deferred-gzip/`.
- Machine-readable comparison: `comparison.json`; asset inventory:
  `asset-sizes.json`. PNGs are actual Canvas captures with overlays deliberately
  masked for pixel evidence; they are not presentation screenshots.
- Isolated regression: the original 13 `portfolio.spec.ts` tests pass with zero
  retries, including No-JS, mobile anchors, GSAP chapters, all five widths and
  Axe. No assertion or screenshot threshold was changed.

Skills applied: installed Vercel React rules for dynamic imports, resource
hints and preload; World QA performance/pixel/claim separation; freshly fetched
Vercel Web Interface Guidelines (performance, offscreen content, fonts,
animation, native anchors). Generic Next/RSC prescriptions were not transplanted
into this Vite application. Final integration, full G0/G1/G2 regression and CI
remain Lead responsibilities. No release, main merge or G3 approval is implied.
