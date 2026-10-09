import { useId, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  FileText,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  Radio,
} from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion } from './MotionProvider'
import { ProjectVisual } from './ProjectVisual'

gsap.registerPlugin(ScrollTrigger)

const chapters = [
  {
    label: 'Der Anfang',
    heading: 'Ein Gedanke braucht einen Ort.',
    text: 'Ich wollte einen Workspace, in dem Ideen, Notizen und die nächste Aufgabe zusammengehören. Nexus beginnt für mich mit dieser einfachen Frage: Wie behalte ich den Zusammenhang, während aus einer Idee Arbeit wird?',
    decision: 'Ein lokaler Ausgangspunkt. Gedanken festhalten, lesen und wiederfinden.',
    image: '/media/nexus/notes.png',
    alt: 'Nexus Main v6 Beta: Notizenansicht mit Markdown-Guide, Navigation und Vorschau',
    view: 'Notes / Wissen festhalten',
    note: 'Hier fängt vieles an.',
    icon: FileText,
    pulsarCode: 'PSR J01-NOTES',
    pulsarName: 'Millisekunden-Leuchtturm · Ursprung',
    pulsarClass: 'Schnellrotierender Synchrotron-Pulsar',
    spinPeriod: '1.39 ms (719 Hz)',
    magneticField: '4.2 × 10⁸ Gauss',
    beamAngle: '-28deg',
    themeColor: 'cyan',
    galaxyX: 215,
    galaxyY: 162,
  },
  {
    label: 'Zusammenhang',
    heading: 'Aus einzelnen Teilen wird ein Arbeitsraum.',
    text: 'Eine Notiz, eine Aufgabe und die zuletzt bearbeitete Datei erzählen oft dieselbe Geschichte. Mich interessiert, wie eine Oberfläche diesen Kontext sichtbar macht. Das Dashboard bringt die verschiedenen Bereiche an einem Ausgangspunkt zusammen.',
    decision: 'Orientierung vor Funktionsmenge. Den nächsten Einstieg verständlich machen.',
    image: '/media/nexus/dashboard.png',
    alt: 'Nexus Main v6 Beta: Dashboard mit Today Layer, zuletzt bearbeiteten Inhalten und Workspace-Übersicht',
    view: 'Dashboard / Kontext wiederfinden',
    note: 'Die Verbindung ist die Idee.',
    icon: Network,
    pulsarCode: 'PSR J02-CONTEXT',
    pulsarName: 'Doppel-Resonanz-Pulsar · Kontext',
    pulsarClass: 'Binärer Resonanz-Pulsar mit Akkretionsring',
    spinPeriod: '28.4 ms (35.2 Hz)',
    magneticField: '1.8 × 10¹¹ Gauss',
    beamAngle: '18deg',
    themeColor: 'violet',
    galaxyX: 450,
    galaxyY: 148,
  },
  {
    label: 'Gemeinsamer Kern',
    heading: 'Die Oberfläche braucht eine gemeinsame Grundlage.',
    text: 'Mit mehreren Clients wird aus Gestaltung auch eine Architekturfrage. Main, Mobile, Code und Code Mobile teilen mit @nexus/core eine Grundlage für Runtime, Rendering und Bewegung. Daran lerne ich, wie größere Systeme verständlich zusammenbleiben.',
    decision:
      'Gemeinsame Regeln, eigene Oberflächen. Die Unterschiede der Plattformen bleiben bewusst.',
    image: null,
    alt: '',
    view: 'Architektur / Vier Clients, ein Runtime-Kern',
    note: 'Zusammenhänge bis in den Code.',
    icon: Layers,
    pulsarCode: 'PSR J03-CORE',
    pulsarName: 'Hochfeld-Magnetar · @nexus/core',
    pulsarClass: 'Zentraler Architektur-Magnetar (4 Client-Strahlen)',
    spinPeriod: '2.14 s (0.47 Hz)',
    magneticField: '8.5 × 10¹⁴ Gauss',
    beamAngle: '-12deg',
    themeColor: 'gold',
    galaxyX: 350,
    galaxyY: 220,
  },
]

