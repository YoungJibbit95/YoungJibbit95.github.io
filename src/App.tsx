import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bug,
  Check,
  ChevronDown,
  Gamepad2,
  GitBranch,
  Heart,
  Maximize2,
  Minimize2,
  Network,
  Orbit,
  Radio,
  Satellite,
  Sparkles,
  Sprout,
  Sun,
  Telescope,
  Trees,
  Waves,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BrandMark } from './components/BrandMark'
import { Header } from './components/Header'
import { Constellation } from './components/Constellation'
import { ProjectVisual } from './components/ProjectVisual'
import { NexusStory } from './components/NexusStory'
import { MotionProvider, useMotion } from './components/MotionProvider'
import { StarfieldBackdrop } from './components/StarfieldBackdrop'
import { GalaxyGuide } from './components/GalaxyGuide'
import { TechSolarSystem } from './components/TechSolarSystem'
import {
  CerebriDeepDive,
  EnginesAndJarvisDeepDive,
  WorkflowStepper,
} from './components/CosmicDeepDives'
import { archiveProjects, featuredIds, getProject, projects, type ProjectId } from './data/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function CosmicPortal({
  depth,
  title,
  theme,
}: {
  depth: string
  title: string
  theme: 'helios' | 'observatory' | 'nebula' | 'pulsar' | 'forge' | 'biosphere'
}) {
  return (
    <div className={`cosmic-portal cosmic-portal--${theme}`} aria-hidden="true" data-stage>
      <div className="portal-beam" />
      <svg className="portal-rings-svg" viewBox="0 0 800 110" preserveAspectRatio="xMidYMid meet">
        <ellipse
          cx="400"
          cy="55"
          rx="320"
          ry="28"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeDasharray="4 8"
        />
        <ellipse
          cx="400"
          cy="55"
          rx="180"
          ry="16"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.52"
        />
        <circle cx="400" cy="55" r="4.5" fill="currentColor" />
      </svg>
      <div className="portal-label">
        <span>{depth}</span>
        <i>·</i>
        <span>{title}</span>
      </div>
    </div>
  )
}

interface GardenSpot {
  id: string
  code: string
  name: string
  subtitle: string
  mapX: number
  mapY: number
  themeColor: 'emerald' | 'cyan' | 'amber' | 'violet'
  headline: string
  description: string
  reflection: string
}

const GARDEN_SPOTS: GardenSpot[] = [
  {
    id: 'tree-of-systems',
    code: 'ORT 01 · DER ALTE LEBENSBAUM',
    name: 'Der Lebensbaum der Systeme',
    subtitle: 'Wurzeln in der Natur · Verzweigung im Kopf',
    mapX: 350,
    mapY: 165,
    themeColor: 'emerald',
    headline: 'Systeme im Kopf. Natur im Blick.',
    description:
      'Unter dem großen Lebensbaum im Zentrum des Gartens laufen beide Welten zusammen: Genauso wie ein Baum über Wurzeln, Stamm und Krone Nährstoffe verteilt, denke ich gern in zusammenhängenden Systemen – brauche aber immer wieder den echten Himmel über mir.',
    reflection:
      '„So paradox es klingt: Wenn es nach mir ginge, würde ich Computer und Internet wieder abschaffen. Obwohl genau das inzwischen mein größter Interessenbereich geworden ist.“',
  },
  {
    id: 'starlight-lake',
    code: 'ORT 02 · DER SPIEGELNDE STERNENSEE',
    name: 'Der Sternensee der Musik',
    subtitle: '01 / MUSIK · Klangwellen auf ruhigem Wasser',
    mapX: 165,
    mapY: 245,
    themeColor: 'cyan',
    headline: 'Eine andere Art von Verbindung.',
    description:
      'Am Ufer des stillen Sees spiegeln sich die Sterne als konzentrische Klangwellen. Musik begleitet mich beim Denken, beim Abschalten und immer dann, wenn Sprache oder Code allein nicht ausreichen.',
    reflection:
      'Rhythmus, Atmosphäre und Resonanz – wie eine gute Architektur lebt auch Musik von Spannung, Ruhe und dem richtigen Zusammenspiel.',
  },
  {
    id: 'crystal-clearing',
    code: 'ORT 03 · DIE LATERNE DER WELTEN',
    name: 'Der Pavillon der digitalen Welten',
    subtitle: '02 / GAMING · In andere Welten eintauchen',
    mapX: 545,
    mapY: 155,
    themeColor: 'violet',
    headline: 'In andere Welten eintauchen – und verstehen, wie sie gebaut sind.',
    description:
      'Auf der erhöhten Steinlichtung blickt man durch ein altes Teleskop in fremde Welten. Aus meiner Begeisterung für Spiele ist der Wunsch entstanden, mit NovaCore, Nemisis, Adventura und YjsE eigene Welten von Grund auf zu erschaffen.',
    reflection:
      'Spiele waren für mich schon früh der Auslöser zu fragen: Wie entsteht eigentlich das Gefühl von Raum, Bewegung und Atmosphäre?',
  },
  {
    id: 'botanical-grove',
    code: 'ORT 04 · DAS GEWÄCHSHAUS & KRÄUTERBEET',
    name: 'Der Garten des geduldigen Wachstums',
    subtitle: '03 / CANNABISANBAU & NATUR · Etwas wachsen lassen',
    mapX: 520,
    mapY: 265,
    themeColor: 'emerald',
    headline: 'Auch mal etwas wachsen lassen, das keinen Compiler kennt.',
    description:
      'Im warm beleuchteten Gewächshaus und unter freiem Himmel zählt kein schneller Commit, sondern Geduld: Licht, Erde, Wasser und Zeit. Cannabisanbau und Zeit in der Natur erden mich und zeigen mir einen Rhythmus jenseits digitaler Taktung.',
    reflection:
      'In der Natur lässt sich nichts erzwingen – man schafft gute Bedingungen und beobachtet aufmerksam, wie sich Leben entwickelt.',
  },
  {
    id: 'quiet-campfire',
    code: 'ORT 05 · DIE STILLE UFERBANK',
    name: 'Die Feuerstelle ohne Bildschirme',
    subtitle: '04 / OFFLINE & FRIEDEN · Manchmal lieber offline',
    mapX: 205,
    mapY: 132,
    themeColor: 'amber',
    headline: 'Ich mag die Natur. Und wünsche mir eine friedlichere Welt.',
    description:
      'Abseits der Pfade brennt ein ruhiges kleines Feuer unter den Kiefern. Kein Terminal, keine Benachrichtigung – nur Stille, frische Luft und der Blick in die Sterne.',
    reflection:
      'Die beste Technik ist die, die dem Menschen dient und ihm am Ende mehr Ruhe und Zeit für das echte Leben lässt.',
  },
]

