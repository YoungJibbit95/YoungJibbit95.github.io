# G2-C execution checkpoint

Start: local/remote/PR `85a3204ff73f6457c356b3ee773a2d9b2b8a7205`.
Branch `feat/living-atlas-v3`, Draft PR #1; main remains
`e1e1da1cdb395d7fbb561b678f19a799d0a15043`. Original untracked ZIP preserved.

Five actual native specialists ran in waves (three children plus Lead), followed
by an independent architecture reviewer. Only Lead commits/pushes. Every shared
writer had disjoint ownership; no concurrent core or package edits were assigned.

| Agent               | State               | Exclusive area / handoff                                                              | Runtime                                                                     |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| A performance       | ready / integrated  | `scripts/perf/`, `docs/experience/performance/`, selected CSS patch                   | `F:/Coding/atlas-g2c-performance`, `codex/g2c-performance`; servers stopped |
| B project_data      | ready / integrated  | data, validation, data tests, sources; Lead commit `d068190`                          | shared checkout; no server/build                                            |
| C spatial           | ready / integrated  | ObservatoryWorld, architecture/atmosphere, world CSS, Art report and harness/evidence | own port3001 stopped                                                        |
| D interaction       | ready / integrated  | filter logic, Explorer, Dossier, navigation, state unit tests                         | shared checkout; no server/build                                            |
| E independent_qa    | ready / integrated  | two Observatory browser specs, QA report and PNG/JSON/log artifacts                   | dev3000, isolated results; browsers closed                                  |
| architecture_review | ready after repairs | read-only independent review                                                          | three P1 causes reported; repair diff rechecked                             |
| Lead                | final verification  | contracts, shared core, store/history, camera integration, commits and PR             | production4173, G04174, dev3000; close after checks                         |

All assigned artifacts are copied into the main checkout, not stranded in the
isolated worktree. All agents used baseline `85a3204`. No agent created its own
feature commit; named exclusive paths and A's CSS patch are the handoff artifacts.
Lead data commit: `d068190`; subsequent coherent feature/performance/verification
commits are discoverable with `git log --oneline 85a3204..HEAD`.

## Integration completed

Seven pinned-source project models; real per-project architecture and camera LOD;
search/five filter dimensions, dossiers, native links, Fit All/Cluster, edge selection;
URL/filter/full-camera history. One persistent Canvas and CameraControls remain.
Origin's G2-B graph/playback is unchanged. All physical project bounds and route
normalization are unit-tested.

Review repairs: imperative camera input interrupts Director and rig; invisible
raycast ancestors ignored; full allowed Unicode query round-trips; mobile covered
controls excluded from Tab while Explorer is open. E independently verified each.

Performance: selected CSS-only offscreen layout patch is integrated. Rejected
preload patches remain evidence only. Three comparable baseline/after samples plus
12 integrated Origin/Observatory runs, compressed raw traces, build manifest and
honest transport limitations are preserved. Performance remains PARTIAL.

## Verified checkpoint

- TypeScript, production build/prerender, 22 root unit tests pass.
- E: 16/16 new tests plus targeted 17th case, zero retries.
- G0: fresh `npm ci`, 6 unit tests, typecheck/build, 16 browser passes / 8 existing skips.
  Local npm child-script lookup failed for `tsc`; directly invoking installed
  TypeScript/Vite/Playwright entrypoints succeeded. No project source/config change.
- Root production: 65/65 PASS, zero retries. Original G1 stress: 3/3 PASS,
  zero retries. Logs archived under evidence/g2c/verification. Exact-head CI links
  belong in the final PR/Chat report.
- Format passes after final report edits. Existing test thresholds preserved;
  only Nexus's authored position assertion moved -10→-230 at the same tolerance.

Original ZIP is untouched. `package-lock.json` acquired an unassigned metadata/
ordering diff during work: no package version/integrity change, two `devOptional`
flags removed. None of the six agents reports writing it. Preserved as a local
change outside feature commits, with `.verification/g2c-lock-observed.json` backup.
Do not silently revert it or add it to the feature change.

The first full CI on `5b81237` passed with two Root retries; it is not a stable
first-pass result. See `G2_C_CI_REPAIR.md` for the original traces and repairs.
E's corrected live-resource check passed 3/3 without retry, with unchanged limits
and an additional equal-camera-pose assertion. Architecture review rechecked
the diagnostic listener, cleanup and disjoint Playwright projects without P0/P1.
The complete local Root suite passed again: 65/65 in 5.0 minutes, zero retries;
22/22 unit tests also passed again. The final exact-SHA CI results belong in the
PR/Chat report, outside the commit whose checks they identify.
The unchanged G1 world-switch stress also passed again: 3/3 in 33.6 seconds,
zero retries. Final local logs are archived with the earlier run logs.

Next: commit the documented CI repair, push only the existing feature branch,
await both exact-HEAD workflows, update Draft PR and report screenshots.
Close E's preview4173 server after Lead's full-suite reuse; all other servers
are already stopped. No G3, main merge or production deploy. G2-D handoff:
`PHASE_STATUS.md` and `performance/INTEGRATED_G2C_PERFORMANCE.md`.
