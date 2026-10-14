# Living Cosmos — technical recovery

This review concerns the existing feature branch and its recovery before the
limited cosmic slice. Visual approval remains separate from engineering checks.
No release, merge to `main`, or G3 is authorized.

## Verified starting point

- Repository: `YoungJibbit95/YoungJibbit95.github.io`, branch
  `feat/living-atlas-v3`, local and Draft PR #1 HEAD
  `32e6a87a238fb3ea14fc2f3cf77f7df0a739b60f`.
- [Root CI 38157814935](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38157814935):
  **FAIL**, 72 passes, 3 failures and 1 flaky case. The earlier local 76/76 result
  does not replace this result.
- [G0 CI 38157814871](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38157814871):
  **PASS** at that starting HEAD.
- Existing uncommitted reports, scripts, lockfile metadata, evidence and the ZIP
  were preserved. Historical reports do not define the new cosmic art direction.

## Original trace findings

The original `g1-preview-evidence` artifact was downloaded and its JSON trace and
network records inspected. Raw traces remain local under the ignored directory
`.verification/living-cosmos/recovery/ci-38157814935/`; they are not committed.

| Case                                  | Trace evidence                                                                                                                                                                                           | Classification and repair                                                                                                                                                                                                                                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consecutive world changes             | Both attempts reach the real `Page.screenshot` call. Fonts finish loading; the capture never returns a pixel sample before the 5-second assertion poll expires. Scene readiness already passed.          | Screenshot transport was inside a shorter assertion deadline. Preserve the original scene-readiness and viewport checks, then capture once within the unchanged test deadline and assert the unchanged `lit > 35`. A black sample fails immediately.                                                                                   |
| Rapid focus and keyboard interruption | First attempt stays `interrupted` for the complete 5-second assertion. The retry settles after 4.835 seconds, passes the unchanged one-second pose-stability check, then stalls in screenshot capture.   | Separate camera behavior from capture timing. The library's `stop()` copies its pending destination into its current position and does not clear velocity before a following manual move. Lead replaces cancellation with the physical current pose and a zero-delta update. Screenshot capture is moved outside the short pixel poll. |
| Mobile pinch and pan                  | Both attempts pass distance change, target movement and page-scroll assertions. The final screenshot starts, fonts finish, and no sample returns before the 5-second poll deadline.                      | Preserve both genuine touch gestures and every pose/scroll threshold. Wait for camera `idle` after touch release, capture once, retain `lit > 35`.                                                                                                                                                                                     |
| Legacy Nexus capture                  | `Create context` alone takes 22.919 seconds of the unchanged 30-second test. `notes.png` returns HTTP 200, 1,162,074 bytes, after 223.448 ms. The image-completion assertion then expires; retry passes. | Browser/context pressure is evidenced; an image URL/data failure is not. No timeout increase, retry increase or invented application fix. Keep this case unchanged and require the next complete Root CI to establish recovery.                                                                                                        |

The screenshot changes do not substitute DOM pixels for Canvas pixels. Overlay
masking, the existing crop, luminance/chroma thresholds, all camera assertions,
and the persistent single-Canvas assertion are retained. Capturing a single real
frame also removes the possibility of retrying an actually black sampled frame.
The final recorded desktop world-switch and mobile-pinch screencast frames were
also visually inspected: both contain the rendered landscape and project forms.
These compressed trace frames corroborate the diagnosis; they do not replace
the unchanged Canvas pixel assertions in the actual tests.

## Additional reproducible camera defect

A stationary pointer press on empty Canvas leaves the old implementation in
`interrupted`, even though the camera has not moved. The new regression
`a stationary pointer press releases camera interruption without changing the
view` fails against the original build after the unchanged 5-second assertion
deadline. Its pose tolerance is `1e-7`; it does not accept a jump to another view.
Local baseline trace: `.verification/living-cosmos/recovery/pointer-baseline/`.

`camera-controls` 3.1.2 implementation evidence: `stop()` copies `_targetEnd` and
`_sphericalEnd` into the current values. A cancellation therefore needs an
explicit physical-pose snapshot, rather than a call whose name suggests a
stationary stop. Wheel interruption must occur in the capture phase, before the
controls receive the new wheel delta, so cancellation cannot discard that input.

## Verification ledger

| Check                                                                              | Result                                                                                                                                                                                             |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original three failing spatial tests, local baseline, one worker, no retry         | **PASS 3/3**, 50.2 seconds total. This demonstrates local/CI differences, not CI recovery.                                                                                                         |
| Stationary-pointer regression against original build                               | **FAIL 1/1**, reproducible `interrupted`; expected evidence before repair.                                                                                                                         |
| Focused checks after the camera repair                                             | **PASS 11/11**, one worker, no retries, 1.4 minutes. Includes the three former spatial failures, stationary pointer, real mouse drag/wheel, five standalone cases and unchanged Legacy Nexus case. |
| Standalone entry: hydration, exact camera history, native URLs, No-JS and No-WebGL | **PASS 5/5** as part of the focused run, retaining exact full-pose assertions.                                                                                                                     |
| Full Root, G0 and three world-switch stress runs on recovery commit                | **PENDING**, owned by lead.                                                                                                                                                                        |
| Independent art quality                                                            | Not assessed by this recovery report.                                                                                                                                                              |

