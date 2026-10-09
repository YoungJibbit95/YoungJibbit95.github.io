import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpikeApp from './SpikeApp'
import './styles.css'

const element = document.getElementById('root')
if (!element) throw new Error('Missing camera spike mount')
createRoot(element).render(
  <StrictMode>
    <SpikeApp />
  </StrictMode>,
)
