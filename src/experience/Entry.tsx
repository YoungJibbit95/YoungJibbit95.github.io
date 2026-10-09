import { lazy, Suspense, useEffect, useState } from 'react'
import App from '../App'

const Experience = lazy(() => import('./ExperienceRoot'))

/**
 * GitHub Pages prerender always returns the complete original HTML portfolio.
 * The private preview route is a client-only progressive enhancement.
 */
export default function Entry() {
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    const sync = () => setPreview(new URLSearchParams(location.search).get('atlas') === 'preview')
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return preview ? (
    <Suspense fallback={<App />}>
      <Experience />
    </Suspense>
  ) : (
    <App />
  )
}