## Follow-up on recovery CI

[Root CI 38539741374](https://github.com/YoungJibbit95/YoungJibbit95.github.io/actions/runs/38539741374)
on recovery commit `61541b60187c9c5a6ee69d0873e22cecfc2f342c` finishes with
**76 passed, 1 failed**. Rapid camera interruption, stationary pointer, mobile
pinch, and the unchanged Legacy Nexus case all pass on their first attempt.
Legacy Nexus takes 27.2 seconds; this is a pass, with little timing margin, not
evidence that the previously observed browser-context pressure cannot recur.
No Legacy test or timeout is changed.

Only the consecutive-world pixel test exceeds its unchanged 30-second total
deadline. Its first two screenshot calls actually complete in 6.259 and 6.803
seconds; retry timings are 6.329 and 6.422 seconds. The third screenshot starts
near the total deadline and is canceled by test teardown. The cleanup exception
is secondary to that cancellation, not an independent application exception.

The three camera-`idle` assertions added in the recovery commit consume 8.953
seconds in the first attempt and 9.497 seconds in the retry. Renderer frames
still advance from 51 to 60 and from 80 to 87 during capture after camera rest;
this observation does not establish the cause of the screenshot cost. A local
probe additionally waiting for the renderer counter to stop passes three runs,
but takes 27.4, 27.4 and 27.0 seconds versus the lead's preceding 23.9, 23.9 and
24.0 seconds. That added wait did not improve the measured test duration and is
not retained.

Comparison against the original `32e6a87` test confirms that neither camera
`idle` nor renderer stillness was an acceptance condition for this world-switch
case. The follow-up removes only those additional barriers. It retains all three
animated world changes, the original scene-readiness and viewport checks, actual
screenshot pixels, crop, thresholds, Canvas count and the 30-second deadline.
The sole remaining test change from the original is capturing once outside the
short pixel poll, then asserting the same `lit > 35`. Existing camera-settling
and interruption tests remain unchanged by this follow-up. Final stress and CI
results are pending; no capture-speed improvement is claimed.

Raw follow-up traces remain ignored at
`.verification/living-cosmos/recovery/ci-38539741374/`. No additional browser run
was started while the lead's final validation was using the browser slot.

## Static entry and small performance candidate

Both `/atlas/` and `/atlas/observatory/` have dedicated HTML documents,
`src/atlas.tsx`, and prerendered `ExperienceRoot` content. The only Canvas remains
behind the existing lazy `WorldCanvas` boundary. No legacy `App` import or
alternative camera/router is introduced by those entrypoints.

A small candidate is a preload for the actual Latin Manrope variable font in
the two standalone HTML templates. The existing font is 24,836 bytes and is
currently discovered through CSS. A preload can begin that same transfer during
HTML parsing, without adding a font, dependency or render loop. This is a
**proposal**, not a measured improvement. Acceptance requires a matched browser
comparison of font request start/FCP on the same slice; no FPS or real-phone claim
can follow from desktop SwiftShader measurements.

## Skills applied

| Skill                         | Concrete action                                                                                                                                                                                                     | Evidence                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `living-atlas-world-qa`       | Compare actual SHA with GitHub results; inspect original traces; retain Canvas-only pixels, pose precision and all stress contracts. Add a reproducing no-motion interruption case.                                 | CI links above, trace findings and unchanged thresholds in `tests/experience.render.spec.ts` and `tests/observatory.spec.ts`. |
| `vercel-react-best-practices` | Inspect conditional loading and the standalone entry; apply `bundle-conditional` and `rendering-resource-hints` reasoning to preserve the lazy Three boundary and identify one small font-discovery candidate.      | `src/atlas.tsx`, `scripts/prerender.tsx`, `ExperienceRoot` lazy boundary; proposal explicitly unmeasured.                     |
| `web-design-guidelines`       | Fetch current [guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md); check interruptible animation, equivalent keyboard/touch input, stateful URLs and font loading. | Physical cancellation defect and stationary-pointer regression; existing standalone history, fallback and Axe cases retained. |

The skill's referenced `07_QA_AND_RELEASE_GATES.md` was not found in the local
project/docs/skill search. This report uses the available `PHASE_STATUS.md`,
actual CI, code and the user's latest recovery/slice instructions, without
claiming to have read the missing document.
