# Integrated G2-C performance verification

**Result: measured startup improvement retained; overall performance remains
PARTIAL.** Both actual worlds render and accept physical camera input under
mobile CDP throttling. No world was disabled, hidden, simplified for the test or
replaced with a still image. These are laboratory results, not smartphone field
data, INP or a release recommendation.

## Build and isolation

The Lead's stable production build was copied to an immutable isolated directory
before measurement. [SHA256 manifest](integrated-build-manifest.json) records all
28 output files. The build contains the integrated seven-project Observatory,
Explorer UI, source data, history/camera integration and the selected offscreen
legacy layout optimization. It was built from the uncommitted integration based
on `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`; the manifest identifies the tested
bundle independently of the later final feature commit. Lead owns final CI.

After this measurement, Lead fixed one mobile keyboard-overlap issue in CSS:
camera controls become hidden while the Explorer is expanded. Cold-start tests
use the closed Explorer, and no renderer, loader or camera code changed in that
follow-up. Nevertheless, these artifacts identify the measured snapshot and
**do not claim byte identity with the final rebuilt CSS/bundle**. The final
post-fix build and complete functional/CI checks are recorded by Lead separately.

Agent E completed all 16 new QA checks before this batch. Lead explicitly paused
builds and browser suites during all **12 measurement runs**: each world received
three Lighthouse runs and three separate real CDP-throttled readiness/input
runs. New browser per run; same ports, flags, simulated mobile settings and
actual CDP settings as [G2-C0](G2_C0_PERFORMANCE.md). Only Origin's URL changes to
`?atlas=preview&world=observatory` for Observatory; its real scene-ready marker is
required. All six readiness runs have zero page errors and pass the unchanged
G1 composited-pixel limits.

## Integrated measurements

Values are medians [minimum–maximum], three samples per cell.

| Metric                                                             | Origin                    | Observatory               |
| ------------------------------------------------------------------ | ------------------------- | ------------------------- |
| Lighthouse FCP                                                     | 4,459 ms [4,453–4,473]    | 4,453 ms [4,451–4,454]    |
| Lighthouse LCP                                                     | 4,874 ms [4,860–4,880]    | 5,282 ms [5,263–5,315]    |
| Lighthouse TBT                                                     | 2,065 ms [1,937–2,734]    | 905 ms [863–988]          |
| Lighthouse CLS                                                     | 0.0146 [0.0146–0.0146]    | 0.0146 [0.0146–0.0146]    |
| Lighthouse score                                                   | 41 [40–41]                | 47 [46–48]                |
| Longest simulated task                                             | 2,027 ms [1,864–2,682]    | 865 ms [832–927]          |
| Style/layout                                                       | 881 ms [746–972]          | 752 ms [734–761]          |
| Script evaluation                                                  | 2,735 ms [2,672–3,467]    | 2,527 ms [2,461–2,653]    |
| Main-thread parse/compile                                          | 3.22 ms [2.84–3.25]       | 2.64 ms [2.57–3.29]       |
| Background parse/stream tasks, unthrottled trace                   | 61.00 ms [52.48–74.58]    | 54.71 ms [54.24–66.46]    |
| Browser-reported downloads                                         | 1,600,696 bytes           | 1,584,363 bytes           |
| Decoded JavaScript                                                 | 1,224,361 bytes           | 1,208,028 bytes           |
| Actual CDP render-ready after frame                                | 10,139 ms [10,088–10,260] | 10,525 ms [10,143–10,589] |
| First successful camera movement to recorded rest, from navigation | 12,770 ms [12,454–12,860] | 14,411 ms [14,021–14,472] |
| Input to recorded camera rest                                      | 2,480 ms [2,359–2,707]    | 3,871 ms [3,864–3,872]    |
| Context creation total                                             | 15.2 ms [14.3–15.6]       | 17.6 ms [13.9–20.8]       |
| Synchronous shader/program calls                                   | 2.5 ms [2.0–2.6]          | 2.7 ms [2.6–3.4]          |

