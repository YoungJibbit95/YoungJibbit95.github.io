import { JourneyField } from './JourneyField'
import { NexusField } from './NexusField'
import { CerebriField } from './CerebriField'

export function AtlasGraphics({ type }: { type: 'intro' | 'nexus' | 'cerebri' | 'work' }) {
  if (type === 'intro') return <JourneyField />
  if (type === 'nexus') return <NexusField />
  if (type === 'cerebri') return <CerebriField />
  return (
    <div className="work-plate atlas-visual">
      <svg viewBox="0 0 590 130" aria-hidden="true">
        <path className="work-trace" pathLength="1" d="M66 65H523" />
        <circle cx="66" cy="65" r="4" />
        <circle cx="523" cy="65" r="4" />
      </svg>
      <ol className="work-steps">
        {[
          { label: 'Idee', text: 'Problem und Ziel klären.' },
          { label: 'Umsetzung', text: 'In überschaubaren Schritten bauen.' },
          { label: 'Prüfung', text: 'Fehler suchen und Änderungen testen.' },
          { label: 'Nächster Stand', text: 'Verbessern und veröffentlichen.' },
        ].map((item, index) => (
          <li key={item.label} data-fly>
            <span className="work-number">0{index + 1}</span>
            <h3>{item.label}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
