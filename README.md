# YoungJibbit95 Portfolio

My personal portfolio: **Aus Neugier wird Software.** Built with React, TypeScript, Vite and GSAP, published on GitHub Pages.

**Website:** [youngjibbit95.github.io](https://youngjibbit95.github.io/)

## Release 0.1

The first release establishes the visual direction and a complete, readable introduction:

- An interactive project constellation with a shared project selection.
- A curated overview of Nexus, Cerebri, NovaCore, Nemisis, Adventura, YjsE and YJarvis.
- Custom architectural illustrations, development philosophy and a personal section.
- Responsive layouts, keyboard navigation and system-aware motion preferences.
- Prerendered HTML, locally hosted fonts and a verified GitHub Pages deployment.

The illustrations explain project relationships. The interactive Nexus workflow and Cerebri planning example belong to the next releases.

## Development

Use Node.js 24 and npm. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run dev
```

## Verification

```sh
npx playwright install chromium
npm run check
```

The build runs TypeScript checks, produces the Vite bundle and prerenders the React content. Browser tests check project selection, mobile navigation, reduced motion, layouts from 320 to 1440 pixels, accessible markup and baseline content without JavaScript.

```sh
npm run preview
```

## Deployment

Pushes to `main` run `.github/workflows/pages.yml`. The site is deployed only after the build and browser tests pass. Pull requests run the same checks without publishing. GitHub Pages uses the **GitHub Actions** source.

## Project structure

| Path                        | Purpose                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `src/data/projects.ts`      | Curated project descriptions and repository links                       |
| `src/components/`           | Navigation, constellation, project illustrations and motion preferences |
| `src/styles.css`            | Visual tokens, layout, motion and responsive styles                     |
| `scripts/prerender.tsx`     | Build-time React rendering                                              |
| `tests/portfolio.spec.ts`   | Production browser checks                                               |
| `docs/portfolio-konzept.md` | Original concept and motion direction                                   |
| `docs/release-plan.md`      | Small, independently publishable release stages                         |

Project information is based on the linked public repositories and my GitHub profile. Personal copy reflects my own interests and perspective.
