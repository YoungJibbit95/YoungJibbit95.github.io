import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { projects } from '../data/projects'
import { useExperienceStore } from '../store/experienceStore'
import { moveWithKey, isFormTarget } from './InteractionRouter'
import { effectiveMotion, webGLAvailable } from './MotionPolicy'
import { SceneDirector } from './SceneDirector'
import { availableWorlds, findHotspot, getWorld } from './SceneRegistry'
import type { AvailableWorldId, CameraBridge, CameraPose } from './worldTypes'

const WorldCanvas = lazy(() => import('./WorldCanvas'))

class SpaceBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFailure()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** The visitor sees a place and their work, not a developer-facing demo dashboard. */
export default function ExperienceRoot() {
  const director = useMemo(() => new SceneDirector(), [])
  const world = useExperienceStore((state) => state.activeWorld)
  const focusId = useExperienceStore((state) => state.focusId)
  const pose = useExperienceStore((state) => state.pose)
  const transition = useExperienceStore((state) => state.transition)
  const history = useExperienceStore((state) => state.history)
  const motion = useExperienceStore((state) => state.motion)
  const webgl = useExperienceStore((state) => state.webgl)
  const [systemReduced, setSystemReduced] = useState(false)
  const [forceReduced, setForceReduced] = useState(false)
  const [renderedWorld, setRenderedWorld] = useState<AvailableWorldId | null>(null)
  const definition = getWorld(world)
  const focus = findHotspot(world, focusId)

  useEffect(() => {
    setRenderedWorld(null)
  }, [world])
  const supported = webgl === 'ready'

  useEffect(() => {
    director.start()
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setSystemReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    useExperienceStore.getState().setWebGL(webGLAvailable() ? 'ready' : 'fallback')
    return () => {
      media.removeEventListener('change', sync)
      director.dispose()
    }
  }, [director])

  useEffect(() => {
    useExperienceStore.getState().setMotion(effectiveMotion(systemReduced, forceReduced))
  }, [systemReduced, forceReduced])

  useEffect(() => {
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || isFormTarget(event.target)) return
      director.back()
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [director])

  const attach = useCallback((camera: CameraBridge | null) => director.attach(camera), [director])
  const rest = useCallback((current: CameraPose) => director.rest(current), [director])
  const interrupt = useCallback(() => director.interrupt(), [director])
  const select = useCallback((id: string) => director.navigate(world, id), [director, world])
  const fail = useCallback(() => {
    useExperienceStore.getState().setWebGL('fallback')
    director.attach(null)
  }, [director])

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    moveWithKey(event.nativeEvent, director.bridge())
  }

  return (
    <main className="atlas-v3" data-testid="atlas-experience">
      <a className="atlas-v3__skip" href="#atlas-projects">
        Direkt zu Projekten
      </a>
      <header className="atlas-v3__header">
        <a className="atlas-v3__brand" href="/" aria-label="YoungJibbit95 – klassische Ansicht">
          YoungJibbit95<span>.</span>
        </a>
        <span className="atlas-v3__header-detail">AUS NEUGIER WIRD SOFTWARE</span>
        <a href="https://github.com/YoungJibbit95" className="atlas-v3__top-link">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="atlas-v3__intro">
        <p className="atlas-v3__eyebrow">DIE WELT HINTER DEN IDEEN</p>
        <h1>
          Ich baue, <em>um zu verstehen.</em>
        </h1>
        <p>
          Es beginnt mit Neugier. Der Rest entsteht, wenn man Verbindungen nicht nur sieht, sondern
          ihnen folgt.
        </p>
      </div>

      <section className="atlas-v3__experience" aria-label="Räumlicher Atlas">
        <div className="atlas-v3__scene-header">
          <div>
            <span className="atlas-v3__eyebrow">EIN ORT / VIELE VERBINDUNGEN</span>
            <h2 data-testid="atlas-world-title">{definition.title}</h2>
            <p>{definition.subtitle}</p>
          </div>
          <nav className="atlas-v3__world-nav" aria-label="Welten wählen">
            {availableWorlds.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={world === id}
                onClick={() => director.navigate(id)}
              >
                {getWorld(id).title}
              </button>
            ))}
          </nav>
        </div>

        <div className="atlas-v3__stage-layout">
          <div className="atlas-v3__stage-container">
            <div
              className="atlas-v3__stage"
              role="region"
              tabIndex={0}
              aria-label="Räumlicher Atlas, mit Pfeiltasten verschiebbar"
              onKeyDown={keyboard}
              data-testid="atlas-stage"
              data-world={world}
            >
              {supported ? (
                <SpaceBoundary onFailure={fail}>
                  <Suspense
                    fallback={
                      <p className="atlas-v3__fallback" role="status">
                        Die Welt öffnet sich. Orte und Projekte bleiben daneben erreichbar.
                      </p>
                    }
                  >
                    <WorldCanvas
                      world={world}
                      selectedId={focusId}
                      initialPose={pose}
                      onCamera={attach}
                      onRest={rest}
                      onInterrupt={interrupt}
                      onFocus={select}
                      onFailure={fail}
                      onSceneReady={setRenderedWorld}
                    />
                  </Suspense>
                </SpaceBoundary>
              ) : (
                <div className="atlas-v3__fallback" role="status">
                  {webgl === 'checking'
                    ? 'Die räumliche Ansicht wird vorbereitet.'
                    : definition.fallbackText}
                </div>
              )}
              <div className="atlas-v3__scene-caption" aria-hidden="true">
                <span>YOUNGJIBBIT95 / {world.toUpperCase()}</span>
                <span>ZIEHEN · RECHTS DREHEN · ZOOMEN</span>
              </div>
            </div>

            <div className="atlas-v3__controls" role="group" aria-label="Kamera und Verlauf">
              <button
                type="button"
                onClick={() => director.back()}
                disabled={!history.length && !focusId && world === 'origin'}
              >
                ← Zurück
              </button>
              <button type="button" onClick={() => director.overview()}>
                Übersicht
              </button>
              <div className="atlas-v3__zoom">
                <button
                  type="button"
                  disabled={!supported}
                  aria-label="Hineinzoomen"
                  onClick={() => void director.bridge()?.dolly(2)}
                >
                  +
                </button>
                <button
                  type="button"
                  disabled={!supported}
                  aria-label="Herauszoomen"
                  onClick={() => void director.bridge()?.dolly(-2)}
                >
                  −
                </button>
              </div>
            </div>
          </div>

          <aside className="atlas-v3__sidebar" aria-label="Orte und Erklärungen">
            <p className="atlas-v3__eyebrow">VERBINDUNGEN ENTDECKEN</p>
            <p className="atlas-v3__sidebar-lead">{definition.introduction}</p>
            <nav className="atlas-v3__places" aria-label="Orte im Raum">
              {definition.hotspots.map((spot, index) => (
                <button
                  type="button"
                  key={spot.id}
                  aria-pressed={focusId === spot.id}
                  onClick={() => select(spot.id)}
                >
                  <span className="atlas-v3__place-count">0{index + 1}</span>
                  <span>
                    <strong>{spot.title}</strong>
                    <small>{spot.kind}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </nav>
            <div className="atlas-v3__insight" aria-live="polite">
              <span className="atlas-v3__eyebrow">IM FOKUS</span>
              <p>{focus?.description ?? 'Bewege den Blick. Wähle einen Ort.'}</p>
              {focus?.destination && (
                <button
                  type="button"
                  className="atlas-v3__travel"
                  onClick={() => director.navigate(focus.destination!)}
                >
                  Weiter zur Sternwarte ↗
                </button>
              )}
            </div>
            <label className="atlas-v3__motion">
              <input
                type="checkbox"
                checked={systemReduced || forceReduced}
                onChange={(event) => setForceReduced(event.target.checked)}
              />
              Kamerafahrten reduzieren
            </label>
            <output
              className="atlas-v3__sr"
              data-testid="atlas-scene-ready"
              aria-hidden="true"
            >
              {renderedWorld === world ? renderedWorld : ''}
            </output>
            <output className="atlas-v3__sr" data-testid="atlas-pose">
              {JSON.stringify(pose)}
            </output>
            <output className="atlas-v3__sr" data-testid="atlas-history-depth">
              {history.length}
            </output>
            <output className="atlas-v3__sr" data-testid="atlas-transition">
              {transition}
            </output>
            <output className="atlas-v3__sr" data-testid="atlas-motion">
              {motion}
            </output>
          </aside>
        </div>
      </section>

      <section className="atlas-v3__projects" id="atlas-projects">
        <div>
          <p className="atlas-v3__eyebrow">DIE ARBEIT DAHINTER</p>
          <h2>Ideen, die zu Projekten werden.</h2>
          <p>Die Projekte sind auch ohne Raumansicht direkt zugänglich.</p>
        </div>
        <div className="atlas-v3__project-grid">
          {projects.map((project) => (
            <article key={project.id}>
              <span>{project.category}</span>
              <h3>{project.name}</h3>
              <p>{project.tagline}</p>
              <a href={project.repo}>Projekt auf GitHub ↗</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="atlas-v3__footer">
        <span>YoungJibbit95 · Neugier, Systeme und eigene Welten</span>
        <a href="/#mensch">Über mich</a>
        <a href="https://github.com/YoungJibbit95">Kontakt über GitHub ↗</a>
      </footer>
    </main>
  )
}
