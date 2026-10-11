import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  DEFAULT_POSE,
  FOCUS_POINTS,
  compactPose,
  type CameraPose,
  type PointId,
} from './cameraModel'
import type { CameraRigHandle } from './cameraTypes'

const Scene = lazy(() => import('./SpikeScene'))

class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

type Ability = 'checking' | 'supported' | 'fallback'

function inspectWebGL2(): boolean {
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Progressive enhancement: no Canvas import until the browser passes WebGL2 detection. */
export default function SpikeApp() {
  const [ability, setAbility] = useState<Ability>('checking')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [selected, setSelected] = useState<PointId | null>(null)
  const [pose, setPose] = useState<CameraPose>(DEFAULT_POSE)
  const [failed, setFailed] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [savedPose, setSavedPose] = useState<CameraPose | null>(null)
  const rig = useRef<CameraRigHandle>(null)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    setAbility(inspectWebGL2() ? 'supported' : 'fallback')
    return () => preference.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    function backWithEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }
      void rig.current?.back()
    }
    document.addEventListener('keydown', backWithEscape)
    return () => document.removeEventListener('keydown', backWithEscape)
  }, [])

  const renderScene = ability === 'supported' && !failed
  const canExplore = renderScene && sceneReady
  const active = FOCUS_POINTS.find((point) => point.id === selected)

  function select(point: PointId) {
    setSelected(point)
    void rig.current?.focus(point)
  }

  function navigateStage(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return
    const steps: Record<string, readonly [number, number]> = {
      ArrowLeft: [-1.2, 0],
      ArrowRight: [1.2, 0],
      ArrowUp: [0, 1.2],
      ArrowDown: [0, -1.2],
    }
    const step = steps[event.key]
    if (step && canExplore) {
      event.preventDefault()
      void rig.current?.pan(step[0], step[1])
    }
  }

  return (
    <main className="spike-app">
      <header className="site-header">
        <a className="brand" href="https://github.com/YoungJibbit95">
          YoungJibbit95<span className="brand-stop">.</span>
        </a>
        <span className="header-note">EIN RAUM AUS NEUGIER</span>
        <a className="quiet-link" href="https://github.com/YoungJibbit95">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <p className="eyebrow">EXPLORATION / 001</p>
        <h1 id="intro-title">
          Der Raum
          <br />
          <em>antwortet.</em>
        </h1>
        <p className="intro-copy">
          Dinge werden klarer, wenn man ihren Verbindungen folgt.
          <span> Ziehen, ansteuern, einen neuen Blick gewinnen.</span>
        </p>
      </section>

      <section className="atlas-layout" aria-label="Kameratest und räumliche Verbindungen">
        <div className="viewport-shell">
          <div
            className="spatial-stage"
            role="region"
            tabIndex={0}
            aria-label="Dreidimensionalen Raum mit Pfeiltasten verschieben"
            onKeyDown={navigateStage}
          >
            {renderScene ? (
              <SceneErrorBoundary onError={() => setFailed(true)}>
                <Suspense
                  fallback={
                    <div className="fallback" role="status">
                      Der Raum öffnet sich. Alle Orte sind rechts erreichbar.
                    </div>
                  }
                >
                  <Scene
                    ref={rig}
                    reducedMotion={reducedMotion}
                    onPose={setPose}
                    onSelection={setSelected}
                    onSavedPose={setSavedPose}
                    onReady={() => setSceneReady(true)}
                    onWebGLFailure={() => setFailed(true)}
                  />
                </Suspense>
              </SceneErrorBoundary>
            ) : (
              <div className="fallback" role="status">
                {ability === 'checking'
                  ? 'Räumliche Ansicht wird geprüft …'
                  : 'Die räumliche Ansicht ist nicht verfügbar. Alle Testorte und Links bleiben unten lesbar.'}
              </div>
            )}
            <div className="stage-top" aria-hidden="true">
              <span>ATLAS / TESTRAUM</span>
              <span>X · Y · Z / UNBEGRENZTE IDEEN</span>
            </div>
            <div className="stage-bottom" aria-hidden="true">
              <span>DRAG TO EXPLORE</span>
              <span className="stage-crosshair">✦</span>
              <span>SCROLL TO ZOOM</span>
            </div>
          </div>
          <div className="stage-toolbar" role="group" aria-label="Kamerasteuerung">
            <p>Ziehen / Umsehen / Fokus</p>
            <div className="stage-buttons">
              <button type="button" onClick={() => void rig.current?.back()} disabled={!canExplore}>
                ↶ Zurück
              </button>
              <button
                type="button"
                onClick={() => void rig.current?.reset()}
                disabled={!canExplore}
              >
                Übersicht
              </button>
              <button
                type="button"
                aria-label="Hineinzoomen"
                disabled={!canExplore}
                onClick={() => void rig.current?.dolly(2)}
              >
                +
              </button>
              <button
                type="button"
                aria-label="Herauszoomen"
                disabled={!canExplore}
                onClick={() => void rig.current?.dolly(-2)}
              >
                −
              </button>
            </div>
          </div>
        </div>

        <aside className="navigation-panel" aria-label="Orte, Funktion und Kamerakoordinaten">
          <div>
            <p className="eyebrow">01 / RAUMPUNKTE</p>
            <h2>
              Drei Anker.
              <br />
              Ein Zusammenhang.
            </h2>
            <p className="navigation-copy">
              Jeder Ort liegt in echter Tiefe. Beim Anfahren bleibt dein letzter Blickwinkel
              gespeichert.
            </p>
          </div>
          <nav aria-label="Räumliche Ziele" className="locations">
            {FOCUS_POINTS.map((point, index) => (
              <button
                type="button"
                key={point.id}
                className={`location ${selected === point.id ? 'active' : ''}`}
                aria-pressed={selected === point.id}
                onClick={() => select(point.id)}
              >
                <span className="location-number">0{index + 1}</span>
                <span className="location-label">
                  <strong>{point.label}</strong>
                  <small>{point.kind}</small>
                </span>
                <span className="location-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </nav>
          <div className="observation" aria-live="polite">
            <span className="eyebrow">WAS HAT SICH VERÄNDERT?</span>
            <p>
              {active?.explanation ??
                'Ziehen verschiebt die Perspektive. Ein gewähltes Objekt verändert den Kamerastandort.'}
            </p>
          </div>
          <div className="camera-readout">
            <span className="eyebrow">ECHTE KAMERAPOSE</span>
            <output data-testid="camera-pose" aria-label="Aktuelle Kamerakoordinaten">
              {compactPose(pose)}
            </output>
            <output hidden aria-hidden="true" data-testid="saved-pose">
              {savedPose ? compactPose(savedPose) : ''}
            </output>
          </div>
          <div
            className="alternative-controls"
            role="group"
            aria-label="Tastatur- und Touch-Alternative"
          >
            <button
              disabled={!canExplore}
              aria-label="Kamera nach links bewegen"
              onClick={() => void rig.current?.pan(-1.2, 0)}
            >
              ←
            </button>
            <button
              disabled={!canExplore}
              aria-label="Kamera nach oben bewegen"
              onClick={() => void rig.current?.pan(0, 1.2)}
            >
              ↑
            </button>
            <button
              disabled={!canExplore}
              aria-label="Kamera nach unten bewegen"
              onClick={() => void rig.current?.pan(0, -1.2)}
            >
              ↓
            </button>
            <button
              disabled={!canExplore}
              aria-label="Kamera nach rechts bewegen"
              onClick={() => void rig.current?.pan(1.2, 0)}
            >
              →
            </button>
          </div>
          <label className="motion-switch">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => setReducedMotion(event.target.checked)}
            />
            Kamerafahrten reduzieren
          </label>
        </aside>
      </section>

      <footer className="site-footer">
        <span>Ein Experiment mit echten Koordinaten. Keine Live-Produktaussagen.</span>
        <a href="https://github.com/YoungJibbit95">Projekte entdecken ↗</a>
      </footer>
    </main>
  )
}