The frame timestamp is the existing post-render ready signal, with later
composited pixel verification. It is not an independent GPU presentation
timestamp. Camera timing includes authored easing until rest; Observatory uses
a larger physical pan distance. It must not be called input latency or INP.
Synchronous shader/program instrumentation excludes asynchronous GPU execution.
Background and main-thread parse numbers are different measurement scopes and
must not be added as if both were simulated mobile time.

Actual screenshot samples after the keyboard pan contain 839–840 lit pixels and
67–69 color classes in Origin, and 361 pixels / 104–105 classes in Observatory.
DOM overlays, including the Explorer, were masked only for this pixel proof;
WebGL project and cluster labels remain part of the actual scene. Both first
captures were visually inspected. The PNGs are diagnostic Canvas evidence,
not the user-facing art-direction screenshots.

## Interpretation and budgets

The causal comparison remains the same-source, CSS-only pair in G2-C0. Its
53% reduction in style/layout and 1.985-second render-ready improvement are not
recomputed against a different, expanded feature set. The integrated Origin
still reaches the real frame in 10.139 s, close to the CSS-only result of
10.101 s and below the original 12.085 s. The final UI/data integration adds
some DOM/network work: Origin FCP rises ~226 ms and LCP ~380 ms versus the
CSS-only sample. The overall performance gate remains open.

The proposed Origin regression budget was not silently raised: FCP ≤4.5 s,
render-ready ≤11.0 s, camera rest ≤13.5 s and CLS <0.1 pass this lab batch; LCP
≤4.8 s is missed by 74 ms, TBT target ≤2.0 s by 65 ms, and the longest task
target <1 s remains substantially missed. These values do not meet good mobile
field CWV thresholds.

For G2-D, keep the existing Origin regression budgets. Establish a separate
Observatory regression cap from this first integrated baseline: FCP ≤4.5 s,
LCP ≤5.5 s, actual frame ≤11.5 s, successful camera rest ≤15 s, TBT ≤1 s,
CLS <0.1, same three-run conditions. These caps protect against regression;
they are not a production performance acceptance standard. Improve the shared
DOM/font/bootstrap path and shorten long tasks before release. Validate native
touch responsiveness and real GPU behavior on a midrange Android device and
iOS Safari, rather than deriving FPS/INP from software rendering.

Compression remains a transport limitation: server gzip is verified, but this
environment normalizes it before the browser records transfers. No gzip speedup
is claimed. The final build's deterministic Node-gzip sizes are:

| Chunk            | Decoded bytes | Gzip bytes |
| ---------------- | ------------: | ---------: |
| Shared Three/R3F |       862,662 |    226,981 |
| Entry            |       223,662 |     69,492 |
| ExperienceRoot   |        37,824 |     11,857 |
| WorldCanvas      |        56,552 |     14,497 |
| ObservatoryWorld |        11,338 |      4,327 |
| OriginWorld      |        27,671 |      8,382 |

The Origin chunk now includes code previously emitted as a separate Line chunk;
its larger filename-level size is not a threefold growth of the Origin scene.
The renderer and both world-specific bundles stay within the proposed byte
caps. Neither route loads the Legacy App chunk. Full inventory is in
[integrated-asset-sizes.json](integrated-asset-sizes.json).

## Evidence and reproduction

- [Machine-readable medians and spread](comparison.json).
- [Origin raw runs](integrated-origin/summary.json),
  [Origin physical readiness/input](integrated-origin/readiness.json).
- [Observatory raw runs](integrated-observatory/summary.json),
  [Observatory physical readiness/input](integrated-observatory/readiness.json).
- Each directory contains all three `.trace.json.gz`, `.devtools.json.gz` and
  `.lhr.json.gz` files plus three real PNG captures.
- `scripts/perf/snapshot.mjs` creates an immutable build copy and manifest;
  `measure.mjs`, `readiness.mjs`, `serve.mjs` and `summarize.mjs` reproduce the
  experiment without changing application code or dependencies.

The current [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
informed the offscreen layout/font review; installed Vercel React rules informed
the tested and rejected preload approaches. World QA required the actual pixel
and camera evidence and separation of lab, art, CI and field-performance claims.
No merge, deployment or G3 work occurred.
