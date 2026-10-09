import { useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Cpu,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Sun,
  Workflow,
} from 'lucide-react'
import type { ProjectId } from '../data/projects'

export interface TechPlanet {
  id: string
  name: string
  shortLabel: string
  planetName: string
  planetClass: string
  ring: 1 | 2 | 3
  ringLabel: string
  angleDeg: number
  color: 'solar' | 'cyan' | 'violet' | 'green'
  surfaceGradient: string
  atmosphereGlow: string
  coreColor: string
  hasPlanetaryRings?: boolean
  ringTiltDeg?: number
  role: string
  summary: string
  architectureWhy: string
  coreLayer: string
  mantleLayer: string
  crustLayer: string
  moons: string[]
  linkedProjectId: ProjectId
  linkedProjectName: string
  repoUrl: string
  orbitPeriod: string
  distanceAu: string
  gravity: string
  surfaceTemp: string
}

const TECH_PLANETS: TechPlanet[] = [
  {
    id: 'typescript',
    name: 'TypeScript & @nexus/core',
    shortLabel: 'TypeScript',
    planetName: 'Aethel-TS · Tektonik-Welt',
    planetClass: 'Goldener Silikat- & Magma-Gesteinsplanet',
    ring: 1,
    ringLabel: 'Innerer Orbit · Workspaces',
    angleDeg: 315,
    color: 'solar',
    surfaceGradient:
      'radial-gradient(circle at 30% 28%, #fff3c4 0%, #f59e0b 38%, #9a3412 74%, #270e05 100%)',
    atmosphereGlow: 'rgba(251, 191, 36, 0.55)',
    coreColor: '#fde047',
    role: 'Gemeinsamer Runtime-Kern & Typgrenzen',
    summary:
      'Das Fundament für das Nexus Ecosystem. TypeScript hält Datenmodelle, Zustand und Schnittstellen zwischen vier verschiedenen Clients konsistent.',
    architectureWhy:
      'Wenn Notizen, Aufgaben, Dateien und Code in einem lokalen System zusammenwachsen, müssen Verträge zwischen Oberfläche und Runtime eindeutig prüfbar sein.',
    coreLayer: 'Strikte Typ-Verträge & Schema-Validierung',
    mantleLayer: '@nexus/core Shared State & Event-Bus',
    crustLayer: 'Synchronisierte Schnittstellen für 4 Clients',
    moons: ['Strict Types', '@nexus/core', 'Shared State', 'Local-First'],
    linkedProjectId: 'nexus',
    linkedProjectName: 'Nexus Ecosystem',
    repoUrl: 'https://github.com/YoungJibbit95/Nexus-Ecosystem',
    orbitPeriod: '88 TAGE · KERNNAH',
    distanceAu: '0.42 AU',
    gravity: '1.18 g',
    surfaceTemp: '1.120 K',
  },
  {
    id: 'react-electron',
    name: 'React · Electron · Capacitor',
    shortLabel: 'React & Electron',
    planetName: 'Hydra-UI · Ozean- & Wolkenwelt',
    planetClass: 'Biolumineszenter Atmosphären-Exoplanet',
    ring: 1,
    ringLabel: 'Innerer Orbit · Workspaces',
    angleDeg: 135,
    color: 'cyan',
    surfaceGradient:
      'radial-gradient(circle at 32% 28%, #e0f2fe 0%, #38bdf8 36%, #0369a1 72%, #082f49 100%)',
    atmosphereGlow: 'rgba(56, 189, 248, 0.58)',
    coreColor: '#7dd3fc',
    role: 'Desktop- & Mobile-Oberflächen',
    summary:
      'Verbindet Nexus Main, Nexus Mobile, Nexus Code und Code Mobile sowie die Oberfläche von YJarvis über einen gemeinsamen gestalterischen Anspruch.',
    architectureWhy:
      'Gemeinsame Regeln im Kern, aber bewusste Oberflächen für Desktop und Mobile – statt einer generischen Hülle für alles.',
    coreLayer: 'Komponenten-Architektur & State-Hooks',
    mantleLayer: 'GSAP Motion-Choreografie & Barrierefreiheit',
    crustLayer: 'Native Desktop (Electron) & Mobile (Capacitor) Brücken',
    moons: ['React 19', 'Electron', 'Capacitor', 'GSAP Motion'],
    linkedProjectId: 'nexus',
    linkedProjectName: 'Nexus Ecosystem',
    repoUrl: 'https://github.com/YoungJibbit95/Nexus-Ecosystem',
    orbitPeriod: '142 TAGE · KERNNAH',
    distanceAu: '0.68 AU',
    gravity: '0.96 g',
    surfaceTemp: '294 K',
  },
  {
    id: 'rust',
    name: 'Rust & Deterministische Planung',
    shortLabel: 'Rust',
    planetName: 'Ferrum-RS · Kristall-Magnetarwelt',
    planetClass: 'Hochdichter Eisen-Amethyst-Planet mit Magnetosphäre',
    ring: 2,
    ringLabel: 'Mittlerer Orbit · Planung & Engines',
    angleDeg: 35,
    color: 'violet',
    surfaceGradient:
      'radial-gradient(circle at 30% 26%, #f3e8ff 0%, #a855f7 40%, #581c87 75%, #1e0936 100%)',
    atmosphereGlow: 'rgba(192, 132, 252, 0.58)',
    coreColor: '#d8b4fe',
    hasPlanetaryRings: true,
    ringTiltDeg: -18,
    role: 'Zeitliche Planung & Typisierte Evidenz',
    summary:
      'In Nexus Cerebri bildet Rust die Grundlage für explizite Fakten, Regeln, begrenzte Suche und klar getrennte Phasen von Vorschlag bis Ausführung.',
    architectureWhy:
      'Ein Planer darf nicht einfach stillschweigend handeln. Rust erzwingt über das Typsystem, dass Vorschlag, Prüfung und Freigabe eigene Grenzen behalten.',
    coreLayer: 'Zero-Cost Ownership & Speichersicherheit',
    mantleLayer: 'Deterministischer Regel-Solver & Zeitfenster-Prüfung',
    crustLayer: 'Typisierte Evidenz-Begründung vor jeder Freigabe',
    moons: ['Ownership', 'Typisierte Evidenz', 'Begrenzte Suche', 'Regelwerk'],
    linkedProjectId: 'cerebri',
    linkedProjectName: 'Nexus Cerebri',
    repoUrl: 'https://github.com/YoungJibbit95/Nexus-Cerebri',
    orbitPeriod: '310 TAGE · SYSTEMKERN',
    distanceAu: '1.15 AU',
    gravity: '1.64 g',
    surfaceTemp: '410 K',
  },
  {
    id: 'cpp23',
    name: 'C++23 & Modulare Engine-Architektur',
    shortLabel: 'C++23',
    planetName: 'Nova-Prime · Schwerer Ringplanet',
    planetClass: 'Super-Massiver Erzkern-Planet mit Doppelring',
    ring: 2,
    ringLabel: 'Mittlerer Orbit · Planung & Engines',
    angleDeg: 200,
    color: 'solar',
    surfaceGradient:
      'radial-gradient(circle at 28% 28%, #ffedd5 0%, #fb923c 38%, #9a3412 74%, #290f04 100%)',
    atmosphereGlow: 'rgba(251, 146, 60, 0.56)',
    coreColor: '#fdba74',
    hasPlanetaryRings: true,
    ringTiltDeg: 22,
    role: 'ECS, Fixed-Timestep Simulation & Gameplay',
    summary:
      'Herzstück der NovaCore Engine und des darauf aufbauenden FPS-Projekts Nemisis. Trennt Engine-Laufzeit sauber von der eigentlichen Spielschicht.',
    architectureWhy:
      'Um zu verstehen, wie eigene digitale Welten im Innersten funktionieren, baue ich Entity Component System, Speicherlayout und feste Simulationsschritte selbst.',
    coreLayer: 'Cache-freundliches Entity Component System (ECS)',
    mantleLayer: 'Deterministische Fixed-Timestep Physik & Simulation',
    crustLayer: 'Nemisis FPS-Gameplay-Layer & Arena-Logik',
    moons: ['C++23', 'Custom ECS', 'Fixed Simulation', 'CMake'],
    linkedProjectId: 'novacore',
    linkedProjectName: 'NovaCore & Nemisis',
    repoUrl: 'https://github.com/YoungJibbit95/Novacore-Engine',
    orbitPeriod: '420 TAGE · SYSTEMKERN',
    distanceAu: '1.42 AU',
    gravity: '2.35 g',
    surfaceTemp: '680 K',
  },
  {
    id: 'vulkan',
    name: 'Vulkan & SDL3 Grafik-Pipeline',
    shortLabel: 'Vulkan & SDL3',
    planetName: 'Ignis-VK · Vulkanische Io-Welt',
    planetClass: 'Hyperaktiver Magma-Mond mit Plasma-Torus',
    ring: 2,
    ringLabel: 'Mittlerer Orbit · Planung & Engines',
    angleDeg: 270,
    color: 'cyan',
    surfaceGradient:
      'radial-gradient(circle at 34% 30%, #fef08a 0%, #ef4444 42%, #7f1d1d 76%, #1f0707 100%)',
    atmosphereGlow: 'rgba(248, 113, 113, 0.56)',
    coreColor: '#fca5a5',
    role: 'Low-Level Rendering, Fenster & Input-Laufzeit',
    summary:
      'Treibt in NovaCore die Grafik- und Plattformschicht an. Direkte Kontrolle über GPU-Ressourcen, Swapchain, Eingaben und Frame-Taktung.',
    architectureWhy:
      'High-Level-Engines nehmen viele Entscheidungen ab. Mit Vulkan und SDL3 sehe ich genau, was zwischen Frame-Start, Speichertransfer und Bildschirm passiert.',
    coreLayer: 'Explizite Vulkan Device-, Queue- & Swapchain-Steuerung',
    mantleLayer: 'Render-Pass, Command-Buffer & Shader-Pipelines',
    crustLayer: 'SDL3 Plattform-Fenster, Audio & Low-Latency Input',
    moons: ['Vulkan API', 'SDL3', 'Framegraph', 'Shader Pipeline'],
    linkedProjectId: 'novacore',
    linkedProjectName: 'NovaCore & Nemisis',
    repoUrl: 'https://github.com/YoungJibbit95/Novacore-Engine',
    orbitPeriod: '512 TAGE · SYSTEMKERN',
    distanceAu: '1.76 AU',
    gravity: '1.42 g',
    surfaceTemp: '1.480 K',
  },
  {
    id: 'python-ai',
    name: 'Python · FastAPI · Lokale KI (Ollama)',
    shortLabel: 'Python & KI',
    planetName: 'Veritas-PY · Smaragd-Gasriese',
    planetClass: 'Bänder-Gasplanet mit Neuronalen Signal-Monden',
    ring: 3,
    ringLabel: 'Äußerer Orbit · Assistenz & Welten',
    angleDeg: 85,
    color: 'green',
    surfaceGradient:
      'radial-gradient(circle at 30% 28%, #d1fae5 0%, #10b981 38%, #065f46 74%, #022c22 100%)',
    atmosphereGlow: 'rgba(52, 211, 153, 0.55)',
    coreColor: '#6ee7b7',
    hasPlanetaryRings: true,
    ringTiltDeg: -14,
    role: 'Lokale Sprach-Assistenz & Kontrollierte Werkzeuge',
    summary:
      'In YJarvis übernimmt Python mit FastAPI und lokalen Sprachmodellen (Ollama) die Verarbeitung von Sprache, Kontext und Werkzeugaufrufen auf dem eigenen Gerät.',
    architectureWhy:
      'KI-Assistenz soll lokal nachvollziehbar bleiben: Sprachmodelle schlagen Werkzeuge vor, aber kritische Aktionen warten auf explizite menschliche Freigabe.',
    coreLayer: 'Lokale LLM-Inferenz (Ollama) ohne Cloud-Zwang',
    mantleLayer: 'FastAPI Async-Backend & Audio-Transkriptions-Strom',
    crustLayer: 'Human-in-the-Loop Freigabe-Schranke für Werkzeuge',
    moons: ['Python 3', 'FastAPI', 'Ollama LLM', 'Tool Approval'],
    linkedProjectId: 'jarvis',
    linkedProjectName: 'YJarvis',
    repoUrl: 'https://github.com/YoungJibbit95/YJarvis',
    orbitPeriod: '890 TAGE · AUSSENORBIT',
    distanceAu: '2.65 AU',
    gravity: '2.10 g',
    surfaceTemp: '195 K',
  },
  {
    id: 'java-csharp',
    name: 'Java 21 (LWJGL/Netty) & C# (.NET/MonoGame)',
    shortLabel: 'Java & C#',
    planetName: 'Cryo-JVM · Azur-Eisriese',
    planetClass: 'Doppel-Eisriese im Äußeren Experimentier-Gürtel',
    ring: 3,
    ringLabel: 'Äußerer Orbit · Assistenz & Welten',
    angleDeg: 160,
    color: 'violet',
    surfaceGradient:
      'radial-gradient(circle at 32% 28%, #e0e7ff 0%, #6366f1 38%, #312e81 74%, #0f172a 100%)',
    atmosphereGlow: 'rgba(129, 140, 248, 0.55)',
    coreColor: '#a5b4fc',
    role: 'Prozedurale Sandbox-Welten & Frühe 2D-Engines',
    summary:
      'Adventura nutzt Java 21, LWJGL und Netty für prozedurale Welten und Multiplayer-Netzwerk; YjsE und frühe Projekte wie Space-Defenders entstanden in C#/.NET.',
    architectureWhy:
      'Jede Sprache lehrt eine andere Perspektive auf Speicher, Netzwerk-Synchronisation, Asset-Pipelines und Spielschleifen.',
    coreLayer: 'Java 21 Virtual Threads & C# .NET Runtime',
    mantleLayer: 'Netty Multiplayer-Protokoll & Prozedurale Welt-Seeds',
    crustLayer: 'LWJGL OpenGL-Renderer & MonoGame 2D-Engine-Kern',
    moons: ['Java 21', 'LWJGL & Netty', 'C# / .NET', 'MonoGame'],
    linkedProjectId: 'adventura',
    linkedProjectName: 'Adventura & YjsE',
    repoUrl: 'https://github.com/YoungJibbit95/Adventura',
    orbitPeriod: '1.420 TAGE · KUIPERGÜRTEL',
    distanceAu: '3.80 AU',
    gravity: '1.12 g',
    surfaceTemp: '88 K',
  },
]

