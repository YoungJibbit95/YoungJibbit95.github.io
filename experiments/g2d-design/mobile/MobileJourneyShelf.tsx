import { useId, useRef } from 'react'
import type { ObservatoryProject, ProjectId } from '../../../src/experience/observatory/contracts'
import './mobile-shelf.css'

interface MobileJourneyShelfProps {
  projects: readonly ObservatoryProject[]
  selected: ProjectId | null
  primaryLabel: string
  onPrimary: () => void
  onSelect: (id: ProjectId) => void
  onOverview: () => void
  onZoom: (direction: 'in' | 'out') => void
}

/** Isolated proposal: callbacks adapt to SceneDirector; no camera, router or history here. */
export function MobileJourneyShelf({
  projects,
  selected,
  primaryLabel,
  onPrimary,
  onSelect,
  onOverview,
  onZoom,
}: MobileJourneyShelfProps) {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const readerButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const project = projects.find((item) => item.id === selected)

  function readProject() {
    dialog.current?.showModal()
    closeButton.current?.focus()
  }

  return (
    <>
      <aside className="mobile-journey-shelf" aria-label="Projekt erkunden">
        <div className="mobile-journey-actions">
          <button className="mobile-journey-primary" onClick={onPrimary}>
            {primaryLabel}
          </button>
          <div className="mobile-journey-selector">
            <label htmlFor={`${id}-projects`}>Anderes Projekt</label>
            <select
              id={`${id}-projects`}
              name="project"
              value={selected ?? ''}
              onChange={(event) => onSelect(event.currentTarget.value as ProjectId)}
            >
              <option value="" disabled>
                Projekt wählen
              </option>
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mobile-journey-secondary">
          <details className="mobile-journey-view">
            <summary>Ansicht</summary>
            <div>
              <button onClick={onOverview}>Übersicht</button>
              <button onClick={() => onZoom('in')}>Näher heran</button>
              <button onClick={() => onZoom('out')}>Weiter zurück</button>
            </div>
          </details>
          {project && (
            <button ref={readerButton} onClick={readProject}>
              Projekt lesen
            </button>
          )}
        </div>
      </aside>
      <dialog
        ref={dialog}
        className="mobile-journey-reader"
        aria-labelledby={`${id}-title`}
        onClose={() => readerButton.current?.focus()}
      >
        <button
          ref={closeButton}
          className="mobile-journey-close"
          onClick={() => dialog.current?.close()}
        >
          Schließen
        </button>
        {project && (
          <article>
            <h2 id={`${id}-title`}>{project.name}</h2>
            <p>{project.description}</p>
            <p>{project.evidence[0].claim}</p>
            <p>{project.evidence[0].limits}</p>
            <a href={project.evidence[0].url} target="_blank" rel="noreferrer">
              Geprüften Quelltext öffnen
            </a>
          </article>
        )}
      </dialog>
    </>
  )
}
