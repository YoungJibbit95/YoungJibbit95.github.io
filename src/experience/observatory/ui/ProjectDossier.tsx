import type { ObservatoryFilters, ObservatoryNavigation, ObservatoryProject } from '../contracts'
import { followNormally, projectHref } from './navigation'

export interface ProjectDossierProps {
  project: ObservatoryProject
  filters: ObservatoryFilters
  navigation: ObservatoryNavigation
}

/** Text remains complete at every camera LOD, including the no-WebGL alternative. */
export function ProjectDossier({ project, filters, navigation }: ProjectDossierProps) {
  return (
    <article
      className="observatory-dossier"
      aria-labelledby={`dossier-${project.id}`}
      data-testid="observatory-dossier"
    >
      <p className="observatory-explorer__eyebrow">{project.category}</p>
      <h3 id={`dossier-${project.id}`} translate="no">
        {project.name}
      </h3>
      <p className="observatory-dossier__question">{project.question}</p>
      <p>{project.description}</p>
      <dl>
        <div>
          <dt>Stand</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Technologien</dt>
          <dd translate="no">{project.stack.join(', ')}</dd>
        </div>
      </dl>
      <div className="observatory-explorer__actions">
        <a
          href={projectHref(project.id, filters)}
          onClick={(event) =>
            followNormally(event, () => navigation.focusProject(project.id, true))
          }
        >
          Architektur ansehen ↗
        </a>
        <a href={project.repo} target="_blank" rel="noreferrer">
          Repository ↗<span className="atlas-v3__sr"> (neuer Tab)</span>
        </a>
        {project.site ? (
          <a href={project.site} target="_blank" rel="noreferrer">
            Projektseite ↗<span className="atlas-v3__sr"> (neuer Tab)</span>
          </a>
        ) : null}
      </div>
      <details className="observatory-evidence">
        <summary>Quellen & Grenzen</summary>
        <p>{project.visual.interpretation}</p>
        <ul>
          {project.evidence.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.kind === 'code' ? 'Quellcode' : 'Dokumentation'} ↗
                <span className="atlas-v3__sr"> (neuer Tab)</span>
              </a>
              <p>{source.claim}</p>
              <p className="observatory-explorer__muted">{source.limits}</p>
            </li>
          ))}
        </ul>
      </details>
    </article>
  )
}