export function NexusStory() {
  const [chapter, setChapter] = useState(0)
  const [isPulsarZoomed, setIsPulsarZoomed] = useState(true)
  const { motion } = useMotion()
  const root = useRef<HTMLDivElement>(null)
  const contentId = `nexus-story-${useId().replaceAll(':', '')}`
  const current = chapters[chapter]

  useGSAP(
    () => {
      if (motion !== 'full') return
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!.querySelector('.story-body'),
          start: 'top 82%',
          once: true,
        },
      })
      timeline.from('.story-chapter-copy', {
        y: 13,
        opacity: 0,
        duration: 0.45,
        clearProps: 'all',
        ease: 'power2.out',
      })
      timeline.from(
        '.story-media',
        {
          y: 19,
          rotation: -0.7,
          scale: 0.97,
          opacity: 0.4,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'all',
        },
        0,
      )
      timeline.from(
        '.context-node',
        {
          y: 16,
          scale: 0.9,
          opacity: 0,
          duration: 0.55,
          stagger: 0.12,
          clearProps: 'all',
          ease: 'power3.out',
        },
        0.12,
      )
      gsap.utils
        .toArray<SVGPathElement>('.context-line, .story-system .nexus-wires path')
        .forEach((path) => {
          const length = path.getTotalLength()
          timeline.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: 0.9,
              clearProps: 'strokeDasharray,strokeDashoffset',
              ease: 'power2.inOut',
            },
            0.2,
          )
        })
      if (chapter === 2) {
        timeline.from(
          '.story-system .client',
          { y: 22, opacity: 0, duration: 0.6, stagger: 0.1, clearProps: 'all', ease: 'power3.out' },
          0.15,
        )
      }
    },
    { scope: root, dependencies: [chapter, motion], revertOnUpdate: true },
  )

  const handleSelectPulsar = (idx: number) => {
    setChapter(idx)
    setIsPulsarZoomed(true)
  }

  return (
    <section
      ref={root}
      className="nexus-story cosmic-realm realm--nebula section-shell"
      id="nexus-geschichte"
      aria-labelledby="nexus-story-title"
    >
      <header className="story-heading story-heading--centered" data-stage>
        <div className="realm-badge realm-badge--nebula">
          <Radio size={15} />
          <span>EBENE 03 · SPIRALGALAXIE NGC-NEXUS · DREI PULSARE IM KERN</span>
        </div>
        <h2 id="nexus-story-title">
          Nexus.
          <span>Eine Galaxie aus drei leuchtenden Pulsaren.</span>
        </h2>
        <div className="story-introduction story-introduction--centered">
          <span className="handwritten">Mein langfristiges Experiment.</span>
          <p>
            In der <strong>Nexus-Spiralgalaxie</strong> markieren drei Pulsare die entscheidenden
            Entwicklungsschritte: vom ersten Gedanken über den gemeinsamen Kontext bis zum
            geteilten Runtime-Kern <code>@nexus/core</code>. Klicke auf einen Pulsar in der Galaxie,
            um auf den echten rotierenden Neutronenstern und sein Info-Board reinzuzoomen.
          </p>
          <dl className="story-facts story-facts--centered">
            <div>
              <dt>Galaktischer Sektor</dt>
              <dd>NGC-NEXUS · 3 Pulsare</dd>
            </div>
            <div>
              <dt>Mein Fokus</dt>
              <dd>Design · Clients · Runtime</dd>
            </div>
            <div>
              <dt>Richtung</dt>
              <dd>Local-first Workspace</dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Chapter / Pulsar Navigation Bar (Preserves exact test selectors) */}
      <div
        className="story-navigation story-navigation--centered"
        role="group"
        aria-label="Kapitel der Nexus-Geschichte"
        data-stage
      >
        {chapters.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={chapter === index}
            aria-controls={contentId}
            onClick={() => handleSelectPulsar(index)}
          >
            <span className="chapter-number">0{index + 1}</span>
            <span>{item.label}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>

      {/* INTERACTIVE SPIRAL GALAXY MAP WITH 3 CLICKABLE PULSARS */}
      <div className="nexus-galaxy-map-shell" data-stage>
        <div className="galaxy-map-topbar">
          <span className="galaxy-map-title">
            <Compass size={15} /> SPIRALGALAXIE-KARTE · AKTIVER PULSAR:{' '}
            <strong>
              {current.pulsarCode} ({current.label})
            </strong>
          </span>
          <div className="galaxy-zoom-controls">
            <button
              type="button"
              className={`map-zoom-btn ${!isPulsarZoomed ? 'is-active' : ''}`}
              onClick={() => setIsPulsarZoomed(false)}
            >
              <Minimize2 size={14} /> Galaxie-Übersicht
            </button>
            <button
              type="button"
              className={`map-zoom-btn ${isPulsarZoomed ? 'is-active' : ''}`}
              onClick={() => setIsPulsarZoomed(true)}
            >
              <Maximize2 size={14} /> Pulsar-Zoom aktiv
            </button>
          </div>
        </div>

        <div className={`nexus-galaxy-canvas-stage ${isPulsarZoomed ? 'is-pulsar-zoomed' : ''}`}>
          {/* Full Spiral Galaxy SVG Map */}
          <svg
            className="nexus-spiral-galaxy-svg"
            viewBox="0 0 700 340"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="galacticCoreBulge" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="22%" stopColor="#fde68a" stopOpacity="0.78" />
                <stop offset="52%" stopColor="#38bdf8" stopOpacity="0.32" />
                <stop offset="82%" stopColor="#818cf8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#090d1a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="spiralArmGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="spiralArmGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#fde047" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Galactic Halo & Spiral Arms */}
            <ellipse cx="350" cy="180" rx="285" ry="125" fill="url(#galacticCoreBulge)" />
            <path
              d="M350 180 C395 140, 485 118, 565 165 C620 200, 580 278, 460 292 C310 308, 155 260, 120 185"
              fill="none"
              stroke="url(#spiralArmGradA)"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d="M350 180 C305 220, 215 242, 135 195 C80 160, 120 82, 240 68 C390 52, 545 100, 580 175"
              fill="none"
              stroke="url(#spiralArmGradB)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Secondary Star-Forming Dust Lanes */}
            <path
              d="M195 155 Q350 92 505 152"
              fill="none"
              stroke="rgba(103, 232, 249, 0.45)"
              strokeWidth="1.8"
              strokeDasharray="4 6"
            />
            <path
              d="M215 162 L350 220 L450 148"
              fill="none"
              stroke="rgba(192, 132, 252, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="3 5"
            />
          </svg>

          {/* 3 Clickable Pulsar Markers inside the Spiral Galaxy */}
          {chapters.map((item, idx) => {
            const leftPct = (item.galaxyX / 700) * 100
            const topPct = (item.galaxyY / 340) * 100
            const active = chapter === idx
            return (
              <button
                key={item.pulsarCode}
                type="button"
                className={`galaxy-pulsar-marker galaxy-pulsar-marker--${item.themeColor} ${
                  active ? 'is-active' : ''
                }`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                onClick={() => handleSelectPulsar(idx)}
                aria-label={`Pulsar 0${idx + 1} ${item.label} (${item.pulsarCode}) anwählen und reinzoomen`}
              >
                <span className="pulsar-marker-jet pulsar-marker-jet--top" />
                <span className="pulsar-marker-jet pulsar-marker-jet--bottom" />
                <span className="pulsar-marker-ring" />
                <span className="pulsar-marker-core" />
                <span className="pulsar-marker-tag">
                  <strong>0{idx + 1} · {item.label}</strong>
                  <small>{item.pulsarCode}</small>
                </span>
              </button>
            )
          })}
        </div>

        {/* REALISTIC ZOOMED-IN PULSAR ENGINE STAGE (Directly below/coupled with the active Pulsar) */}
        <div
          className={`zoomed-pulsar-observatory zoomed-pulsar--${current.themeColor} ${
            isPulsarZoomed ? 'is-expanded' : ''
          }`}
        >
          <div className="pulsar-visualizer-column">
            <div className="realistic-pulsar-rig">
              {/* Relativistic Lighthouse Beams */}
              <div
                className="pulsar-radiation-cone pulsar-radiation-cone--north"
                style={{ transform: `translate(-50%, -100%) rotate(${current.beamAngle})` }}
              />
              <div
                className="pulsar-radiation-cone pulsar-radiation-cone--south"
                style={{ transform: `translate(-50%, 0%) rotate(${current.beamAngle})` }}
              />
              {/* Magnetic Dipole Field Loops */}
              <div className="pulsar-dipole-loop pulsar-dipole-loop--left" />
              <div className="pulsar-dipole-loop pulsar-dipole-loop--right" />
              <div className="pulsar-equatorial-disc" />
              {/* Super-Dense Neutron Star Core */}
              <div className="pulsar-neutron-sphere">
                <span className="pulsar-core-flare" />
              </div>
            </div>

            <div className="pulsar-telemetry-strip">
              <div>
                <span>PULSAR-KENNUNG</span>
                <strong>{current.pulsarCode}</strong>
              </div>
              <div>
                <span>KLASSE</span>
                <strong>{current.pulsarClass}</strong>
              </div>
              <div>
                <span>ROTATIONSPERIODE</span>
                <strong>{current.spinPeriod}</strong>
              </div>
              <div>
                <span>MAGNETFELD</span>
                <strong>{current.magneticField}</strong>
              </div>
            </div>
          </div>

          {/* INDIVIDUALIZED PULSAR INFO-BOARD OVER THE PULSAR */}
          <div className="story-body story-body--pulsar-board" id={contentId}>
            <div className="story-chapter-copy" aria-live="polite">
              <span className="eyebrow story-step-label">
                0{chapter + 1} / 03 · {current.label} · {current.pulsarName}
              </span>
              <h3>{current.heading}</h3>
              <p>{current.text}</p>
              <div className="story-decision">
                <current.icon size={19} strokeWidth={1.4} aria-hidden="true" />
                <div>
                  <span>DIE ENTSCHEIDUNG DAHINTER</span>
                  <p>{current.decision}</p>
                </div>
              </div>
              <div className="story-chapter-actions">
                <button
                  type="button"
                  onClick={() => setChapter(Math.max(0, chapter - 1))}
                  disabled={chapter === 0}
                  aria-label="Vorheriges Nexus-Kapitel"
                >
                  <ArrowLeft size={18} />
                </button>
                <span>
                  0{chapter + 1} <i>/</i> 03
                </span>
                <button
                  type="button"
                  onClick={() => setChapter(Math.min(2, chapter + 1))}
                  disabled={chapter === 2}
                  aria-label="Nächstes Nexus-Kapitel"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className={`story-stage story-stage--${chapter}`}>
              <div
                className="context-map"
                aria-label={
                  chapter === 0
                    ? 'Ein Gedanke wird als Notiz festgehalten'
                    : chapter === 1
                      ? 'Notizen, Aufgaben und Dateien gehören zum selben Arbeitskontext'
                      : 'Vier Clients teilen einen Runtime-Kern'
                }
              >
                <svg viewBox="0 0 660 100" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="context-line"
                    d={
                      chapter === 0
                        ? 'M88 52C215 11 394 77 574 44'
                        : chapter === 1
                          ? 'M88 52C203 12 265 81 330 47S463 21 574 44'
                          : 'M88 52C231 52 437 44 574 44'
                    }
                  />
                </svg>
                <span className="context-node">
                  {chapter === 0 ? 'Gedanke' : chapter === 1 ? 'Notiz' : 'Clients'}
                </span>
                {chapter === 1 && <span className="context-node">Aufgabe</span>}
                <span className="context-node context-node--end">
                  {chapter === 0 ? 'Notiz' : chapter === 1 ? 'Kontext' : '@nexus/core'}
                </span>
              </div>
              <figure className="story-capture">
                <div className="capture-corners" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                {current.image ? (
                  <a
                    className="story-media"
                    href={current.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Nexus-Aufnahme in voller Größe öffnen"
                  >
                    <img
                      key={current.image}
                      src={current.image}
                      alt={current.alt}
                      width="1600"
                      height="827"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="capture-open">
                      <ArrowUpRight size={17} aria-hidden="true" /> Aufnahme öffnen
                    </span>
                  </a>
                ) : (
                  <div className="story-media story-system">
                    <ProjectVisual id="nexus" layout="story" />
                  </div>
                )}
                <figcaption>
                  <span>{current.view}</span>
                  <span>{current.image ? 'NEXUS MAIN / v6 BETA' : 'SCHEMATISCHE ARCHITEKTUR'}</span>
                </figcaption>
              </figure>
              <span className="capture-handnote" aria-hidden="true">
                {current.note}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="story-bottom">
        <p>
          Die Aufnahmen zeigen Nexus Main v6 Beta. Den aktuellen Entwicklungsstand dokumentiere ich
          im Repository.
        </p>
        <a
          href="https://github.com/YoungJibbit95/Nexus-Ecosystem"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nexus auf GitHub <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  )
}
