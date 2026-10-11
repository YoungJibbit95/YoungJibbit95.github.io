import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import ExperienceRoot from './experience/ExperienceRoot'
import './experience/atlas-base.css'
import './experience/experience.css'
import './experience/observatory/observatory.css'
import './experience/observatory/ui/ui.css'
import './experience/schnittwerk.css'

// A real static document precedes enhancement. The existing scene shell owns
// the only Canvas, camera and history; Three remains behind its lazy boundary.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <ExperienceRoot
      initialWorld={
        document.documentElement.dataset.atlasWorld === 'observatory' ? 'observatory' : 'origin'
      }
    />
  </StrictMode>,
)
