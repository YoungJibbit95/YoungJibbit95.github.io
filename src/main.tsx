import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/caveat/latin-400.css'
import Entry from './experience/Entry'
import './styles.css'
import './portfolio.css'
import './cosmic-worlds.css'
import './cosmic-deepdives.css'
import './cosmic-detail-polish.css'
import './experience/experience.css'
import './experience/observatory/observatory.css'
import './experience/observatory/ui/ui.css'
import './experience/schnittwerk.css'

const root = document.getElementById('root')!
const preview = new URLSearchParams(location.search).get('atlas') === 'preview'
if (preview) {
  // The preview has different markup. Do not hydrate/mount legacy animations first.
  createRoot(root).render(
    <StrictMode>
      <Entry initialPreview />
    </StrictMode>,
  )
} else {
  // Load the original application only on its own route. Its prerendered HTML
  // remains visible and usable throughout this import, including without JS.
  void import('./App').then(({ default: Legacy }) => {
    const app = (
      <StrictMode>
        <Entry legacy={Legacy} />
      </StrictMode>
    )
    if (root.querySelector('main')) hydrateRoot(root, app)
    else createRoot(root).render(app)
  })
}
