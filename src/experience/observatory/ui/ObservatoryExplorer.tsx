import { useEffect, useRef, useState } from 'react'
import { Compass, X } from 'lucide-react'
import type {
  ObservatoryEdge,
  ObservatoryFilters,
  ObservatoryLodState,
  ObservatoryNavigation,
  ObservatoryProject,
} from '../contracts'
import { observatoryClusters, observatoryEdges, observatoryProjects } from '../data'
import { emptyFilters, filterEdges, getFilterOptions, MAX_QUERY_LENGTH } from '../state/filters'
import { ProjectDossier } from './ProjectDossier'
import { followNormally, projectHref } from './navigation'

export interface ObservatoryExplorerProps {
  filters: ObservatoryFilters
  visibleProjects: readonly ObservatoryProject[]
  selectedProject: ObservatoryProject | null
  selectedEdge: ObservatoryEdge | null
  lod: ObservatoryLodState
  navigation: ObservatoryNavigation
}

const options = getFilterOptions()
const levels = { macro: 'Weitblick', meso: 'Projektebene', micro: 'Architekturdetail' }
const relationNames = {
  technical: 'Technische Abhängigkeit',
  thematic: 'Thematische Nachbarschaft',
  illustrative: 'Illustrative Verbindung',
}

/** Controlled exploration: this component owns disclosure only, never camera, filter or history state. */
export function ObservatoryExplorer({
  filters,
  visibleProjects,
  selectedProject,
  selectedEdge,
  lod,
  navigation,
}: ObservatoryExplorerProps) {
  const [open, setOpen] = useState(false)
  const [draftQuery, setDraftQuery] = useState(filters.query)
  const trigger = useRef<HTMLButtonElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const edges = filterEdges(observatoryEdges, visibleProjects)
  const activeEdge = edges.find((edge) => edge.id === selectedEdge?.id) ?? null
  const hasFilters = Object.values(filters).some(Boolean)
  const visibleSelected = visibleProjects.some((project) => project.id === selectedProject?.id)
  const discoveryProject =
    (visibleSelected ? selectedProject : null) ??
    visibleProjects.find((project) => project.id === 'nexus') ??
    visibleProjects[0]

  useEffect(() => {
    if (open) title.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => setDraftQuery(filters.query), [filters.query])

  const close = () => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }
  const reset = () => {
    setDraftQuery('')
    navigation.setFilters({ ...emptyFilters })
  }
  const setFilter = (key: keyof ObservatoryFilters, value: string) =>
    navigation.setFilters({ ...filters, [key]: value })

  return (
    <aside
      className="observatory-explorer atlas-v3__overlay"
      data-testid="observatory-explorer"
      data-expanded={open}
      aria-label="Projektsternwarte erkunden"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          event.stopPropagation()
          close()
        }
      }}
    >
      <div className="observatory-explorer__bar">
        <button
          type="button"
          className="schnittwerk-discover"
          disabled={!discoveryProject}
          onClick={() => {
            if (discoveryProject) navigation.focusProject(discoveryProject.id, visibleSelected)
          }}
        >
          {visibleSelected
            ? selectedProject?.id === 'nexus'
              ? 'Innenraum entdecken'
              : 'Architektur erkunden'
            : discoveryProject
              ? `${discoveryProject.id === 'nexus' ? 'Nexus' : discoveryProject.name} erkunden`
              : 'Keine Projekte im Ausschnitt'}
          <span aria-hidden="true">↗</span>
        </button>
        <button
          ref={trigger}
          type="button"
          aria-label="Projekte erkunden"
          aria-expanded={open}
          aria-controls="observatory-explorer-panel"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <Compass size={18} aria-hidden="true" />
          <span className="observatory-explorer__trigger-label">
            Projekte erkunden
            {selectedProject && !open ? <small translate="no">{selectedProject.name}</small> : null}
          </span>
          <span
            className="observatory-explorer__count"
            aria-label={`${visibleProjects.length} von 7 Projekten sichtbar`}
          >
            {visibleProjects.length}/7
          </span>
        </button>
        <button type="button" onClick={navigation.fitAll}>
          Alle einrahmen
        </button>
      </div>
      {open ? (
        <section
          id="observatory-explorer-panel"
          className="observatory-explorer__panel"
          aria-labelledby="observatory-explorer-title"
        >
          <header className="observatory-explorer__heading">
            <h2 id="observatory-explorer-title" ref={title} tabIndex={-1}>
              Projektsternwarte
            </h2>
            <button type="button" aria-label="Projekterkundung schließen" onClick={close}>
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          <div className="observatory-explorer__body">
            <p
              className="observatory-explorer__level"
              data-testid="observatory-lod"
              data-level={lod.level}
            >
              {levels[lod.level]}
            </p>
            {selectedProject && visibleSelected ? (
              <ProjectDossier project={selectedProject} filters={filters} navigation={navigation} />
            ) : null}
            <form
              role="search"
              aria-label="Projekte suchen und filtern"
              onSubmit={(event) => {
                event.preventDefault()
                navigation.setFilters({ ...filters, query: draftQuery })
              }}
            >
              <label className="observatory-explorer__search">
                <span>Projekte suchen</span>
                <input
                  type="search"
                  name="observatory-query"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Name oder Thema, z. B. Rust…"
                  maxLength={MAX_QUERY_LENGTH}
                  value={draftQuery}
                  onChange={(event) => setDraftQuery(event.target.value)}
                />
              </label>
              <button type="submit">Suchen</button>
              <details className="observatory-explorer__filters">
                <summary>Filter {hasFilters ? '(aktiv)' : ''}</summary>
                <div className="observatory-explorer__filter-grid">
                  <label>
                    <span id="observatory-category-label">Kategorie</span>
                    <select
                      aria-labelledby="observatory-category-label"
                      name="observatory-category"
                      value={filters.category}
                      onChange={(event) => setFilter('category', event.target.value)}
                    >
                      <option value="">Alle Kategorien</option>
                      {options.categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span id="observatory-technology-label">Technologie</span>
                    <select
                      aria-labelledby="observatory-technology-label"
                      name="observatory-technology"
                      value={filters.technology}
                      onChange={(event) => setFilter('technology', event.target.value)}
                    >
                      <option value="">Alle Technologien</option>
                      {options.technologies.map((technology) => (
                        <option key={technology}>{technology}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span id="observatory-status-label">Status</span>
                    <select
                      aria-labelledby="observatory-status-label"
                      name="observatory-status"
                      value={filters.status}
                      onChange={(event) => setFilter('status', event.target.value)}
                    >
                      <option value="">Alle Status</option>
                      {options.statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span id="observatory-cluster-label">Cluster</span>
                    <select
                      aria-labelledby="observatory-cluster-label"
                      name="observatory-cluster"
                      value={filters.cluster}
                      onChange={(event) => setFilter('cluster', event.target.value)}
                    >
                      <option value="">Alle Cluster</option>
                      {observatoryClusters.map((cluster) => (
                        <option key={cluster.id} value={cluster.id}>
                          {cluster.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </details>
              {hasFilters ? (
                <button className="observatory-explorer__reset" type="button" onClick={reset}>
                  Suche & Filter zurücksetzen
                </button>
              ) : null}
            </form>
            <p
              className="observatory-explorer__result-count"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {visibleProjects.length === 1
                ? '1 Projekt sichtbar'
                : `${visibleProjects.length} Projekte sichtbar`}
            </p>
            {visibleProjects.length ? (
              <nav aria-label="Gefundene Projekte">
                <ul className="observatory-explorer__results">
                  {visibleProjects.map((project) => (
                    <li key={project.id}>
                      <a
                        href={projectHref(project.id, filters)}
                        aria-current={selectedProject?.id === project.id ? 'location' : undefined}
                        data-project-id={project.id}
                        onClick={(event) =>
                          followNormally(event, () => navigation.focusProject(project.id))
                        }
                      >
                        <span>
                          <strong translate="no">{project.name}</strong>
                          <small>{project.status}</small>
                        </span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <div className="observatory-explorer__empty">
                <h3>Kein Projekt passt dazu.</h3>
                <p>
                  Ändere den Suchbegriff oder setze die Filter zurück, um wieder alle Systeme zu
                  sehen.
                </p>
                <button type="button" onClick={reset}>
                  Alle Projekte anzeigen
                </button>
              </div>
            )}
            <details className="observatory-explorer__regions">
              <summary>Cluster erkunden</summary>
              {observatoryClusters.map((cluster) => (
                <div key={cluster.id}>
                  <h3>{cluster.name}</h3>
                  <p>{cluster.description}</p>
                  <button type="button" onClick={() => navigation.fitCluster(cluster.id)}>
                    {cluster.name} einrahmen
                  </button>
                </div>
              ))}
            </details>
            {edges.length ? (
              <details className="observatory-explorer__relations" open={Boolean(activeEdge)}>
                <summary>Verbindungen lesen</summary>
                <p>
                  Durchgezogene Linien zeigen belegte Abhängigkeiten, gestrichelte Linien
                  thematische Nähe.
                </p>
                <ul>
                  {edges.map((edge) => (
                    <li key={edge.id}>
                      <button
                        type="button"
                        aria-pressed={activeEdge?.id === edge.id}
                        onClick={() =>
                          navigation.selectEdge(activeEdge?.id === edge.id ? null : edge.id)
                        }
                      >
                        <span>
                          {observatoryProjects.find((project) => project.id === edge.from)?.name}{' '}
                          {edge.kind === 'technical' ? '→' : '↔'}{' '}
                          {observatoryProjects.find((project) => project.id === edge.to)?.name}
                        </span>
                        <small>{relationNames[edge.kind]}</small>
                      </button>
                    </li>
                  ))}
                </ul>
                {activeEdge ? (
                  <article
                    className="observatory-explorer__edge"
                    aria-label={`Verbindung: ${activeEdge.label}`}
                  >
                    <h3>{activeEdge.label}</h3>
                    <p>{activeEdge.description}</p>
                    <ul>
                      {activeEdge.evidence.map((source) => (
                        <li key={source.id}>
                          <a href={source.url} target="_blank" rel="noreferrer">
                            Beleg: {source.id.split(':')[1]} ↗
                            <span className="atlas-v3__sr"> (neuer Tab)</span>
                          </a>
                          <p>{source.limits}</p>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => navigation.selectEdge(null)}>
                      Verbindung abwählen
                    </button>
                  </article>
                ) : null}
              </details>
            ) : null}
          </div>
        </section>
      ) : null}
    </aside>
  )
}
