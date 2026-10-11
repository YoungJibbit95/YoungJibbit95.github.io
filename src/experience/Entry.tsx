import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'

const Experience = lazy(() => import('./ExperienceRoot'))
const LazyLegacy = lazy(() => import('../App'))
const loading = (
  <main className="atlas-v3 atlas-v3__boot" aria-busy="true">
    <h1>Aus Neugier wird Software.</h1>
    <p>Die räumliche Ansicht wird vorbereitet…</p>
    <a href="/">Klassische Ansicht öffnen</a>
  </main>
)

/**
 * GitHub Pages prerender always returns the complete original HTML portfolio.
 * The private preview route is a client-only progressive enhancement.
 */
export default function Entry({
  initialPreview = false,
  legacy: Legacy,
}: {
  initialPreview?: boolean
  legacy?: ComponentType
}) {
  const [preview, setPreview] = useState(initialPreview)

  useEffect(() => {
    const sync = () => setPreview(new URLSearchParams(location.search).get('atlas') === 'preview')
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return preview ? (
    <Suspense fallback={loading}>
      <Experience />
    </Suspense>
  ) : Legacy ? (
    <Legacy />
  ) : (
    <Suspense fallback={loading}>
      <LazyLegacy />
    </Suspense>
  )
}
