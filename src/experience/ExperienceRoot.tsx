import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { OriginSignalControls } from './ui/OriginSignalControls'
import { projects } from '../data/projects'
import { useExperienceStore } from '../store/experienceStore'
import { moveWithKey, isFormTarget } from './InteractionRouter'
import { effectiveMotion, webGLAvailable } from './MotionPolicy'
import { SceneDirector } from './SceneDirector'
import { availableWorlds, defaultSnapshot, findHotspot, getWorld, worldHref } from './SceneRegistry'
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
  const heading = useRef<HTMLHeadingElement>(null)
  const previousWorld = useRef(world)
  const definition = getWorld(world)
  const focus = findHotspot(world, focusId)

  useEffect(() => {
    setRenderedWorld(null)
    if (previousWorld.current !== world) {
      heading.current?.focus({ preventScroll: true })
      previousWorld.current = world
    }
  }, [world])
  const supported = webgl === 'ready'

  useEffect(() => {
    director.start()
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const previousTheme = theme?.content
    if (theme) theme.content = '#070914'
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setSystemReduced(media.matches)
    sync()
    media.addEventListener('change', sync)
    useExperienceStore.getState().setWebGL(webGLAvailable() ? 'ready' : 'fallback')
    return () => {
      if (theme && previousTheme !== undefined) theme.content = previousTheme
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
  const navigateLink = (
    event: MouseEvent<HTMLAnchorElement>,
    destination: AvailableWorldId,
    id: string | null = null,
  ) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    director.navigate(destination, id)
    document
      .querySelector('[data-testid="atlas-stage"]')
      ?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }

  return (
    <main className="atlas-v3" data-testid="atlas-experience" data-active-world={world}>
      <a className="atlas-v3__skip" href="#atlas-projects">
        Direkt zu Projekten
      </a>
      <header className="atlas-v3__header">
        <a
          className="atlas-v3__brand"
          href="/"
          aria-label="YoungJibbit95, klassische Ansicht"
          translate="no"
        >
          YoungJibbit95<span>.</span>
        </a>
        <nav className="atlas-v3__world-nav" aria-label="Welten wählen">
          {availableWorlds.map((id) => (
            <a
              key={id}
              href={worldHref(defaultSnapshot(id, null))}
              aria-current={world === id ? 'page' : undefined}
              onClick={(event) => navigateLink(event, id)}
            >
              {getWorld(id).title}
            </a>
          ))}
        </nav>
        <div className="atlas-v3__header-links">
          <a href="#atlas-projects">Projekte</a>
          <a href="https://github.com/YoungJibbit95">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="atlas-v3__experience" aria-label="Räumlicher Atlas">
        <div
          className="atlas-v3__stage"
          role="region"
          tabIndex={0}
          aria-label="Räumlicher Atlas, mit Pfeiltasten verschiebbar"
          onKeyDown={keyboard}
          data-testid="atlas-stage"
          data-world={world}
          data-world-input
          data-lenis-prevent
        >
          {supported ? (
            <SpaceBoundary onFailure={fail}>
              <Suspense
                fallback={
                  <p className="atlas-v3__fallback" role="status">
                    Die Welt öffnet sich… Projekte bleiben direkt erreichbar.
                  </p>
                }
              >
                <WorldCanvas
                  world={world}
                  selectedId={focusId}
                  initialPose={pose}
                  reducedMotion={motion !== 'full'}
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
                ? 'Die räumliche Ansicht wird vorbereitet…'
                : definition.fallbackText}
            </div>
          )}
        </div>

        <div className="atlas-v3__intro atlas-v3__overlay" data-focused={Boolean(focusId)}>
          <h1>
            {world === 'origin' ? (
              <>
                Aus Neugier
                <br />
                <em>wird Software.</em>
              </>
            ) : (
              <>
                Ideen bilden
                <br />
                <em>Konstellationen.</em>
              </>
            )}
          </h1>
          <p>
            {world === 'origin'
              ? 'Eine Frage kann alles in Bewegung setzen.'
              : 'Unterschiedliche Projekte. Ein gemeinsamer Ursprung.'}
          </p>
        </div>

        <div className="atlas-v3__world-label atlas-v3__overlay">
          <h2 ref={heading} tabIndex={-1} data-testid="atlas-world-title">
            {definition.title}
          </h2>
          <span>{focus?.title ?? 'Freier Blick'}</span>
        </div>

        {world === 'origin' && (
          <div className="atlas-v3__signal-position atlas-v3__overlay">
            <OriginSignalControls
              onFocus={select}
              travelHref={worldHref(defaultSnapshot('observatory', null))}
              onTravel={(event) => navigateLink(event, 'observatory')}
            />
          </div>
        )}

        <div
          className="atlas-v3__controls atlas-v3__overlay"
          role="group"
          aria-label="Kamera und Verlauf"
        >
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
          <button
            type="button"
            disabled={!supported}
            aria-label="Hineinzoomen"
            onClick={() => void director.bridge()?.dolly(4)}
          >
            +
          </button>
          <button
            type="button"
            disabled={!supported}
            aria-label="Herauszoomen"
            onClick={() => void director.bridge()?.dolly(-4)}
          >
            −
          </button>
        </div>
        <p className="atlas-v3__gesture atlas-v3__overlay">
          Ziehen zum Erkunden <span>· Scrollen oder Pinchen zum Zoomen</span>
        </p>
      </section>

      <section className="atlas-v3__wayfinding" aria-label="Orte und Erklärungen">
        <div className="atlas-v3__wayfinding-intro">
          <p className="atlas-v3__eyebrow">Dein Weg durch den Raum</p>
          <p>{definition.introduction}</p>
          <label className="atlas-v3__motion">
            <input
              type="checkbox"
              name="reduce-camera-motion"
              checked={systemReduced || forceReduced}
              onChange={(event) => setForceReduced(event.target.checked)}
            />
            Kamerafahrten reduzieren
          </label>
        </div>
        <nav className="atlas-v3__places" aria-label="Orte im Raum">
          {definition.hotspots.map((spot) => (
            <a
              key={spot.id}
              href={worldHref(defaultSnapshot(world, spot.id))}
              aria-current={focusId === spot.id ? 'location' : undefined}
              onClick={(event) => navigateLink(event, world, spot.id)}
            >
              <span>
                <strong>{spot.title}</strong>
                <small>{spot.kind}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <div className="atlas-v3__insight" aria-live="polite">
          <p>{focus?.description ?? 'Folge einer Verbindung. Oder finde deinen eigenen Weg.'}</p>
          {(focus?.destination || world === 'origin') && (
            <a
              className="atlas-v3__travel"
              href={worldHref(defaultSnapshot(focus?.destination ?? 'observatory', null))}
              onClick={(event) => navigateLink(event, focus?.destination ?? 'observatory')}
            >
              Weiter zur Sternwarte ↗
            </a>
          )}
        </div>
      </section>

      <output className="atlas-v3__sr" data-testid="atlas-scene-ready" aria-hidden="true">
        {renderedWorld === world ? renderedWorld : ''}
      </output>
      <output className="atlas-v3__sr" data-testid="atlas-pose" aria-hidden="true">
        {JSON.stringify(pose)}
      </output>
      <output className="atlas-v3__sr" data-testid="atlas-history-depth" aria-hidden="true">
        {history.length}
      </output>
      <output className="atlas-v3__sr" data-testid="atlas-transition" aria-hidden="true">
        {transition}
      </output>
      <output className="atlas-v3__sr" data-testid="atlas-motion" aria-hidden="true">
        {motion}
      </output>

      <section className="atlas-v3__projects" id="atlas-projects">
        <div className="atlas-v3__project-heading">
          <h2>
            Die Arbeit
            <br />
            dahinter.
          </h2>
          <p>
            Sieben Fragen, an denen ich arbeite.
            <br />
            Alle Projekte direkt zugänglich.
          </p>
        </div>
        <div className="atlas-v3__project-list">
          {projects.map((project) => (
            <article key={project.id}>
              <span>{project.category}</span>
              <h3 translate="no">{project.name}</h3>
              <p>
                {project.tagline}
                <small>{project.status}</small>
              </p>
              <a href={project.repo}>
                Projekt auf GitHub <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>
      <footer className="atlas-v3__footer">
        <span>YoungJibbit95</span>
        <a href="/#mensch">Über mich</a>
        <a href="https://github.com/YoungJibbit95">Kontakt über GitHub ↗</a>
      </footer>
    </main>
  )
}