interface TechSolarSystemProps {
  onSelectProject: (id: ProjectId) => void
}

export function TechSolarSystem({ onSelectProject }: TechSolarSystemProps) {
  const [selectedId, setSelectedId] = useState<string>('typescript')
  const [activeRingFilter, setActiveRingFilter] = useState<number | null>(null)
  const [isPlanetOpened, setIsPlanetOpened] = useState<boolean>(false)
  const [activeLayerTab, setActiveLayerTab] = useState<'overview' | 'strata' | 'moons'>('overview')

  const activeIndex = TECH_PLANETS.findIndex((p) => p.id === selectedId)
  const activePlanet = TECH_PLANETS[activeIndex] ?? TECH_PLANETS[0]

  const getPlanetCoordinates = (ring: 1 | 2 | 3, angleDeg: number) => {
    const rx = ring === 1 ? 128 : ring === 2 ? 214 : 296
    const ry = ring === 1 ? 82 : ring === 2 ? 136 : 188
    const rad = (angleDeg * Math.PI) / 180
    const x = 350 + Math.cos(rad) * rx
    const y = 240 + Math.sin(rad) * ry
    return { x, y, rx, ry }
  }

  const handlePlanetClick = (planetId: string) => {
    setSelectedId(planetId)
    setIsPlanetOpened(true)
  }

  const stepPlanet = (dir: -1 | 1) => {
    const nextIdx = (activeIndex + dir + TECH_PLANETS.length) % TECH_PLANETS.length
    setSelectedId(TECH_PLANETS[nextIdx].id)
  }

  return (
    <section
      className="cosmic-realm realm--helios section-shell"
      id="tech-orbit"
      aria-labelledby="tech-orbit-title"
    >
      {/* Stage 1: Centered Heliosphere Header */}
      <div className="realm-centered-head" data-stage>
        <div className="realm-badge realm-badge--solar">
          <Sun size={15} />
          <span>EBENE 01 · HELIOSPHÄRE · DAS REALISTISCHE TECH-SONNENSYSTEM</span>
        </div>
        <h2 id="tech-orbit-title">
          Sprachen &amp; Frameworks
          <br />
          <span className="solar-gradient-text">als lebendiges Planetensystem.</span>
        </h2>
        <p className="realm-lead">
          Im Zentrum brennt die <strong>System-Sonne der Neugier</strong>. Um sie kreisen sieben
          spezialisierte Tech-Planeten auf drei Kepler-Bahnen. <strong>Klicke auf einen Planeten</strong>,
          um direkt in seine Atmosphäre reinzuzoomen und seinen inneren Schichtenaufbau zu öffnen.
        </p>
      </div>

      {/* Stage 2: Orbit Ring Filter Bar + Quick Planet Selector */}
      <div className="helios-controls-bar" data-stage>
        <div className="solar-ring-filter" role="group" aria-label="Orbit-Ebene filtern">
          <button
            type="button"
            className={activeRingFilter === null ? 'is-active' : ''}
            onClick={() => setActiveRingFilter(null)}
          >
            Alle 3 Umlaufbahnen
          </button>
          <button
            type="button"
            className={activeRingFilter === 1 ? 'is-active' : ''}
            onClick={() => setActiveRingFilter(1)}
          >
            Orbit I · Workspaces (0.4–0.7 AU)
          </button>
          <button
            type="button"
            className={activeRingFilter === 2 ? 'is-active' : ''}
            onClick={() => setActiveRingFilter(2)}
          >
            Orbit II · Planung &amp; Engines (1.1–1.8 AU)
          </button>
          <button
            type="button"
            className={activeRingFilter === 3 ? 'is-active' : ''}
            onClick={() => setActiveRingFilter(3)}
          >
            Orbit III · KI &amp; Sandbox-Welten (2.6–3.8 AU)
          </button>
        </div>

        <div className="map-mode-toggle">
          <button
            type="button"
            className={`map-zoom-btn ${!isPlanetOpened ? 'is-active' : ''}`}
            onClick={() => setIsPlanetOpened(false)}
          >
            <Minimize2 size={15} />
            Sonnensystem-Karte
          </button>
          <button
            type="button"
            className={`map-zoom-btn ${isPlanetOpened ? 'is-active' : ''}`}
            onClick={() => setIsPlanetOpened(true)}
          >
            <Maximize2 size={15} />
            Planet {activePlanet.shortLabel} öffnen
          </button>
        </div>
      </div>

      {/* Stage 3: Interactive Solar System Map with Camera Zoom into Opened Planet */}
      <div
        className={`solar-map-container ${isPlanetOpened ? 'is-planet-zoomed' : ''}`}
        data-stage
      >
        {/* OVERVIEW SOLAR SYSTEM ORRERY */}
        <div className="solar-stage solar-stage--realistic" aria-hidden={isPlanetOpened}>
          <div className="solar-stage-hud">
            <span className="hud-coord">KEPLER-EKLIPLIK · 7 PLANETEN · 28 MONDE</span>
            <span className="hud-status">
              <span className="signal-dot" /> KLICKE AUF EINEN PLANETEN ZUM REINZOOMEN &amp; ÖFFNEN
            </span>
          </div>

          <svg
            className="solar-svg solar-svg--realistic"
            viewBox="0 0 700 480"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Realistic Boiling Solar Photosphere & Corona */}
              <radialGradient id="realisticSunCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="28%" stopColor="#fef08a" />
                <stop offset="58%" stopColor="#f59e0b" />
                <stop offset="82%" stopColor="#ea580c" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="solarCorona" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#f97316" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="activeLaserBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Asteroid Belt between Orbit II and Orbit III */}
            <ellipse
              cx="350"
              cy="240"
              rx="255"
              ry="162"
              fill="none"
              stroke="rgba(251, 191, 36, 0.14)"
              strokeWidth="9"
              strokeDasharray="1.5 7.5"
            />

            {/* Elliptical Kepler Orbits */}
            {[
              { ring: 1, rx: 128, ry: 82 },
              { ring: 2, rx: 214, ry: 136 },
              { ring: 3, rx: 296, ry: 188 },
            ].map(({ ring, rx, ry }) => {
              const dimmed = activeRingFilter !== null && activeRingFilter !== ring
              return (
                <g key={ring} opacity={dimmed ? 0.18 : 1}>
                  <ellipse
                    cx="350"
                    cy="240"
                    rx={rx}
                    ry={ry}
                    className={`solar-orbit-ellipse solar-orbit-ellipse--${ring}`}
                  />
                </g>
              )
            })}

            {/* Telemetry Laser Beam from Central Sun to Selected Planet */}
            {(() => {
              const pos = getPlanetCoordinates(activePlanet.ring, activePlanet.angleDeg)
              return (
                <g>
                  <line
                    x1="350"
                    y1="240"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#activeLaserBeam)"
                    strokeWidth="2.2"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="38"
                    fill="none"
                    stroke="rgba(255, 214, 132, 0.5)"
                    strokeDasharray="4 6"
                  />
                </g>
              )
            })()}

            {/* Central Realistic Sun with Solar Prominence Loops */}
            <circle cx="350" cy="240" r="95" fill="url(#solarCorona)" />
            <path
              d="M312 208 C292 182, 330 168, 344 196"
              fill="none"
              stroke="rgba(251, 146, 60, 0.55)"
              strokeWidth="2.2"
            />
            <path
              d="M386 268 C412 292, 372 308, 358 282"
              fill="none"
              stroke="rgba(253, 224, 71, 0.5)"
              strokeWidth="2"
            />
            <circle cx="350" cy="240" r="46" fill="url(#realisticSunCore)" />
          </svg>

          {/* Central Sun Button */}
          <div className="solar-core-star solar-core-star--realistic">
            <span className="core-star-corona" />
            <span className="core-star-kicker">SYSTEM-SONNE</span>
            <strong>NEUGIER</strong>
            <small>Verstehen &amp; Bauen</small>
          </div>

          {/* 7 Realistic Interactive Planet Nodes */}
          {TECH_PLANETS.map((planet) => {
            const pos = getPlanetCoordinates(planet.ring, planet.angleDeg)
            const leftPct = (pos.x / 700) * 100
            const topPct = (pos.y / 480) * 100
            const isSelected = planet.id === activePlanet.id
            const isDimmed = activeRingFilter !== null && activeRingFilter !== planet.ring

            return (
              <button
                key={planet.id}
                type="button"
                className={`realistic-planet-node realistic-planet--${planet.color} ${
                  isSelected ? 'is-selected' : ''
                } ${isDimmed ? 'is-dimmed' : ''}`}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                onClick={() => handlePlanetClick(planet.id)}
                aria-pressed={isSelected}
                aria-label={`${planet.name}: ${planet.role} – Planetenansicht öffnen`}
              >
                <span
                  className="planet-atmosphere-halo"
                  style={{ boxShadow: `0 0 28px ${planet.atmosphereGlow}` }}
                />
                {planet.hasPlanetaryRings && (
                  <span
                    className="planet-saturn-ring"
                    style={{ transform: `translate(-50%, -50%) rotate(${planet.ringTiltDeg ?? 18}deg)` }}
                  />
                )}
                <span
                  className="planet-realistic-sphere"
                  style={{ background: planet.surfaceGradient }}
                >
                  <span className="planet-terminator-shadow" />
                  <span className="planet-surface-bands" />
                </span>
                {/* Orbiting mini-moon indicator dots */}
                <span className="planet-mini-moon planet-mini-moon--1" />
                <span className="planet-mini-moon planet-mini-moon--2" />

                <span className="planet-tag-card">
                  <span className="planet-tag-name">{planet.shortLabel}</span>
                  <span className="planet-tag-meta">
                    {planet.distanceAu} · Öffnen ↗
                  </span>
                </span>
              </button>
            )
          })}

          {/* Bottom Quick-Select Planetary Dock */}
          <div className="solar-planet-dock" role="toolbar" aria-label="Schnellwahl der Planeten">
            {TECH_PLANETS.map((planet) => (
              <button
                key={planet.id}
                type="button"
                className={`dock-planet-pill ${planet.id === activePlanet.id ? 'is-active' : ''}`}
                onClick={() => handlePlanetClick(planet.id)}
              >
                <span
                  className="dock-planet-mini"
                  style={{ background: planet.surfaceGradient }}
                />
                <span>{planet.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* OPENED PLANET EXPEDITION CHAMBER (ZOOMED-IN VIEW) */}
        <div
          className={`planet-expedition-chamber planet-chamber--${activePlanet.color} ${
            isPlanetOpened ? 'is-open' : ''
          }`}
          aria-live="polite"
        >
          <div className="planet-chamber-topbar">
            <button
              type="button"
              className="chamber-back-btn"
              onClick={() => setIsPlanetOpened(false)}
            >
              <ArrowLeft size={16} />
              Zurück zur Sonnensystem-Karte (Out-Zoom)
            </button>

            <div className="chamber-planet-MinimalNav">
              <button
                type="button"
                className="chamber-step-btn"
                onClick={() => stepPlanet(-1)}
                aria-label="Vorheriger Planet im Orbit"
              >
                <ArrowLeft size={15} /> Vorheriger Planet
              </button>
              <span className="chamber-orbit-badge">
                PLANET 0{activeIndex + 1} / 0{TECH_PLANETS.length} · {activePlanet.distanceAu}
              </span>
              <button
                type="button"
                className="chamber-step-btn"
                onClick={() => stepPlanet(1)}
                aria-label="Nächster Planet im Orbit"
              >
                Nächster Planet <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="planet-chamber-grid">
            {/* LEFT: Animated Opened Planet Globe & Cross-Section Core + Orbiting Moons */}
            <div className="planet-globe-showcase">
              <div className="opened-planet-visual">
                {/* Outer Atmospheric Rings */}
                <div
                  className="opened-planet-aurora"
                  style={{
                    background: `radial-gradient(circle, ${activePlanet.atmosphereGlow} 0%, transparent 70%)`,
                  }}
                />
                {activePlanet.hasPlanetaryRings && (
                  <div
                    className="opened-planet-ring-disc"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${activePlanet.ringTiltDeg ?? -18}deg)`,
                    }}
                  />
                )}

                {/* Main Realistic Planet Sphere with Animated Cutaway Core */}
                <div
                  className="opened-planet-sphere"
                  style={{ background: activePlanet.surfaceGradient }}
                >
                  <div className="opened-planet-clouds" />
                  <div className="opened-planet-terminator" />
                  {/* Glowing Cutaway Inner Core Wedge */}
                  <div className="opened-planet-core-cutaway">
                    <span
                      className="cutaway-inner-seed"
                      style={{ background: activePlanet.coreColor }}
                    />
                    <span className="cutaway-label">KERN OFFEN</span>
                  </div>
                </div>

                {/* 4 Orbiting Moon Satellites around the Opened Planet */}
                {activePlanet.moons.map((moon, idx) => {
                  const angles = [-42, 38, 142, 218]
                  const rad = (angles[idx % angles.length] * Math.PI) / 180
                  const mx = 50 + Math.cos(rad) * 44
                  const my = 50 + Math.sin(rad) * 40
                  return (
                    <div
                      key={moon}
                      className="opened-moon-satellite"
                      style={{ left: `${mx}%`, top: `${my}%` }}
                    >
                      <span className="moon-dot" />
                      <span className="moon-name">{moon}</span>
                    </div>
                  )
                })}
              </div>

              {/* Planetary Physical Telemetry Bar */}
              <div className="planet-physical-stats">
                <div>
                  <span>PLANETENKLASSE</span>
                  <strong>{activePlanet.planetClass}</strong>
                </div>
                <div>
                  <span>GRAVITATION</span>
                  <strong>{activePlanet.gravity}</strong>
                </div>
                <div>
                  <span>OBERFLÄCHE</span>
                  <strong>{activePlanet.surfaceTemp}</strong>
                </div>
                <div>
                  <span>UMLAUFBAHN</span>
                  <strong>{activePlanet.orbitPeriod}</strong>
                </div>
              </div>
            </div>

            {/* RIGHT: Creative Planetary Dossier & Layer Explorer */}
            <div className="planet-dossier-panel">
              <div className="dossier-kicker-row">
                <span className="dossier-planet-code">{activePlanet.planetName}</span>
                <span className="dossier-ring-badge">{activePlanet.ringLabel}</span>
              </div>

              <h3>{activePlanet.name}</h3>
              <p className="dossier-role-subtitle">{activePlanet.role}</p>

              {/* Layer Switcher Tabs inside the Planet */}
              <div className="planet-interior-tabs" role="tablist" aria-label="Planeten-Schichten">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeLayerTab === 'overview'}
                  className={activeLayerTab === 'overview' ? 'is-active' : ''}
                  onClick={() => setActiveLayerTab('overview')}
                >
                  <Compass size={15} /> Oberfläche &amp; Rolle
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeLayerTab === 'strata'}
                  className={activeLayerTab === 'strata' ? 'is-active' : ''}
                  onClick={() => setActiveLayerTab('strata')}
                >
                  <Layers size={15} /> Innerer Schichtenaufbau
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeLayerTab === 'moons'}
                  className={activeLayerTab === 'moons' ? 'is-active' : ''}
                  onClick={() => setActiveLayerTab('moons')}
                >
                  <Sparkles size={15} /> 4 Trabanten-Monde
                </button>
              </div>

              {activeLayerTab === 'overview' && (
                <div className="planet-tab-content">
                  <p className="planet-summary-text">{activePlanet.summary}</p>
                  <div className="planet-why-box">
                    <div className="planet-why-header">
                      <ShieldCheck size={17} />
                      <span>WARUM DIESER PLANET IM SYSTEM UNVERZICHTBAR IST</span>
                    </div>
                    <p>{activePlanet.architectureWhy}</p>
                  </div>
                </div>
              )}

              {activeLayerTab === 'strata' && (
                <div className="planet-strata-stack">
                  <div className="strata-layer-card strata-layer--crust">
                    <span className="strata-depth">01 · ATMOSPHÄRE &amp; KRUSTE</span>
                    <strong>{activePlanet.crustLayer}</strong>
                  </div>
                  <div className="strata-layer-card strata-layer--mantle">
                    <span className="strata-depth">02 · PLANETENMANTEL</span>
                    <strong>{activePlanet.mantleLayer}</strong>
                  </div>
                  <div className="strata-layer-card strata-layer--core">
                    <span className="strata-depth">03 · INNERER EISENKERN</span>
                    <strong>{activePlanet.coreLayer}</strong>
                  </div>
                </div>
              )}

              {activeLayerTab === 'moons' && (
                <div className="planet-moons-grid">
                  {activePlanet.moons.map((moon, i) => (
                    <div key={moon} className="moon-detail-card">
                      <span className="moon-index">TRABANT 0{i + 1}</span>
                      <strong>
                        <Cpu size={15} /> {moon}
                      </strong>
                      <small>Gebundener Baustein im Orbit von {activePlanet.shortLabel}</small>
                    </div>
                  ))}
                </div>
              )}

              <div className="planet-dossier-actions">
                <a
                  href="#projekte"
                  className="button button--primary"
                  onClick={() => onSelectProject(activePlanet.linkedProjectId)}
                >
                  <Workflow size={16} />
                  Sternensystem „{activePlanet.linkedProjectName}“ ansteuern
                  <ArrowDownRight size={16} />
                </a>
                <a
                  href={activePlanet.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--quiet"
                >
                  <GitBranch size={16} />
                  GitHub Repository
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