function Portfolio() {
  const root = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<ProjectId>('nexus')
  // Ebene 02: Star System Zoom & Selected Info-Planet
  const [isStarSystemZoomed, setIsStarSystemZoomed] = useState<boolean>(true)
  const [selectedOrbitNodeIndex, setSelectedOrbitNodeIndex] = useState<number>(0) // 0 = Central Star Core, 1..N = Orbiting Info Planets

  // Ebene 08: Cosmic Garden Map & Zoom
  const [selectedGardenId, setSelectedGardenId] = useState<string>('tree-of-systems')
  const [isGardenZoomed, setIsGardenZoomed] = useState<boolean>(false)

  const { mode, motion, setMode } = useMotion()
  const project = getProject(selected)

  const activeGardenIndex = GARDEN_SPOTS.findIndex((g) => g.id === selectedGardenId)
  const activeGarden = GARDEN_SPOTS[activeGardenIndex] ?? GARDEN_SPOTS[0]

  // Build orbiting info-planets dynamically for the active Project Star in Ebene 02
  const starSystemPlanets = [
    {
      index: 1,
      type: 'LEITFRAGE-PLANET',
      name: 'Ursprung & Leitfrage',
      shortLabel: 'Leitfrage',
      detail: project.question,
      orbitRadiusX: 142,
      orbitRadiusY: 86,
      angleDeg: 315,
      color: 'cyan',
    },
    ...project.stack.map((tech, idx) => {
      const angles = [25, 110, 195, 250, 65]
      const ring = idx < 2 ? 1 : 2
      return {
        index: idx + 2,
        type: `TECH-TRABANT 0${idx + 1}`,
        name: `${tech} im Einsatz`,
        shortLabel: tech,
        detail: `${tech} bildet einen tragenden Baustein im Sternensystem von ${project.name} (${project.category}).`,
        orbitRadiusX: ring === 1 ? 198 : 268,
        orbitRadiusY: ring === 1 ? 118 : 158,
        angleDeg: angles[idx % angles.length],
        color: idx % 2 === 0 ? 'solar' : 'violet',
      }
    }),
    {
      index: project.stack.length + 2,
      type: 'AUSSENPOSTEN · STATUS',
      name: `Status: ${project.status}`,
      shortLabel: project.status,
      detail: `${project.tagline} – Direkt im GitHub-Repository dokumentiert und einsehbar.`,
      orbitRadiusX: 308,
      orbitRadiusY: 182,
      angleDeg: 152,
      color: 'green',
    },
  ]

  const activeOrbitPlanet =
    selectedOrbitNodeIndex === 0
      ? null
      : (starSystemPlanets.find((p) => p.index === selectedOrbitNodeIndex) ?? starSystemPlanets[0])

  const handleSelectProjectStar = (id: ProjectId) => {
    setSelected(id)
    setSelectedOrbitNodeIndex(0)
    setIsStarSystemZoomed(true)
  }

  useGSAP(
    () => {
      if (motion !== 'full') return
      gsap.from('.hero-copy > *', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'all',
      })
      gsap.from('.constellation', {
        opacity: 0,
        scale: 0.94,
        y: 32,
        duration: 1.25,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
      })

      gsap.utils.toArray<HTMLElement>('[data-stage], [data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 44,
          scale: 0.97,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        const speed = Number(element.dataset.parallax || 24)
        gsap.fromTo(
          element,
          { y: speed },
          {
            y: -speed,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  )

  return (
    <div ref={root} className="galaxy-shell">
      <StarfieldBackdrop />
      <GalaxyGuide />
      <a className="skip-link" href="#inhalt">
        Zum Inhalt
      </a>
      <Header />
      <main id="inhalt">
        {/* EBENE 00: DEEP SPACE ORIGIN & CENTERED CONSTELLATION */}
        <section
          className="hero hero--centered section-shell"
          id="start"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy hero-copy--centered">
            <div className="eyebrow eyebrow--centered">
              <span className="signal-dot" /> EBENE 00 · DEEP SPACE URSPRUNG / INDEPENDENT DEVELOPER
            </div>
            <h1 id="hero-title" aria-label="YoungJibbit95. Ich baue, um zu verstehen.">
              <span className="hero-name">
                YoungJibbit95<span className="name-period">.</span>
              </span>
              <span className="hero-statement">
                Ich baue, um <em>zu verstehen.</em>
              </span>
            </h1>
            <p className="hero-intro">
              Ich denke gern in Systemen, finde gern Fehler und lerne, indem ich eigene Software
              baue. Meine Projekte sind ein Stück von mir – und eine Menge offener Fragen.
            </p>
            <div className="hero-actions hero-actions--centered">
              <a className="button button--primary" href="#tech-orbit">
                Reise durch meinen Kosmos starten <Orbit size={18} />
              </a>
              <a className="button button--quiet" href="#projekte">
                Meine Arbeit entdecken <ArrowUpRight size={18} />
              </a>
              <a className="button button--quiet" href="#mensch">
                Der Mensch dahinter <ArrowDown size={18} />
              </a>
            </div>
            <p className="hero-note hero-note--centered">
              WORKSPACES <span>·</span> PLANUNG <span>·</span> ENGINES <span>·</span> EXPERIMENTE
            </p>
            <div className="personal-margin-note personal-margin-note--centered" aria-hidden="true">
              <svg viewBox="0 0 90 52">
                <path d="M5 8Q23 45 79 30M65 24l15 6-12 8" />
              </svg>
              <span>
                Code. Klang. Natur.<small>Auch mal lieber offline.</small>
              </span>
            </div>
          </div>

          <div className="hero-constellation-stage" data-parallax="16">
            <Constellation selected={selected} onSelect={handleSelectProjectStar} />
          </div>

          <a href="#projekte" className="hero-focus hero-focus--centered" aria-live="polite">
            <span className="hero-focus-label">AKTIVER STERN IM ORBIT</span>
            <span>{project.name}</span>
            <span className="hero-focus-description">{project.tagline}</span>
            <ArrowRight size={18} />
          </a>

          <div className="hero-bottom">
            <span>NEUGIER IST DER AUSGANGSPUNKT · EBENE FÜR EBENE DURCH MEINE ARBEIT</span>
            <a href="#tech-orbit">
              WEITER ZU EBENE 01: HELIOSPHÄRE <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <CosmicPortal
          depth="ÜBERGANG · 1.00 AU"
          title="EINTRITT IN DIE HELIOSPHÄRE DES TECH-STACKS"
          theme="helios"
        />

        {/* EBENE 01: HELIOCENTRIC TECH-STACK SOLAR SYSTEM */}
        <TechSolarSystem onSelectProject={handleSelectProjectStar} />

        <CosmicPortal
          depth="ÜBERGANG · 2.40 LY"
          title="ORBITALE STERNWARTE · PROJEKTE ALS EIGENE STERNENSYSTEME"
          theme="observatory"
        />

        {/* EBENE 02: ORBITALE STERNWARTE — INTERACTIVE STAR CLUSTER & ZOOMABLE PROJECT STAR SYSTEM */}
        <section
          className="work work--centered section-shell"
          id="projekte"
          aria-labelledby="work-title"
        >
          <div className="realm-centered-head" data-stage>
            <div className="realm-badge">
              <Satellite size={15} />
              <span>EBENE 02 · ORBITALE STERNWARTE · PROJEKT-STERNENSYSTEME</span>
            </div>
            <h2 id="work-title">
              Was ich baue.
              <br />
              <span className="muted-heading">Und was ich dabei lerne.</span>
            </h2>
            <p className="realm-lead">
              In der <strong>Orbitalen Sternwarte</strong> ist jedes Hauptprojekt ein eigener{' '}
              <strong>leuchtender Stern</strong>. Wenn du auf ein Projekt klickst, zoomt das
              Teleskop in sein <strong>Sternensystem</strong> hinein: Auf dem zentralen Stern liegt
              der Haupt-Infokern, während die umkreisenden Planeten den Tech-Stack, die Leitfrage
              und den Systemstatus tragen.
            </p>
          </div>

          {/* Project Star Selector Tabs (Preserves exact test selectors) */}
          <div
            className="project-tabs project-tabs--centered"
            aria-label="Projekt im Fokus"
            data-stage
          >
            {featuredIds.map((id) => (
              <button
                key={id}
                onClick={() => handleSelectProjectStar(id)}
                aria-pressed={selected === id}
              >
                <span className="tab-dot" />
                {id === 'novacore'
                  ? 'Engines & Welten'
                  : getProject(id)
                      .name.replace(' Ecosystem', '')
                      .replace('Nexus Cerebri', 'Cerebri')}
              </button>
            ))}
          </div>

          {/* INTERACTIVE SPACECRAFT OBSERVATORY & PROJECT STAR SYSTEM MAP */}
          <div className="observatory-star-map-shell" data-stage>
            <div className="observatory-hud-bar">
              <span className="observatory-hud-title">
                <Radio size={15} /> RAUMSONDEN-TELEMETRIE · AKTIVES STERNENSYSTEM:{' '}
                <strong>{project.name.toUpperCase()}</strong>
              </span>
              <div className="observatory-zoom-controls">
                <button
                  type="button"
                  className={`map-zoom-btn ${!isStarSystemZoomed ? 'is-active' : ''}`}
                  onClick={() => setIsStarSystemZoomed(false)}
                >
                  <Minimize2 size={14} /> Sternenhaufen-Karte
                </button>
                <button
                  type="button"
                  className={`map-zoom-btn ${isStarSystemZoomed ? 'is-active' : ''}`}
                  onClick={() => setIsStarSystemZoomed(true)}
                >
                  <Maximize2 size={14} /> Sternensystem {project.name} (Zoom)
                </button>
              </div>
            </div>

            {!isStarSystemZoomed ? (
              /* OVERVIEW: MULTI-STAR SECTOR CLUSTER MAP */
              <div className="sector-cluster-map">
                <svg
                  className="sector-cluster-svg"
                  viewBox="0 0 740 340"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden="true"
                >
                  <circle
                    cx="370"
                    cy="170"
                    r="150"
                    fill="none"
                    stroke="rgba(103, 232, 249, 0.18)"
                    strokeDasharray="4 8"
                  />
                  <path
                    d="M155 155 L310 105 L470 135 L585 205 L310 105"
                    fill="none"
                    stroke="rgba(129, 140, 248, 0.4)"
                    strokeWidth="1.6"
                    strokeDasharray="5 5"
                  />
                </svg>
                {[
                  {
                    id: 'nexus' as ProjectId,
                    x: 22,
                    y: 46,
                    starClass: 'Blauer Überriese · 4 Clients',
                  },
                  {
                    id: 'cerebri' as ProjectId,
                    x: 43,
                    y: 30,
                    starClass: 'Violetter Neutronenstern · Rust',
                  },
                  {
                    id: 'novacore' as ProjectId,
                    x: 65,
                    y: 42,
                    starClass: 'Doppelstern-Schmiede · C++23',
                  },
                  {
                    id: 'jarvis' as ProjectId,
                    x: 79,
                    y: 62,
                    starClass: 'Smaragd-Stern · Python & KI',
                  },
                ].map((starItem) => {
                  const p = getProject(starItem.id)
                  const isCurrent = selected === starItem.id
                  return (
                    <button
                      key={starItem.id}
                      type="button"
                      className={`cluster-star-node ${isCurrent ? 'is-selected' : ''}`}
                      style={{ left: `${starItem.x}%`, top: `${starItem.y}%` }}
                      onClick={() => handleSelectProjectStar(starItem.id)}
                    >
                      <span className="cluster-star-corona" />
                      <span className="cluster-star-core" />
                      <span className="cluster-star-label">
                        <strong>{p.name}</strong>
                        <small>{starItem.starClass} · System öffnen ↗</small>
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* ZOOMED-IN PROJECT STAR SYSTEM: CENTRAL STAR INFO + ORBITING TECH/INFO PLANETS */
              <div className={`zoomed-project-star-system system-theme--${selected}`}>
                <div className="star-system-orrery-stage">
                  <svg
                    className="star-system-svg"
                    viewBox="0 0 700 420"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id="projectStarGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="28%" stopColor="#a5f3fc" />
                        <stop offset="62%" stopColor="#38bdf8" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#090d1a" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Space Telescope Crosshairs & Radar Telemetry */}
                    <line
                      x1="350"
                      y1="15"
                      x2="350"
                      y2="405"
                      stroke="rgba(103, 232, 249, 0.14)"
                      strokeDasharray="3 7"
                    />
                    <line
                      x1="30"
                      y1="210"
                      x2="670"
                      y2="210"
                      stroke="rgba(103, 232, 249, 0.14)"
                      strokeDasharray="3 7"
                    />

                    {/* Planetary Orbits around the Project Star */}
                    <ellipse
                      cx="350"
                      cy="210"
                      rx="142"
                      ry="86"
                      fill="none"
                      stroke="rgba(103, 232, 249, 0.28)"
                      strokeDasharray="4 6"
                    />
                    <ellipse
                      cx="350"
                      cy="210"
                      rx="198"
                      ry="118"
                      fill="none"
                      stroke="rgba(192, 132, 252, 0.25)"
                    />
                    <ellipse
                      cx="350"
                      cy="210"
                      rx="268"
                      ry="158"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.22)"
                      strokeDasharray="6 8"
                    />
                    <ellipse
                      cx="350"
                      cy="210"
                      rx="308"
                      ry="182"
                      fill="none"
                      stroke="rgba(52, 211, 153, 0.2)"
                    />

                    {/* Central Project Star Photosphere */}
                    <circle cx="350" cy="210" r="84" fill="url(#projectStarGlow)" />
                  </svg>

                  {/* CENTRAL PROJECT STAR BUTTON (Holds main project info focus) */}
                  <button
                    type="button"
                    className={`central-project-star-node ${
                      selectedOrbitNodeIndex === 0 ? 'is-active' : ''
                    }`}
                    onClick={() => setSelectedOrbitNodeIndex(0)}
                    aria-label={`Zentraler Stern ${project.name}: Haupt-Projektinfo im Zentrum anzeigen`}
                  >
                    <span className="project-star-flare" />
                    <span className="project-star-kicker">ZENTRALER STERN</span>
                    <strong>{project.name}</strong>
                    <small>{project.category} · Kern-Info</small>
                  </button>

                  {/* ORBITING INFO & TECH-STACK PLANETS */}
                  {starSystemPlanets.map((planet) => {
                    const rad = (planet.angleDeg * Math.PI) / 180
                    const px = 350 + Math.cos(rad) * planet.orbitRadiusX
                    const py = 210 + Math.sin(rad) * planet.orbitRadiusY
                    const leftPct = (px / 700) * 100
                    const topPct = (py / 420) * 100
                    const isSelected = selectedOrbitNodeIndex === planet.index

                    return (
                      <button
                        key={planet.name}
                        type="button"
                        className={`observatory-info-planet observatory-planet--${planet.color} ${
                          isSelected ? 'is-selected' : ''
                        }`}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        onClick={() => setSelectedOrbitNodeIndex(planet.index)}
                        aria-label={`Info-Planet ${planet.shortLabel}: ${planet.detail}`}
                      >
                        <span className="obs-planet-orb" />
                        <span className="obs-planet-label">
                          <small>{planet.type}</small>
                          <strong>{planet.shortLabel}</strong>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Live Telemetry Readout Bar for Selected Star or Orbiting Info-Planet */}
                <div className="star-system-readout-banner" aria-live="polite">
                  {activeOrbitPlanet ? (
                    <div className="readout-banner-inner">
                      <div>
                        <span className="readout-kicker">
                          AKTIVER INFO-PLANET IM ORBIT VON {project.name.toUpperCase()} ·{' '}
                          {activeOrbitPlanet.type}
                        </span>
                        <h4>{activeOrbitPlanet.name}</h4>
                        <p>{activeOrbitPlanet.detail}</p>
                      </div>
                      <button
                        type="button"
                        className="chamber-step-btn"
                        onClick={() => setSelectedOrbitNodeIndex(0)}
                      >
                        <Sun size={15} /> Zurück zum Zentralstern ({project.name})
                      </button>
                    </div>
                  ) : (
                    <div className="readout-banner-inner">
                      <div>
                        <span className="readout-kicker">
                          ZENTRALER PROJEKT-STERN AKTIV · KLICKE AUF DIE UMKREISENDEN PLANETEN FÜR
                          TECH-STACK &amp; DETAILS
                        </span>
                        <h4>
                          {project.name} — {project.tagline}
                        </h4>
                        <p>{project.description}</p>
                      </div>
                      <button
                        type="button"
                        className="chamber-step-btn"
                        onClick={() => setSelectedOrbitNodeIndex(1)}
                      >
                        <Orbit size={15} /> Ersten Info-Planeten ansteuern →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CENTRAL STAR CORE DOSSIER (Preserves exact heading & test structure) */}
          <article
            className={`project-feature project-feature--centered project-feature--${selected}`}
            aria-label="Projekt im Fokus"
            data-stage
          >
            <ProjectVisual id={selected} />
            <div className="project-feature-copy" aria-live="polite">
              <div className="project-meta">
                <span>{project.category}</span>
                <span className="project-status">
                  <span />
                  {project.status}
                </span>
              </div>
              <h3>{project.name}</h3>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-description">{project.description}</p>
              <div className="project-question">
                <Telescope size={18} strokeWidth={1.5} />
                <p>{project.question}</p>
              </div>
              <ul className="stack-list" aria-label="Technologien">
                {project.stack.map((item, idx) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="stack-planet-chip"
                      onClick={() => {
                        setIsStarSystemZoomed(true)
                        setSelectedOrbitNodeIndex(idx + 2)
                      }}
                    >
                      <Orbit size={13} /> {item}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="project-links">
                {selected === 'nexus' && (
                  <a className="case-study-link" href="#nexus-geschichte">
                    Die Geschichte dahinter <ArrowRight size={17} />
                  </a>
                )}
                {selected === 'cerebri' && (
                  <a className="case-study-link" href="#cerebri-system">
                    Im Wurmloch-Uhrwerk testen <ArrowRight size={17} />
                  </a>
                )}
                {(selected === 'novacore' || selected === 'nemisis') && (
                  <a className="case-study-link" href="#engines-welten">
                    In der Welten-Schmiede öffnen <ArrowRight size={17} />
                  </a>
                )}
                {selected === 'jarvis' && (
                  <a className="case-study-link" href="#jarvis-system">
                    Im Gehirn-Galaxie-Kortex testen <ArrowRight size={17} />
                  </a>
                )}
                <a href={project.repo} target="_blank" rel="noopener noreferrer">
                  <GitBranch size={16} /> Repository <ArrowUpRight size={16} />
                </a>
                {project.site && (
                  <a href={project.site} target="_blank" rel="noopener noreferrer">
                    Produktwebsite <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
          </article>

          <div className="project-collection" data-stage>
            <div className="collection-heading">
              <h3>Weitere Welten, weitere Fragen.</h3>
              <span className="eyebrow">TRABANTEN &amp; SANDBOX-WELTEN</span>
            </div>
            <div className="project-grid">
              {projects
                .filter((item) => ['nemisis', 'adventura', 'yjse'].includes(item.id))
                .map((item, index) => (
                  <a
                    className="project-card"
                    key={item.id}
                    href={item.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="card-index">
                      0{index + 1}
                      <ArrowUpRight size={20} />
                    </span>
                    <h4>{item.name}</h4>
                    <p>{item.tagline}</p>
                    <span className="card-stack">{item.stack.join(' / ')}</span>
                  </a>
                ))}
            </div>
          </div>

          <details className="project-archive" data-stage>
            <summary>
              <span>Auch kleine Projekte waren ein Anfang.</span>
              <span className="archive-label">
                FRÜHE EXPERIMENTE <ChevronDown size={17} />
              </span>
            </summary>
            <div>
              {archiveProjects.map((item) => (
                <a key={item.name} href={item.repo} target="_blank" rel="noopener noreferrer">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
          </details>
        </section>

        <CosmicPortal
          depth="ÜBERGANG · 4.20 KPC"
          title="SPIRALGALAXIE NGC-NEXUS · DREI PULSARE AUF @NEXUS/CORE"
          theme="nebula"
        />

        {/* EBENE 03: NEXUS ECOSYSTEM SPIRAL GALAXY & 3 PULSARS */}
        <NexusStory />

        <CosmicPortal
          depth="ÜBERGANG · 7.80 KPC"
          title="WURMLOCH-CHRONOMETER · EXPLODIERTE ZEITEBENEN IN CEREBRI"
          theme="pulsar"
        />

        {/* EBENE 04: NEXUS CEREBRI WORMHOLE CLOCK & EXPLODED VIEW */}
        <CerebriDeepDive />

        <CosmicPortal
          depth="ÜBERGANG · 12.5 KPC"
          title="EINTRITT IN DIE GEMÜTLICHE WELTEN-SCHMIEDE & NEURAL-GALAXIE"
          theme="forge"
        />

        {/* EBENE 05 & 06: COZY FORGE WORKSHOP & YJARVIS BRAIN-GALAXY */}
        <EnginesAndJarvisDeepDive />

        <CosmicPortal
          depth="ÜBERGANG · 21.0 KPC"
          title="MERIDIAN DER ERKENNTNIS · DENKWEISE & ARBEITSPROZESS"
          theme="observatory"
        />

        {/* EBENE 07: THINKING & 6-STEP WORKFLOW CONSTELLATION */}
        <section
          className="thinking-wrapper section-shell"
          id="denkweise"
          aria-labelledby="thinking-title"
        >
          <div className="realm-centered-head" data-stage>
            <div className="realm-badge">
              <Sparkles size={15} />
              <span>EBENE 07 · MERIDIAN DER DENKWEISE</span>
            </div>
            <h2 id="thinking-title">
              Ich möchte verstehen,
              <br />
              <span className="gradient-text">warum es funktioniert.</span>
            </h2>
            <p className="realm-lead">
              Je größer meine Projekte werden, desto mehr interessiert mich, was um den Code herum
              passiert. Die Struktur. Die Entscheidungen. Die Fehler, die man erst beim zweiten
              Blick findet.
            </p>
            <div className="thinking-signature thinking-signature--centered">
              <Network size={18} />
              <span>VERSTEHEN. PRÜFEN. VERBESSERN.</span>
            </div>
          </div>

          <div className="principles-centered-grid" data-stage>
            {[
              {
                icon: Network,
                title: 'Zusammenhänge sichtbar machen.',
                text: 'Ich denke gern in Systemen. Architektur hilft mir zu verstehen, wie einzelne Teile ein Ganzes ergeben.',
              },
              {
                icon: Bug,
                title: 'Fehler finden. Lösungen bauen.',
                text: 'Mich interessiert, warum etwas scheitert. Ich will Verhalten prüfen und Ursachen verstehen.',
              },
              {
                icon: Check,
                title: 'Entscheidungen nachvollziehbar halten.',
                text: 'Wichtige Grenzen, Tests und Dokumentation helfen mir, meine Arbeit auch später noch zu verstehen.',
              },
            ].map((item, index) => (
              <div className="principle-card-centered" key={item.title}>
                <div className="principle-card-top">
                  <span className="principle-number">0{index + 1}</span>
                  <item.icon size={22} strokeWidth={1.3} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <p className="ai-note ai-note--centered" data-stage>
            Ich nutze KI-Agenten als Werkzeuge für Entwicklung, Tests und Analyse. Ihre Ergebnisse
            müssen zur Architektur passen und überprüfbar bleiben.
          </p>

          <WorkflowStepper />
        </section>

        <CosmicPortal
          depth="ATMOSPHÄREN-LANDUNG · STERNENGARTEN"
          title="WILLKOMMEN IM STERNENGARTEN · DER MENSCH DAHINTER"
          theme="biosphere"
        />

        {/* EBENE 08: DER STERNENGARTEN — INTERACTIVE GARDEN MAP WITH TREE, LAKE & PLACES */}
        <section className="person-section" id="mensch" aria-labelledby="person-title">
          <div className="planetary-horizon-arc" aria-hidden="true" />
          <div className="section-shell person-inner person-inner--centered">
            <div className="person-copy person-copy--centered" data-stage>
              <div className="realm-badge realm-badge--biosphere">
                <Sprout size={15} />
                <span>EBENE 08 · DER STERNENGARTEN · BAUM, SEE &amp; NATUR</span>
              </div>
              <h2 id="person-title">
                Systeme im Kopf.
                <br />
                <span>Natur im Blick.</span>
              </h2>
              <p className="person-lead">Nicht alles passt in ein Repository.</p>
              <p>
                Ich bin wissbegierig, denke gern in Systemen und suche nach Lösungen. Vieles davon
                landet in Software. Aber Musik, Gaming, Cannabisanbau und Zeit in der Natur gehören
                genauso zu mir. <strong>Reise durch die Orte im Sternengarten</strong> – klicke auf
                den <strong>Lebensbaum</strong>, den <strong>spiegelnden See</strong> oder das{' '}
                <strong>Gewächshaus</strong>, um reinzuzoomen.
              </p>
              <blockquote>
                „So paradox es klingt: Wenn es nach mir ginge, würde ich Computer und Internet
                wieder abschaffen. Obwohl genau das inzwischen mein größter Interessenbereich
                geworden ist.“
              </blockquote>
              <p className="peace-note peace-note--centered">
                <Heart size={16} /> Ich mag die Natur. Und wünsche mir eine friedlichere Welt.
              </p>
            </div>

            {/* INTERACTIVE COSMIC GARDEN LANDSCAPE MAP (TREE, LAKE, PAVILION, GREENHOUSE, CAMPFIRE) */}
            <div className="garden-map-shell" data-stage>
              <div className="garden-map-topbar">
                <span className="garden-map-title">
                  <Trees size={16} /> INTERAKTIVE GARTEN-KARTE · AKTIVER ORT:{' '}
                  <strong>{activeGarden.name}</strong>
                </span>
                <div className="garden-zoom-controls">
                  <button
                    type="button"
                    className={`map-zoom-btn ${!isGardenZoomed ? 'is-active' : ''}`}
                    onClick={() => setIsGardenZoomed(false)}
                  >
                    <Minimize2 size={14} /> Garten-Gesamtkarte
                  </button>
                  <button
                    type="button"
                    className={`map-zoom-btn ${isGardenZoomed ? 'is-active' : ''}`}
                    onClick={() => setIsGardenZoomed(true)}
                  >
                    <Maximize2 size={14} /> Ort heranzoomen
                  </button>
                </div>
              </div>

              <div className={`garden-landscape-stage ${isGardenZoomed ? 'is-spot-zoomed' : ''}`}>
                {/* Illustrated Starry Garden Landscape with Ancient Tree, Reflecting Lake, Greenhouse & Hills */}
                <div className="garden-scenic-map">
                  <svg
                    className="garden-scenic-svg"
                    viewBox="0 0 720 380"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="nightGardenSky" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06121c" />
                        <stop offset="55%" stopColor="#0b2429" />
                        <stop offset="100%" stopColor="#0f2e24" />
                      </linearGradient>
                      <radialGradient id="treeCanopyGlow" cx="50%" cy="40%" r="48%">
                        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.65" />
                        <stop offset="48%" stopColor="#10b981" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="starLakeWater" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
                        <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.65" />
                      </linearGradient>
                    </defs>

                    <rect width="720" height="380" rx="22" fill="url(#nightGardenSky)" />

                    {/* Aurora Ribbon in the Night Sky over the Garden */}
                    <path
                      d="M40 75 Q210 25 370 72 T680 58"
                      fill="none"
                      stroke="rgba(110, 231, 183, 0.25)"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    <path
                      d="M70 95 Q250 55 410 92 T660 82"
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.18)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    {/* Rolling Terraced Garden Hills */}
                    <path
                      d="M0 245 Q160 190 350 225 T720 210 L720 380 L0 380 Z"
                      fill="#0b2922"
                      stroke="rgba(110, 231, 183, 0.25)"
                    />
                    <path
                      d="M0 295 Q220 255 430 285 T720 275 L720 380 L0 380 Z"
                      fill="#071f1a"
                      stroke="rgba(52, 211, 153, 0.3)"
                    />

                    {/* Garden Winding Footpaths Connecting All 5 Places */}
                    <path
                      d="M165 265 Q260 245 350 215 T545 175 M350 215 Q440 255 520 275 M205 145 Q280 180 350 215"
                      fill="none"
                      stroke="rgba(253, 230, 138, 0.38)"
                      strokeWidth="2.2"
                      strokeDasharray="5 6"
                    />

                    {/* 1. LEFT-BOTTOM: Der Spiegelnde Sternensee (Lake with Acoustic Ripples) */}
                    <g transform="translate(65, 225)">
                      <ellipse
                        cx="105"
                        cy="48"
                        rx="96"
                        ry="34"
                        fill="url(#starLakeWater)"
                        stroke="#67e8f9"
                        strokeWidth="1.8"
                      />
                      <ellipse
                        cx="105"
                        cy="48"
                        rx="62"
                        ry="19"
                        fill="none"
                        stroke="rgba(224, 242, 254, 0.55)"
                        strokeDasharray="6 6"
                      />
                      <ellipse
                        cx="105"
                        cy="48"
                        rx="28"
                        ry="9"
                        fill="none"
                        stroke="rgba(224, 242, 254, 0.75)"
                      />
                    </g>

                    {/* 2. CENTER: Der Alte Lebensbaum (Ancient Glowing Tree of Systems) */}
                    <g transform="translate(350, 165)">
                      <circle cx="0" cy="-18" r="78" fill="url(#treeCanopyGlow)" />
                      {/* Tree Roots & Trunk */}
                      <path
                        d="M-28 58 Q-8 42 -6 10 L-6 -20 M28 58 Q8 42 6 10 L6 -20 M0 52 L0 -32"
                        fill="none"
                        stroke="#fde68a"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* Glowing Branches */}
                      <path
                        d="M0 -12 Q-28 -32 -46 -26 M0 -22 Q28 -42 48 -30 M0 -28 Q-18 -54 -26 -66 M0 -28 Q18 -54 28 -66"
                        fill="none"
                        stroke="#a7f3d0"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Lush Foliage Canopy Circles */}
                      <circle
                        cx="0"
                        cy="-42"
                        r="44"
                        fill="rgba(16, 185, 129, 0.35)"
                        stroke="#6ee7b7"
                        strokeWidth="2"
                      />
                      <circle
                        cx="-34"
                        cy="-24"
                        r="30"
                        fill="rgba(5, 150, 105, 0.38)"
                        stroke="#34d399"
                        strokeWidth="1.6"
                      />
                      <circle
                        cx="34"
                        cy="-24"
                        r="30"
                        fill="rgba(5, 150, 105, 0.38)"
                        stroke="#34d399"
                        strokeWidth="1.6"
                      />
                    </g>

                    {/* 3. TOP-LEFT: Campfire & Offline Bench */}
                    <g transform="translate(185, 118)">
                      <path d="M8 26 L22 6 L36 26 Z" fill="#fbbf24" />
                      <circle cx="22" cy="18" r="18" fill="rgba(251, 191, 36, 0.25)" />
                    </g>

                    {/* 4. TOP-RIGHT: Crystal World Pavilion */}
                    <g transform="translate(520, 125)">
                      <path
                        d="M5 42 L5 18 L26 4 L47 18 L47 42 Z"
                        fill="rgba(49, 46, 129, 0.65)"
                        stroke="#c084fc"
                        strokeWidth="2"
                      />
                    </g>

                    {/* 5. BOTTOM-RIGHT: Botanical Greenhouse & Herb Terrace */}
                    <g transform="translate(475, 235)">
                      <path
                        d="M10 48 L10 22 Q45 -2 80 22 L80 48 Z"
                        fill="rgba(16, 185, 129, 0.28)"
                        stroke="#6ee7b7"
                        strokeWidth="2"
                      />
                      <line x1="45" y1="10" x2="45" y2="48" stroke="#6ee7b7" strokeWidth="1.5" />
                    </g>
                  </svg>

                  {/* 5 Interactive Place Markers in the Cosmic Garden */}
                  {GARDEN_SPOTS.map((spot) => {
                    const leftPct = (spot.mapX / 720) * 100
                    const topPct = (spot.mapY / 380) * 100
                    const isSelected = spot.id === activeGarden.id

                    return (
                      <button
                        key={spot.id}
                        type="button"
                        className={`garden-spot-marker garden-spot--${spot.themeColor} ${
                          isSelected ? 'is-selected' : ''
                        }`}
                        style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                        onClick={() => {
                          setSelectedGardenId(spot.id)
                          setIsGardenZoomed(true)
                        }}
                        aria-label={`${spot.name} (${spot.subtitle}) – im Sternengarten heranzoomen`}
                      >
                        <span className="firefly-aura" />
                        <span className="firefly-core" />
                        <span className="garden-spot-tag">
                          <small>{spot.code.split('·')[1]?.trim() ?? spot.code}</small>
                          <strong>{spot.name}</strong>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* ZOOMED-IN GARDEN PLACE VIEW */}
                <div className="garden-spot-zoom-card" aria-live="polite">
                  <div className="planet-chamber-topbar">
                    <button
                      type="button"
                      className="chamber-back-btn"
                      onClick={() => setIsGardenZoomed(false)}
                    >
                      <ArrowLeft size={16} /> Zurück zur Garten-Gesamtkarte (Out-Zoom)
                    </button>
                    <div className="chamber-planet-MinimalNav">
                      <button
                        type="button"
                        className="chamber-step-btn"
                        onClick={() => {
                          const prev =
                            (activeGardenIndex - 1 + GARDEN_SPOTS.length) % GARDEN_SPOTS.length
                          setSelectedGardenId(GARDEN_SPOTS[prev].id)
                        }}
                      >
                        <ArrowLeft size={15} /> Vorheriger Ort
                      </button>
                      <span className="chamber-orbit-badge">{activeGarden.code}</span>
                      <button
                        type="button"
                        className="chamber-step-btn"
                        onClick={() => {
                          const next = (activeGardenIndex + 1) % GARDEN_SPOTS.length
                          setSelectedGardenId(GARDEN_SPOTS[next].id)
                        }}
                      >
                        Nächster Ort <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="garden-zoom-body">
                    <div className="garden-zoom-main">
                      <span className="dossier-planet-code">{activeGarden.subtitle}</span>
                      <h3>{activeGarden.headline}</h3>
                      <p className="planet-summary-text">{activeGarden.description}</p>
                    </div>
                    <blockquote className="garden-zoom-quote">
                      <Waves size={18} />
                      <p>{activeGarden.reflection}</p>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            <div className="interests interests--centered" data-stage>
              <button
                type="button"
                className="interest interest--interactive"
                onClick={() => {
                  setSelectedGardenId('starlight-lake')
                  setIsGardenZoomed(true)
                }}
              >
                <AudioLines size={23} />
                <div>
                  <span>01 / MUSIK · AM STERNENSEE</span>
                  <h3>Eine andere Art von Verbindung.</h3>
                </div>
                <div className="mini-wave" aria-hidden="true">
                  {Array.from({ length: 15 }, (_, index) => (
                    <i key={index} style={{ height: `${7 + ((index * 7) % 21)}px` }} />
                  ))}
                </div>
              </button>
              <button
                type="button"
                className="interest interest--interactive"
                onClick={() => {
                  setSelectedGardenId('crystal-clearing')
                  setIsGardenZoomed(true)
                }}
              >
                <Gamepad2 size={23} />
                <div>
                  <span>02 / GAMING · PAVILLON DER WELTEN</span>
                  <h3>In andere Welten eintauchen.</h3>
                </div>
              </button>
              <button
                type="button"
                className="interest interest--interactive"
                onClick={() => {
                  setSelectedGardenId('botanical-grove')
                  setIsGardenZoomed(true)
                }}
              >
                <Sprout size={23} />
                <div>
                  <span>03 / CANNABISANBAU &amp; NATUR · GEWÄCHSHAUS</span>
                  <h3>Auch mal etwas wachsen lassen.</h3>
                </div>
              </button>
              <div className="offline-mark offline-mark--centered">
                <span className="signal-dot" />
                <span>MANCHMAL LIEBER OFFLINE.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact section-shell" aria-labelledby="contact-title" data-stage>
          <span className="eyebrow">DIE NÄCHSTE IDEE IST NOCH OFFEN.</span>
          <h2 id="contact-title">Neugierig geworden?</h2>
          <p>Meine Projekte, Entscheidungen und nächsten Schritte findest du auf GitHub.</p>
          <div className="contact-actions">
            <a
              className="button button--primary"
              href="https://github.com/YoungJibbit95"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitBranch size={18} /> Auf GitHub entdecken <ArrowUpRight size={18} />
            </a>
            <a
              className="button button--quiet"
              href="https://nexusproject.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nexus Produktseite <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <a className="footer-brand" href="#start">
          <BrandMark />
          <span>
            YoungJibbit95<small>Aus Neugier wird Software.</small>
          </span>
        </a>
        <label className="motion-control">
          Bewegung{' '}
          <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="auto">Systemeinstellung</option>
            <option value="full">Voll</option>
            <option value="reduced">Reduziert</option>
            <option value="off">Aus</option>
          </select>
        </label>
        <a className="back-to-top" href="#start">
          ZUM ANFANG <ArrowUpRight size={15} />
        </a>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <Portfolio />
    </MotionProvider>
  )
}
