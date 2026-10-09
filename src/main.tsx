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

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <Entry />
  </StrictMode>
)
if (root.querySelector('main')) hydrateRoot(root, app)
else createRoot(root).render(app)
