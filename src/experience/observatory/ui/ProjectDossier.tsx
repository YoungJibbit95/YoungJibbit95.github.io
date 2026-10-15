import type { Ref } from 'react'
import type { ObservatoryFilters, ObservatoryNavigation, ObservatoryProject } from '../contracts'
import { nexusSemantics } from '../../worlds/cosmos/nexusSemantic'
import { followNormally, projectHref } from './navigation'

export interface ProjectDossierProps {
  cosmicPreview?: boolean
  project: ObservatoryProject
  filters: ObservatoryFilters
  navigation: ObservatoryNavigation
  headingRef?: Ref<HTMLHeadingElement>
}

/** Text remains complete at every camera LOD, including the no-WebGL alternative. */
export function ProjectDossier({
  project,
  filters,
  navigation,
  cosmicPreview = false,
  headingRef,
}: ProjectDossierProps) {
  return (
    <article
      className="observatory-dossier"
      aria-labelledby={`dossier-${project.id}`}
      data-testid="observatory-dossier"
    >
      <p className="observatory-explorer__eyebrow">{project.category}</p>
      <h3
        id={`dossier-${project.id}`}
        ref={headingRef}
        tabIndex={cosmicPreview ? -1 : undefined}
        translate="no"
      >
        {project.name}
      </h3>
      <p className="observatory-dossier__question">{project.question}</p>
      <p>{project.description}</p>
      {cosmicPreview && project.id === 'nexus' && (
        <section className="cosmos-nexus-system" aria-labelledby="nexus-system-title">
          <h4 id="nexus-system-title">Ein Stern, vier Apps</h4>
          <p className="cosmos-nexus-system__core">
            <strong translate="no">{nexusSemantics.core.label}</strong>
            <span>{nexusSemantics.core.role}</span>
          </p>
          <dl aria-label="Die vier Nexus-Apps">
            {nexusSemantics.clients.map((client) => (
              <div key={client.id} data-nexus-client={client.id}>
                <dt translate="no">{client.label}</dt>
                <dd>{client.role}</dd>
              </div>
            ))}
          </dl>
          <p className="cosmos-nexus-system__reading">
            Beim Näherkommen fächern sich die App-Welten um den zentralen Stern auf. So werden die
            vier Anwendungen und ihre gemeinsame Grundlage einzeln lesbar.
          </p>
        </section>
      )}
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
        <p>
          {cosmicPreview && project.id === 'nexus'
            ? nexusSemantics.explanation
            : project.visual.interpretation}
        </p>
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
