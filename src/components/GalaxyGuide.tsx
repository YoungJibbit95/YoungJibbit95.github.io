import { useEffect, useState } from 'react'

const SECTORS = [
  { id: 'start', code: '00', label: 'Ursprung' },
  { id: 'tech-orbit', code: '01', label: 'Tech-Stern' },
  { id: 'projekte', code: '02', label: 'Systemfokus' },
  { id: 'nexus-geschichte', code: '03', label: 'Nexus Orbit' },
  { id: 'cerebri-system', code: '04', label: 'Cerebri' },
  { id: 'engines-welten', code: '05', label: 'Engines & Welten' },
  { id: 'jarvis-system', code: '06', label: 'YJarvis' },
  { id: 'denkweise', code: '07', label: 'Denkweise' },
  { id: 'mensch', code: '08', label: 'Mensch & Natur' },
]

export function GalaxyGuide() {
  const [activeId, setActiveId] = useState('start')

  useEffect(() => {
    const elements = SECTORS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <aside className="galaxy-guide" aria-label="Galaktischer Stations-Kompass">
      <div className="galaxy-guide-rail">
        {SECTORS.map((sector) => {
          const isCurrent = activeId === sector.id
          return (
            <a
              key={sector.id}
              href={`#${sector.id}`}
              className={`guide-waypoint ${isCurrent ? 'is-current' : ''}`}
              aria-current={isCurrent ? 'location' : undefined}
            >
              <span className="waypoint-code">{sector.code}</span>
              <span className="waypoint-dot" aria-hidden="true" />
              <span className="waypoint-label">{sector.label}</span>
            </a>
          )
        })}
      </div>
    </aside>
  )
}
