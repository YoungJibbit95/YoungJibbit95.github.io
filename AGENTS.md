# Living Atlas project workflow

Work in this local checkout on `feat/living-atlas-v3`, continuing Draft PR #1.
Never merge to main or deploy without the user's explicit release request. G3
requires explicit approval. Preserve existing local user files and the G0/G1
camera, history, persistent Canvas and render-ready contracts.

For experience work, load the actual project-local instructions:

- `.agents/skills/living-atlas-experience-design/SKILL.md`
- `.agents/skills/design-taste-frontend/SKILL.md`
- `.agents/skills/redesign-existing-projects/SKILL.md`
- `.agents/skills/vercel-react-best-practices/SKILL.md`

Before acceptance, apply `.agents/skills/living-atlas-world-qa/SKILL.md` and
`.agents/skills/web-design-guidelines/SKILL.md` (fetch its current guideline source).
Project facts and the user's scope take precedence over generic marketing-page
recommendations. Do not add a framework, stock image, fake metric or random layout
just to satisfy an unrelated example in a skill.

Read `docs/experience/PHASE_STATUS.md` before starting. Verify actual HEAD and
GitHub status. Run formatting, unit tests, build/prerender, full root browser
suite, three world-switch stress runs and the G0 camera checks for G2 acceptance.
Keep the existing pixel thresholds and meaningful assertions. Save and inspect
actual desktop/mobile Canvas screenshots; report CI and art quality separately.

Vendored `.agents/skills` contents are intentionally excluded from formatting to
preserve upstream files. `skills-lock.json` and the adoption report record sources.
