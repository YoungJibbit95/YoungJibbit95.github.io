import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { observatoryProjects } from '../../../src/experience/observatory/data'
import type { ProjectId } from '../../../src/experience/observatory/contracts'
import { MobileJourneyShelf } from './MobileJourneyShelf'
import '@fontsource-variable/manrope'
import './lab.css'

function Lab() {
  const [selected, setSelected] = useState<ProjectId | null>(null)
  const [action, setAction] = useState('Noch keine Aktion')
  return (
    <main>
      <header>
        <h1>Mobile-Bedienlabor</h1>
        <p>Interaktionsprobe für Auswahl, Ansicht und Projekttext. Kein visueller Weltentwurf.</p>
      </header>
      <a href="#actions">Zu den Bedienaktionen</a>
      <section tabIndex={0} aria-label="Hintergrundfokus für Dialogprüfung">
        Die Kamera bleibt beim bestehenden SceneDirector. Der Vorschlag liefert ausschließlich
        Bedienereignisse.
      </section>
      <output id="actions" aria-live="polite">
        {action}
      </output>
      <MobileJourneyShelf
        projects={observatoryProjects}
        selected={selected}
        primaryLabel={selected ? 'Aufbau entdecken' : 'Bei Nexus beginnen'}
        onPrimary={() => {
          setSelected(selected ?? 'nexus')
          setAction('primary')
        }}
        onSelect={(id) => {
          setSelected(id)
          setAction(`select:${id}`)
        }}
        onOverview={() => setAction('overview')}
        onZoom={(direction) => setAction(`zoom:${direction}`)}
      />
    </main>
  )
}
createRoot(document.getElementById('root')!).render(<Lab />)
