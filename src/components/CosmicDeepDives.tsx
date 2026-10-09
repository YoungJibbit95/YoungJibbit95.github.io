import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Clock,
  FileCode2,
  Flame,
  GitBranch,
  Hammer,
  Lock,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Unlock,
} from 'lucide-react'

/* ==========================================================================
   EBENE 04: NEXUS CEREBRI — EXOTIC WORMHOLE-MATTER CLOCK & EXPLODED VIEW
   ========================================================================== */

interface WormholeClockHour {
  id: string
  clockTime: string
  angleDeg: number
  phaseCode: string
  title: string
  subtitle: string
  wormholeMatterState: string
  timeDilation: string
  rustBoundary: string
  explanation: string
  explodedRings: [string, string, string]
}

const WORMHOLE_HOURS: WormholeClockHour[] = [
  {
    id: 'hour-03',
    clockTime: '03:00',
    angleDeg: 0,
    phaseCode: 'ZEIT-EBENE I · PROPOSE',
    title: 'Explizite Fakten & Zeitfenster sammeln',
    subtitle: 'Keine stillen Annahmen am Ereignishorizont',
    wormholeMatterState: 'Eingehender Raumzeit-Trichter · Rohdaten-Strom',
    timeDilation: 'Δt = +0.00 ms (Deterministischer Snapshot)',
    rustBoundary: 'cerebri::facts::TimeWindow & ConstraintSet',
    explanation:
      'Bevor Nexus Cerebri überhaupt plant, werden Kalenderblöcke, Deadlines, Fokuszeiten und Aufgaben als unveränderliche Rust-Fakten erfasst. Nichts wird erraten – jede Bedingung hat einen klaren Ursprung.',
    explodedRings: [
      'Äußerer Ereignishorizont: Roh-Termine & Aufgaben-Fakten',
      'Mittlere Gravitationslinse: Normalisierte Zeitintervalle',
      'Innerer Singularitäts-Kern: Unveränderlicher Fact-Snapshot',
    ],
  },
  {
    id: 'hour-06',
    clockTime: '06:00',
    angleDeg: 90,
    phaseCode: 'ZEIT-EBENE II · VALIDATE',
    title: 'Begrenzte Suche & Regelwerk-Prüfung',
    subtitle: 'Jeder Kandidat durchläuft das Wurmloch-Uhrwerk',
    wormholeMatterState: 'Gekrümmte Kausalitäts-Schleife · Regel-Filter',
    timeDilation: 'Bounded Search · Max. Tiefe garantiert',
    rustBoundary: 'cerebri::solver::evaluate_candidates()',
    explanation:
      'Statt einer undurchsichtigen Blackbox prüft der Rust-Kern jeden möglichen Zeitslot gegen harte und weiche Regeln: Fokusblöcke am Vormittag, Puffer vor Deadlines und kognitive Auslastung.',
    explodedRings: [
      'Äußerer Zahnkranz: Kandidaten-Generator (Zeitslots A, B, C)',
      'Mittlerer Prüf-Ring: Harte & weiche Regel-Kollisionstests',
      'Innerer Beweis-Ring: Verworfene vs. zulässige Zeitfenster',
    ],
  },
  {
    id: 'hour-09',
    clockTime: '09:00',
    angleDeg: 180,
    phaseCode: 'ZEIT-EBENE III · EVIDENCE & COMMIT GATE',
    title: 'Typisierte Evidenz & Menschliche Freigabe',
    subtitle: 'Ein guter Plan muss erklärbar bleiben',
    wormholeMatterState: 'Quanten-Verschränkung · Begründungs-Brücke',
    timeDilation: 'Wartet auf expliziten Commit-Impuls',
    rustBoundary: 'cerebri::evidence::TypedEvidence<Slot>',
    explanation:
      'Jeder Vorschlag trägt in Nexus Cerebri seine eigene typisierte Begründung mit sich: Warum wurde 09:30 verworfen? Warum passt 13:30? Erst wenn der Mensch diese Evidenz sieht und freigibt, öffnet sich das Tor zur Ausführung.',
    explodedRings: [
      'Äußerer Evidenz-Ring: Begründung für verworfene Slots',
      'Mittlerer Sicherheits-Riegel: Menschliche Freigabe-Schranke',
      'Innerer Signatur-Kern: Geprüfter Plan-Commit',
    ],
  },
  {
    id: 'hour-12',
    clockTime: '12:00',
    angleDeg: 270,
    phaseCode: 'ZEIT-EBENE IV · EXECUTE',
    title: 'Kontrollierte Ausführung ohne Seiteneffekte',
    subtitle: 'Saubere Trennung zwischen Denken und Handeln',
    wormholeMatterState: 'Stabilisierter Ausgangs-Meridian · Realzeit',
    timeDilation: '100 % Nachvollziehbarer Übergang',
    rustBoundary: 'cerebri::executor::apply_approved_plan()',
    explanation:
      'Durch die strikte Trennung in vier Zeitschichten kann die Ausführungs-Ebene niemals eigenmächtig umplanen. Sie setzt ausschließlich den freigegebenen, mit Evidenz belegten Plan um.',
    explodedRings: [
      'Äußerer Synchronisations-Ring: Kalender- & Task-Update',
      'Mittlerer Audit-Ring: Protokollierte Entscheidungskette',
      'Innerer Ruhekern: Rückkehr in den stabilen Grundzustand',
    ],
  },
]

interface PlanningRule {
  id: string
  label: string
  detail: string
}

const CEREBRI_RULES: PlanningRule[] = [
  {
    id: 'focus-morning',
    label: 'Fokusblock 09:00–12:00 schützen',
    detail: 'Verhindert, dass tiefe Architektur-Arbeit am Vormittag überplant wird.',
  },
  {
    id: 'deadline-buffer',
    label: 'Mindestens 90 Min. Puffer vor Deadline (18:00)',
    detail: 'Verwirft späte Kandidaten, die bei Verzögerung die Zielgrenze reißen.',
  },
  {
    id: 'energy-match',
    label: 'Hohe Komplexität nur mit frischem Kontext',
    detail: 'Prüft über typisierte Evidenz, ob vorab bereits zwei schwere Blöcke lagen.',
  },
]

export function CerebriDeepDive() {
  const [selectedHourId, setSelectedHourId] = useState<string>('hour-09')
  const [isExplodedView, setIsExplodedView] = useState<boolean>(true)
  const [activeRules, setActiveRules] = useState<Record<string, boolean>>({
    'focus-morning': true,
    'deadline-buffer': true,
    'energy-match': false,
  })
  const [approved, setApproved] = useState(false)

  const activeHourIndex = WORMHOLE_HOURS.findIndex((h) => h.id === selectedHourId)
  const activeHour = WORMHOLE_HOURS[activeHourIndex] ?? WORMHOLE_HOURS[2]

  const toggleRule = (id: string) => {
    setActiveRules((prev) => ({ ...prev, [id]: !prev[id] }))
    setApproved(false)
  }

  const candidates = [
    {
      id: 'slot-a',
      time: '09:30 – 11:30',
      orbitAngle: -48,
      title: 'Kandidat A · Vormittags-Orbit',
      conflict: activeRules['focus-morning']
        ? 'Konflikt: Überschneidet geschützten Fokusblock (09:00–12:00).'
        : null,
      evidence: 'Rust Evidence::Block ProtectedFocusWindow(09:00..12:00)',
    },
    {
      id: 'slot-b',
      time: '13:30 – 15:30',
      orbitAngle: 0,
      title: 'Kandidat B · Mittags-Orbit',
      conflict: activeRules['energy-match']
        ? 'Konflikt: Kontext-Limit nach Vormittags-Architektur erreicht.'
        : null,
      evidence: 'Rust Evidence::ValidSlot { buffer_min: 150, conflict: None }',
    },
    {
      id: 'slot-c',
      time: '16:00 – 17:30',
      orbitAngle: 48,
      title: 'Kandidat C · Spätnachmittags-Orbit',
      conflict: activeRules['deadline-buffer']
        ? 'Konflikt: Nur 30 Min. bis 18:00 Deadline (Regel verlangt 90 Min.).'
        : null,
      evidence: 'Rust Evidence::ValidSlot { buffer_min: 30, late_window: true }',
    },
  ]

  const validCandidate = candidates.find((c) => !c.conflict) ?? null

  const handleSelectHour = (id: string) => {
    setSelectedHourId(id)
    setIsExplodedView(true)
  }

  return (
    <section
      className="cosmic-realm realm--pulsar section-shell"
      id="cerebri-system"
      aria-labelledby="cerebri-deep-title"
    >
      {/* Stage 1: Centered Wormhole Clock Header */}
      <div className="realm-centered-head" data-stage>
        <div className="realm-badge realm-badge--pulsar">
          <Clock size={15} />
          <span>EBENE 04 · WURMLOCH-CHRONOMETER · NEXUS CEREBRI</span>
        </div>
        <h2 id="cerebri-deep-title">
          Ein guter Plan muss
          <br />
          <span className="pulsar-gradient-text">erklärbar bleiben.</span>
        </h2>
        <p className="realm-lead">
          Mit <strong>Nexus Cerebri</strong> untersuche ich zeitliche Planung in Rust: Hier siehst
          du das System als <strong>komische Uhr aus exotischer Wurmlochmaterie</strong>. Klicke auf
          die verschiedenen <strong>Uhrzeiten</strong>, um das Uhrwerk in eine{' '}
          <strong>explodierte Raumzeit-Ansicht (Exploded View)</strong> aufzufächern und jede
          Architektur-Ebene von Vorschlag bis Freigabe zu erkunden.
        </p>
      </div>

      {/* Stage 2: Wormhole Clock Controls & Exploded View Toggle */}
      <div className="wormhole-clock-toolbar" data-stage>
        <div className="wormhole-time-pills" role="tablist" aria-label="Uhrzeiten der Wurmloch-Uhr">
          {WORMHOLE_HOURS.map((hour) => (
            <button
              key={hour.id}
              type="button"
              role="tab"
              aria-selected={selectedHourId === hour.id}
              className={`wormhole-time-pill ${selectedHourId === hour.id ? 'is-active' : ''}`}
              onClick={() => handleSelectHour(hour.id)}
            >
              <Clock size={14} />
              <strong>{hour.clockTime} UHR</strong>
              <span>{hour.phaseCode.split('·')[1]}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`map-zoom-btn ${isExplodedView ? 'is-active' : ''}`}
          onClick={() => setIsExplodedView((v) => !v)}
        >
          {isExplodedView ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          {isExplodedView ? 'Explodierte Ansicht aktiv' : 'Uhrwerk explodieren lassen'}
        </button>
      </div>

      {/* Stage 3: Exotic Wormhole-Matter Clock + Exploded Layer Inspection */}
      <div
        className={`wormhole-chronometer-stage ${isExplodedView ? 'is-exploded' : ''}`}
        data-stage
      >
        {/* LEFT: Exotic Non-Euclidean Wormhole Matter Clock */}
        <div className="wormhole-clock-dial-card">
          <div className="wormhole-dial-header">
            <span>EINSTEIN-ROSEN-UHRWERK · EXOTISCHE MATERIE</span>
            <strong>AKTIVE ZEIT: {activeHour.clockTime} UHR</strong>
          </div>

          <div className="wormhole-clock-rig">
            <svg
              className="wormhole-clock-svg"
              viewBox="0 0 460 460"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="wormholeSingularity" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#03050c" />
                  <stop offset="28%" stopColor="#1e0938" />
                  <stop offset="52%" stopColor="#a855f7" stopOpacity="0.82" />
                  <stop offset="76%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#090d1a" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="exoticMatterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Warped Gravitational Lensing Halo */}
              <circle cx="230" cy="230" r="205" fill="url(#wormholeSingularity)" />

              {/* Non-Euclidean Warped Spacetime Accretion Rings (Shift apart when isExplodedView is true) */}
              <g className="wormhole-ring-layer wormhole-ring-layer--outer">
                <path
                  d="M230 34 C348 28, 432 118, 424 230 C416 342, 336 434, 230 426 C118 418, 28 338, 36 230 C44 122, 112 40, 230 34 Z"
                  fill="none"
                  stroke="url(#exoticMatterGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="10 6"
                />
                <ellipse
                  cx="230"
                  cy="230"
                  rx="184"
                  ry="162"
                  transform="rotate(-18 230 230)"
                  fill="none"
                  stroke="rgba(192, 132, 252, 0.45)"
                  strokeWidth="1.8"
                />
              </g>

              <g className="wormhole-ring-layer wormhole-ring-layer--mid">
                <ellipse
                  cx="230"
                  cy="230"
                  rx="145"
                  ry="118"
                  transform="rotate(24 230 230)"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.58)"
                  strokeWidth="2.4"
                  strokeDasharray="6 8"
                />
                <path
                  d="M95 230 Q160 110 230 95 T365 230 T230 365 T95 230"
                  fill="none"
                  stroke="rgba(244, 114, 182, 0.48)"
                  strokeWidth="2"
                />
              </g>

              <g className="wormhole-ring-layer wormhole-ring-layer--inner">
                <circle
                  cx="230"
                  cy="230"
                  r="82"
                  fill="none"
                  stroke="#e879f9"
                  strokeWidth="2.5"
                  strokeDasharray="4 5"
                />
                {/* Event Horizon Black Hole Center */}
                <circle
                  cx="230"
                  cy="230"
                  r="42"
                  fill="#050711"
                  stroke="#67e8f9"
                  strokeWidth="2.5"
                />
              </g>

              {/* Relativistic Warped Clock Hands Pointing to Active Wormhole Hour */}
              {(() => {
                const rad = ((activeHour.angleDeg - 90) * Math.PI) / 180
                const hx = 230 + Math.cos(rad) * 148
                const hy = 230 + Math.sin(rad) * 148
                const cx = 230 + Math.cos(rad - 0.35) * 82
                const cy = 230 + Math.sin(rad - 0.35) * 82
                return (
                  <g>
                    <path
                      d={`M230 230 Q${cx} ${cy} ${hx} ${hy}`}
                      fill="none"
                      stroke="#fde047"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx={hx} cy={hy} r="9" fill="#fde047" />
                    <circle cx="230" cy="230" r="8" fill="#ffffff" />
                  </g>
                )
              })()}
            </svg>

            {/* 4 Clickable Wormhole Clock Hour Nodes around the Dial */}
            {WORMHOLE_HOURS.map((hour) => {
              const rad = ((hour.angleDeg - 90) * Math.PI) / 180
              const leftPct = 50 + Math.cos(rad) * 39
              const topPct = 50 + Math.sin(rad) * 39
              const isSelected = hour.id === activeHour.id

              return (
                <button
                  key={hour.id}
                  type="button"
                  className={`wormhole-hour-node ${isSelected ? 'is-selected' : ''}`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onClick={() => handleSelectHour(hour.id)}
                  aria-label={`Wurmloch-Uhrzeit ${hour.clockTime} (${hour.title}) in explodierter Ansicht öffnen`}
                >
                  <span className="wormhole-hour-time">{hour.clockTime}</span>
                  <span className="wormhole-hour-label">
                    {hour.phaseCode.split('·')[1]?.trim()}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="wormhole-dial-caption">
            Klicke auf <strong>03:00</strong>, <strong>06:00</strong>, <strong>09:00</strong> oder{' '}
            <strong>12:00</strong> auf dem Wurmloch-Zifferblatt, um die jeweilige Zeitschicht von
            Nexus Cerebri in der explodierten Ansicht rechts zu inspizieren.
          </p>
        </div>

        {/* RIGHT: EXPLODED VIEW OF THE WORMHOLE CLOCK LAYER + INFO TEXT */}
        <div className="wormhole-exploded-inspector" aria-live="polite">
          <div className="exploded-header-badge">
            <Sparkles size={15} />
            <span>EXPLODIERTE UHRWERK-ANSICHT · {activeHour.clockTime} UHR</span>
          </div>

          <h3>{activeHour.title}</h3>
          <p className="exploded-subtitle">{activeHour.subtitle}</p>
          <p className="exploded-explanation">{activeHour.explanation}</p>

          {/* 3 Isometric Exploded Clockwork Rings */}
          <div className="exploded-rings-stack" role="list" aria-label="Explodierte Uhrwerk-Ringe">
            {activeHour.explodedRings.map((ringText, index) => (
              <div
                key={ringText}
                role="listitem"
                className={`exploded-ring-plate exploded-ring-plate--${index + 1}`}
              >
                <div className="ring-plate-disc">
                  <span>RING 0{index + 1}</span>
                </div>
                <div className="ring-plate-copy">
                  <small>
                    {index === 0
                      ? 'EREIGNISHORIZONT-SCHICHT'
                      : index === 1
                        ? 'KRUEMMUNGS-GETRIEBE'
                        : 'SINGULARITÄTS-KERN'}
                  </small>
                  <strong>{ringText}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="wormhole-telemetry-grid">
            <div>
              <span>WURMLOCH-MATERIEZUSTAND</span>
              <strong>{activeHour.wormholeMatterState}</strong>
            </div>
            <div>
              <span>RUST-MODULGRENZE</span>
              <code>{activeHour.rustBoundary}</code>
            </div>
          </div>

          <div className="exploded-step-nav">
            <button
              type="button"
              className="chamber-step-btn"
              onClick={() => {
                const prev =
                  (activeHourIndex - 1 + WORMHOLE_HOURS.length) % WORMHOLE_HOURS.length
                setSelectedHourId(WORMHOLE_HOURS[prev].id)
              }}
            >
              <ArrowLeft size={15} /> Vorherige Uhrzeit
            </button>
            <button
              type="button"
              className="chamber-step-btn"
              onClick={() => {
                const next = (activeHourIndex + 1) % WORMHOLE_HOURS.length
                setSelectedHourId(WORMHOLE_HOURS[next].id)
              }}
            >
              Nächste Uhrzeit <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Stage 4: Live Rust Rule & Candidate Time-Slot Simulator */}
      <div className="cerebri-simulator-deck" data-stage>
        <div className="cerebri-rules-box">
          <div className="panel-title-row">
            <Sliders size={16} />
            <span>AKTIVE REGELN IM WURMLOCH-CHRONOMETER TESTEN</span>
          </div>
          <div className="rule-toggles">
            {CEREBRI_RULES.map((rule) => {
              const isOn = activeRules[rule.id]
              return (
                <button
                  key={rule.id}
                  type="button"
                  className={`rule-toggle-btn ${isOn ? 'is-on' : ''}`}
                  onClick={() => toggleRule(rule.id)}
                  aria-pressed={isOn}
                >
                  <div className="rule-toggle-indicator">{isOn ? 'AKTIV' : 'AUS'}</div>
                  <div className="rule-toggle-copy">
                    <strong>{rule.label}</strong>
                    <span>{rule.detail}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="cerebri-candidates-box">
          <div className="panel-title-row">
            <ShieldCheck size={16} />
            <span>GEPRÜFTE ZEIT-KANDIDATEN &amp; TYPISIERTE EVIDENZ</span>
          </div>
          <div className="candidate-slots">
            {candidates.map((slot) => {
              const isSelected = validCandidate?.id === slot.id
              return (
                <div
                  key={slot.id}
                  className={`candidate-slot ${
                    slot.conflict ? 'is-rejected' : isSelected ? 'is-recommended' : 'is-valid'
                  }`}
                >
                  <div className="slot-time-badge">{slot.time}</div>
                  <div className="slot-details">
                    <strong>{slot.title}</strong>
                    {slot.conflict ? (
                      <p className="slot-conflict">
                        <AlertTriangle size={14} /> {slot.conflict}
                      </p>
                    ) : (
                      <p className="slot-ok">
                        <CheckCircle2 size={14} /> Alle aktiven Regeln erfüllt.
                      </p>
                    )}
                    <code className="slot-evidence">{slot.evidence}</code>
                  </div>
                  <div className="slot-status-tag">
                    {slot.conflict ? 'VERWORFEN' : isSelected ? 'EMPFOHLEN' : 'MÖGLICH'}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cerebri-commit-bar">
            <div className="commit-info">
              {validCandidate ? (
                <>
                  <span>
                    Vorschlag bereit: <strong>{validCandidate.time}</strong> ({validCandidate.title}
                    )
                  </span>
                  <small>
                    {approved
                      ? 'Status: Vom Nutzer freigegeben – Ausführung in den Kalender übertragen.'
                      : 'Status: Wartet auf explizite menschliche Freigabe vor der Ausführung.'}
                  </small>
                </>
              ) : (
                <>
                  <span>Kein konfliktfreier Zeitraum unter diesen Regeln gefunden.</span>
                  <small>Deaktiviere eine Regel links, um den Suchraum zu öffnen.</small>
                </>
              )}
            </div>
            <div className="commit-actions">
              {validCandidate && !approved && (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setApproved(true)}
                >
                  <Unlock size={16} /> Vorschlag freigeben
                </button>
              )}
              {approved && (
                <button
                  type="button"
                  className="button button--quiet"
                  onClick={() => setApproved(false)}
                >
                  <RotateCcw size={16} /> Zurücksetzen
                </button>
              )}
              <a
                href="https://github.com/YoungJibbit95/Nexus-Cerebri"
                target="_blank"
                rel="noopener noreferrer"
                className="button button--quiet"
              >
                <GitBranch size={16} /> Cerebri Repo <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   EBENE 05: COZY STAR-FORGE WORKSHOP MAP (NOVACORE, NEMISIS, ADVENTURA, YJSE)
   EBENE 06: NEURAL GALAXY × BRAIN CORTEX MAP (YJARVIS)
   ========================================================================== */

interface ForgeStation {
  id: string
  stationNumber: string
  objectName: string
  projectTitle: string
  techBadge: string
  mapX: number
  mapY: number
  iconType: 'anvil' | 'furnace' | 'bellows' | 'workbench' | 'crystals'
  tagline: string
  description: string
  forgeLore: string
  specs: [string, string, string]
  codeSnippet: string
  repoUrl: string
  repoLabel: string
}

const FORGE_STATIONS: ForgeStation[] = [
  {
    id: 'anvil-novacore',
    stationNumber: 'SCHMIEDE-ORT 01',
    objectName: 'Der Glühende Runen-Amboss',
    projectTitle: 'NovaCore Engine · C++23 & ECS-Kern',
    techBadge: 'C++23 · Custom ECS · CMake',
    mapX: 350,
    mapY: 245,
    iconType: 'anvil',
    tagline: 'Hier wird das Fundament aus Speicherlayout und Entitäten geschmiedet.',
    description:
      'Auf dem zentralen Sternen-Amboss entsteht die NovaCore Engine in modernem C++23. Statt eine fertige Engine als Blackbox zu nutzen, schmiede ich das Entity Component System (ECS) und die Modulgrenzen zwischen Engine-Runtime und Spiel selbst.',
    forgeLore:
      'Jeder Hammerschlag auf dem Amboss trennt Daten sauber von Logik: Komponenten liegen dicht im Speicher, Systeme arbeiten deterministisch darüber.',
    specs: [
      'Cache-freundliches Archetype/Sparse-ECS',
      'Strikte Trennung: Engine-Core vs. Game-Layer',
      'Modulare C++23 Architektur mit CMake',
    ],
    codeSnippet: 'ecs.query<Transform, Velocity>().each([dt](auto& t, const auto& v) { t.pos += v.vel * dt; });',
    repoUrl: 'https://github.com/YoungJibbit95/Novacore-Engine',
    repoLabel: 'NovaCore Engine Repo',
  },
  {
    id: 'furnace-vulkan',
    stationNumber: 'SCHMIEDE-ORT 02',
    objectName: 'Die Lodernde Vulkan-Esse',
    projectTitle: 'Vulkan & SDL3 Grafik- & Plattform-Schmelze',
    techBadge: 'Vulkan API · SDL3 · Shaders',
    mapX: 145,
    mapY: 205,
    iconType: 'furnace',
    tagline: 'Im Feuer der Esse werden rohe GPU-Kommandos zu sichtbaren Bildern.',
    description:
      'Die große Schmelz-Esse befeuert das Rendering von NovaCore: Mit Vulkan und SDL3 verwalte ich Swapchain, Command-Buffer, Render-Passes, Fenster und Low-Latency-Input direkt ohne versteckte Magie.',
    forgeLore:
      'Wer einmal selbst eine Vulkan-Pipeline von Grund auf angeheizt hat, versteht genau, wie Daten vom RAM in den Grafikspeicher und auf den Monitor fließen.',
    specs: [
      'Explizite Vulkan Swapchain & Synchronisation',
      'SDL3 Plattform-Fenster, Event-Loop & Input',
      'Eigene Shader-Pipeline & Frame-Vorbereitung',
    ],
    codeSnippet: 'vkCmdBeginRenderPass(cmd, &renderPassInfo, VK_SUBPASS_CONTENTS_INLINE);',
    repoUrl: 'https://github.com/YoungJibbit95/Novacore-Engine',
    repoLabel: 'Vulkan Renderer in NovaCore',
  },
  {
    id: 'bellows-simulation',
    stationNumber: 'SCHMIEDE-ORT 03',
    objectName: 'Das Takt-Schwungrad & Blasebalg',
    projectTitle: 'Fixed-Timestep Simulation & Physik-Takt',
    techBadge: '120 Hz Fixed Tick · Determinismus',
    mapX: 255,
    mapY: 122,
    iconType: 'bellows',
    tagline: 'Der gleichmäßige Atem der Schmiede hält die Spielphysik stabil.',
    description:
      'Über dem Amboss treibt das schwere Uhrwerk-Schwungrad den Blasebalg an: Die Simulation läuft in festen Zeitschritten (Fixed Timestep), völlig unabhängig davon, wie schnell oder langsam die GPU gerade einzelne Frames rendert.',
    forgeLore:
      'Nur wenn der Simulationstakt wie ein Metronom schlägt, verhalten sich Bewegung, Kollision und Rückstoß auf jedem Rechner exakt gleich.',
    specs: [
      'Entkopplung von Simulations-Tick und Render-FPS',
      'Akkumulator-Schleife gegen Spiral-of-Death',
      'Präzise Interpolation für flüssige Darstellung',
    ],
    codeSnippet: 'while (accumulator >= FIXED_DT) { simulate_step(FIXED_DT); accumulator -= FIXED_DT; }',
    repoUrl: 'https://github.com/YoungJibbit95/Novacore-Engine',
    repoLabel: 'Simulations-Kern ansehen',
  },
  {
    id: 'workbench-nemisis',
    stationNumber: 'SCHMIEDE-ORT 04',
    objectName: 'Die Taktische Waffen- & Arena-Werkbank',
    projectTitle: 'Nemisis · Spielbare FPS-Sandbox auf NovaCore',
    techBadge: 'C++23 · FPS Gameplay · Arena Loop',
    mapX: 545,
    mapY: 228,
    iconType: 'workbench',
    tagline: 'Die Werkbank, auf der die geschmiedete Engine im echten Spiel beweist, was sie trägt.',
    description:
      'Eine Engine im luftleeren Raum bleibt Theorie. Auf der Werkbank rechts liegt Nemisis: mein spielbares First-Person-Shooter-Projekt, das Kamera, Movement, Trefferfeedback und Spielstatus direkt auf NovaCore erprobt.',
    forgeLore:
      'Jede Unschärfe in der Engine fällt auf der Arena-Werkbank sofort auf – hier muss sich Architektur in Millisekunden gut anfühlen.',
    specs: [
      'Direkte First-Person-Kamera & Arena-Steuerung',
      'Waffen-, Treffer- & Gegner-Wellenlogik im ECS',
      'Echter Belastungstest für die NovaCore Engine',
    ],
    codeSnippet: 'nemisis::ArenaSession::update(ecs, inputState, audioBus);',
    repoUrl: 'https://github.com/YoungJibbit95/Nemisis',
    repoLabel: 'Nemisis FPS Repo',
  },
  {
    id: 'crystals-worlds',
    stationNumber: 'SCHMIEDE-ORT 05',
    objectName: 'Das Regal der Welten-Kristalle',
    projectTitle: 'Adventura (Java 21) & YjsE (C# / MonoGame)',
    techBadge: 'Java 21 · LWJGL · Netty · C# MonoGame',
    mapX: 475,
    mapY: 118,
    iconType: 'crystals',
    tagline: 'Leuchtende Welten-Kristalle früherer und paralleler Engine-Experimente.',
    description:
      'Im Kristall-Regal der Schmiede stehen zwei weitere eigene Welten: Adventura erforscht prozedurale 2D-Welten und Multiplayer-Netzwerk mit Java 21, LWJGL und Netty; YjsE legte in C# und MonoGame den Grundstein für meine eigene Engine-Reise.',
    forgeLore:
      'Verschiedene Werkstoffe in derselben Schmiede: C++23, Java 21 und C# zeigen mir jeweils andere Stärken bei Speicher, Netzwerk und Tooling.',
    specs: [
      'Adventura: Prozedurale Welt & Netty-Multiplayer',
      'YjsE: Eigene 2D-Engine-Grundlagen in C# / MonoGame',
      'Frühe Wurzeln: Space-Defenders & System-Tools',
    ],
    codeSnippet: 'ServerBootstrap().group(boss, worker).channel(NioServerSocketChannel.class);',
    repoUrl: 'https://github.com/YoungJibbit95/Adventura',
    repoLabel: 'Adventura Repo',
  },
]

interface BrainCortexRegion {
  id: string
  lobeCode: string
  regionName: string
  anatomicalArea: string
  galaxyFeature: string
  mapX: number
  mapY: number
  color: 'emerald' | 'cyan' | 'violet' | 'amber'
  headline: string
  summary: string
  explodedLayers: [
    { layer: string; title: string; detail: string },
    { layer: string; title: string; detail: string },
    { layer: string; title: string; detail: string },
  ]
}

const BRAIN_GALAXY_REGIONS: BrainCortexRegion[] = [
  {
    id: 'auditory-nebula',
    lobeCode: 'KORTEX-SEKTOR 01 · TEMPORALLAPPEN',
    regionName: 'Auditorischer Klang-Nebel',
    anatomicalArea: 'Hörkortex × Ionisierter Wasserstoff-Spiralarm',
    galaxyFeature: 'NGC-AUDIO · Frequenz-Eintrittstor',
    mapX: 195,
    mapY: 215,
    color: 'cyan',
    headline: 'Sprache wird lokal erfasst, bevor ein einziger Token das System verlässt.',
    summary:
      'Im auditorischen Nebel-Sektor nimmt YJarvis gesprochene Sprache oder Textbefehle direkt auf dem Gerät entgegen. Keine Cloud-Lauschschleife: Das Signal wird lokal vorverarbeitet und in strukturierte Anfrage-Impulse übersetzt.',
    explodedLayers: [
      {
        layer: 'SCHICHT 01 · SENSORISCHE HÜLLE',
        title: 'Lokaler Audio- & Mikrofon-Stream',
        detail: 'Erfasst Sprachwellenform und filtert Hintergrundrauschen direkt am Client.',
      },
      {
        layer: 'SCHICHT 02 · SYNAPTISCHE TRANSKRIPTION',
        title: 'Sprache-zu-Text Umwandlung',
        detail: 'Überführt gesprochene Sätze in präzise Text-Prompts mit Zeitstempel.',
      },
      {
        layer: 'SCHICHT 03 · KORTEX-WEITERLEITUNG',
        title: 'Typisierter Request an FastAPI-Kern',
        detail: 'Übergibt den strukturierten Befehl an das lokale Python-Backend.',
      },
    ],
  },
  {
    id: 'semantic-core',
    lobeCode: 'KORTEX-SEKTOR 02 · ASSOZIATIONSZENTRUM',
    regionName: 'Semantischer Galaxiekern (Ollama)',
    anatomicalArea: 'Tiefer Assoziations-Kortex × Galaktisches Zentrum',
    galaxyFeature: 'CORE-LLM · Lokale Sprachmodell-Sonne',
    mapX: 350,
    mapY: 165,
    color: 'emerald',
    headline: 'Lokale Sprachmodelle verstehen den Kontext und schlagen passende Werkzeuge vor.',
    summary:
      'Im leuchtenden Zentrum der Gehirn-Galaxie verschmelzen Synapsen mit lokalen LLMs über Ollama und Python/FastAPI. Hier wird verstanden, worum es geht – und ob eine reine Antwort reicht oder ein System-Werkzeug benötigt wird.',
    explodedLayers: [
      {
        layer: 'SCHICHT 01 · KONTEXT-GEDÄCHTNIS',
        title: 'Sitzungs- & Projektkontext',
        detail: 'Verknüpft die aktuelle Frage mit den verfügbaren lokalen Werkzeug-Schemata.',
      },
      {
        layer: 'SCHICHT 02 · OLLAMA INFERENZ-KERN',
        title: 'Lokales Sprachmodell auf eigener Hardware',
        detail: 'Berechnet Antwort und strukturierte Tool-Vorschläge komplett offline-fähig.',
      },
      {
        layer: 'SCHICHT 03 · ABSICHTS-KLASSIFIKATION',
        title: 'Trennung: Nur-Lesen vs. System-Aktion',
        detail: 'Markiert jede Aktion, die Dateien oder Prozesse verändert, als freigabepflichtig.',
      },
    ],
  },
  {
    id: 'prefrontal-gate',
    lobeCode: 'KORTEX-SEKTOR 03 · PRÄFRONTALER KORTEX',
    regionName: 'Präfrontale Freigabe-Schranke',
    anatomicalArea: 'Frontaler Kontroll-Lappen × Magnetischer Schutzschild',
    galaxyFeature: 'GATE-HUMAN · Bewusste Entscheidungsgrenze',
    mapX: 255,
    mapY: 105,
    color: 'amber',
    headline: 'KI schlägt vor – aber der Mensch behält das letzte Wort vor jeder Aktion.',
    summary:
      'Der wichtigste Bereich des YJarvis-Gehirns: Im präfrontalen Wächter-Kortex wird jeder vorgeschlagene Werkzeugaufruf angehalten. Die Oberfläche zeigt exakt, welches Tool mit welchen Parametern laufen soll, und wartet auf deine Freigabe.',
    explodedLayers: [
      {
        layer: 'SCHICHT 01 · TOOL-INSPEKTOR',
        title: 'Offengelegter Werkzeug-Vorschlag',
        detail: 'Zeigt Befehl, Zielpfad und Parameter im Klartext vor der Ausführung an.',
      },
      {
        layer: 'SCHICHT 02 · MENSCHLICHE SCHRANKE',
        title: 'Expliziter Bestätigungs-Riegel (Approval Gate)',
        detail: 'Blockiert die Weiterleitung, bis der Nutzer aktiv „Freigeben“ wählt.',
      },
      {
        layer: 'SCHICHT 03 · SICHERHEITS-GARANTIE',
        title: 'Kein stilles Ausführen im Hintergrund',
        detail: 'Architektonische Grenze zwischen Modell-Vorschlag und Betriebssystem.',
      },
    ],
  },
  {
    id: 'motor-spiral',
    lobeCode: 'KORTEX-SEKTOR 04 · MOTORISCHER KORTEX',
    regionName: 'Exekutiver Aktions-Spiralarm',
    anatomicalArea: 'Motorischer Kortex × Äußerer Werkzeug-Spiralarm',
    galaxyFeature: 'EXEC-FASTAPI · Kontrollierte Ausführung',
    mapX: 495,
    mapY: 195,
    color: 'violet',
    headline: 'Freigegebene Werkzeuge laufen kontrolliert ab und melden ihr Ergebnis zurück.',
    summary:
      'Sobald die präfrontale Schranke geöffnet wurde, feuert der motorische Spiralarm: Das FastAPI-Backend führt die gewünschte Aktion aus, protokolliert das Resultat und speist die Rückmeldung sauber zurück in den Dialog.',
    explodedLayers: [
      {
        layer: 'SCHICHT 01 · SANDBOX-RUNNER',
        title: 'Kontrollierter Python Tool-Aufruf',
        detail: 'Führt genau das freigegebene Werkzeug mit geprüften Argumenten aus.',
      },
      {
        layer: 'SCHICHT 02 · RÜCKMELDE-SYNAPSE',
        title: 'Strukturierter Ergebnis-Bericht',
        detail: 'Liefert Status, Ausgaben und eventuelle Fehler transparent an die UI.',
      },
      {
        layer: 'SCHICHT 03 · SPRACH-SYNTHESE',
        title: 'Klare Antwort im Desktop-Workspace',
        detail: 'Schließt den Kreislauf im React/Electron-Interface von YJarvis.',
      },
    ],
  },
]

export function EnginesAndJarvisDeepDive() {
  // Ebene 05 State: Cozy Forge Map & Zoom
  const [selectedForgeId, setSelectedForgeId] = useState<string>('anvil-novacore')
  const [isForgeZoomed, setIsForgeZoomed] = useState<boolean>(false)

  // Ebene 06 State: Brain × Galaxy Map & Exploded View
  const [selectedBrainId, setSelectedBrainId] = useState<string>('prefrontal-gate')
  const [isBrainExploded, setIsBrainExploded] = useState<boolean>(true)
  const [jarvisApproved, setJarvisApproved] = useState<boolean>(false)

  const activeForgeIndex = FORGE_STATIONS.findIndex((s) => s.id === selectedForgeId)
  const activeForge = FORGE_STATIONS[activeForgeIndex] ?? FORGE_STATIONS[0]

  const activeBrainIndex = BRAIN_GALAXY_REGIONS.findIndex((b) => b.id === selectedBrainId)
  const activeBrain = BRAIN_GALAXY_REGIONS[activeBrainIndex] ?? BRAIN_GALAXY_REGIONS[2]

  const handleForgeObjectClick = (id: string) => {
    setSelectedForgeId(id)
    setIsForgeZoomed(true)
  }

  const handleBrainRegionClick = (id: string) => {
    setSelectedBrainId(id)
    setIsBrainExploded(true)
  }

  return (
    <>
      {/* ====================================================================
          EBENE 05: GEMÜTLICHE KOSMISCHE WELTEN-SCHMIEDE (FORGE MAP & ZOOM)
          ==================================================================== */}
      <section
        className="cosmic-realm realm--forge section-shell"
        id="engines-welten"
        aria-labelledby="forge-title"
      >
        <div className="realm-centered-head" data-stage>
          <div className="realm-badge realm-badge--forge">
            <Flame size={15} />
            <span>EBENE 05 · DIE KOSMISCHE WELTEN-SCHMIEDE · NOVACORE &amp; NEMISIS</span>
          </div>
          <h2 id="forge-title">
            Willkommen in der Schmiede
            <br />
            <span className="forge-gradient-text">eigener Engines &amp; Welten.</span>
          </h2>
          <p className="realm-lead">
            Hier geht der Kosmos in eine <strong>warme, gemütliche Sternen-Schmiede</strong> über.
            Jedes Werkzeug im Raum steht für einen Teil meiner Engine-Arbeit: der{' '}
            <strong>Runen-Amboss</strong> für die C++23 NovaCore Engine, die{' '}
            <strong>lodernde Esse</strong> für Vulkan &amp; SDL3, das{' '}
            <strong>Takt-Schwungrad</strong> für Fixed-Timestep-Physik und die{' '}
            <strong>Werkbank</strong> für den Shooter Nemisis.{' '}
            <strong>Klicke auf ein Element in der Schmiede</strong>, um direkt darauf reinzuzoomen!
          </p>
        </div>

        {/* Forge Map Controls */}
        <div className="forge-map-controls" data-stage>
          <div className="forge-object-pills" role="toolbar" aria-label="Stationen in der Schmiede">
            {FORGE_STATIONS.map((station) => (
              <button
                key={station.id}
                type="button"
                className={`forge-object-pill ${selectedForgeId === station.id ? 'is-active' : ''}`}
                onClick={() => handleForgeObjectClick(station.id)}
              >
                <Hammer size={14} />
                <span>{station.objectName.replace('Der ', '').replace('Die ', '').replace('Das ', '')}</span>
              </button>
            ))}
          </div>

          <div className="map-mode-toggle">
            <button
              type="button"
              className={`map-zoom-btn ${!isForgeZoomed ? 'is-active' : ''}`}
              onClick={() => setIsForgeZoomed(false)}
            >
              <Minimize2 size={15} /> Schmiede-Raumkarte
            </button>
            <button
              type="button"
              className={`map-zoom-btn ${isForgeZoomed ? 'is-active' : ''}`}
              onClick={() => setIsForgeZoomed(true)}
            >
              <Maximize2 size={15} /> Auf Station zoomen
            </button>
          </div>
        </div>

        {/* INTERACTIVE COZY FORGE WORKSHOP MAP + ZOOMED STATION VIEW */}
        <div className={`forge-workshop-container ${isForgeZoomed ? 'is-station-zoomed' : ''}`} data-stage>
          {/* COZY FORGE ROOM ILLUSTRATED MAP */}
          <div className="forge-room-map">
            <div className="forge-room-hud">
              <span>STERNEN-SCHMIEDE · INTERAKTIVE WERKSTATT-KARTE</span>
              <span>KLICKE AUF AMBOSS, ESSE, SCHWUNGRAD, WERKBANK ODER KRISTALLE</span>
            </div>

            <svg
              className="forge-room-svg"
              viewBox="0 0 700 380"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="hearthFireGlow" cx="22%" cy="55%" r="55%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.65" />
                  <stop offset="35%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="75%" stopColor="#7c2d12" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#090b12" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="anvilSparkGlow" cx="50%" cy="65%" r="45%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                  <stop offset="55%" stopColor="#ea580c" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#090b12" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="stoneArchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#271c19" />
                  <stop offset="100%" stopColor="#120d0c" />
                </linearGradient>
              </defs>

              {/* Cozy Stone Workshop Architecture & Starry Arch Window */}
              <rect x="10" y="10" width="680" height="360" rx="22" fill="#100b0a" stroke="rgba(251, 146, 60, 0.28)" strokeWidth="2" />
              {/* Warm Hearth Firelight Filling the Workshop */}
              <rect x="10" y="10" width="680" height="360" rx="22" fill="url(#hearthFireGlow)" />
              <rect x="10" y="10" width="680" height="360" rx="22" fill="url(#anvilSparkGlow)" />

              {/* Panoramic Star-Window in Back Wall */}
              <path
                d="M275 185 L275 88 A75 65 0 0 1 425 88 L425 185 Z"
                fill="#070b18"
                stroke="rgba(251, 191, 36, 0.45)"
                strokeWidth="3"
              />
              <circle cx="325" cy="95" r="2.2" fill="#fff" />
              <circle cx="378" cy="76" r="1.8" fill="#93c5fd" />
              <circle cx="355" cy="120" r="18" fill="none" stroke="rgba(103, 232, 249, 0.35)" strokeDasharray="3 4" />
              <line x1="350" y1="30" x2="350" y2="185" stroke="rgba(251, 191, 36, 0.25)" strokeWidth="2" />
              <line x1="275" y1="125" x2="425" y2="125" stroke="rgba(251, 191, 36, 0.25)" strokeWidth="2" />

              {/* Workshop Stone Floor Perspective Grid & Molten Runic Channels */}
              <path
                d="M25 285 L675 285 L690 365 L10 365 Z"
                fill="rgba(36, 22, 16, 0.85)"
                stroke="rgba(251, 146, 60, 0.25)"
              />
              {/* Glowing Molten Energy Conduit from Furnace to Anvil to Workbench */}
              <path
                d="M145 250 Q245 275 350 265 T545 255"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="8 6"
              />

              {/* 1. LEFT: Roaring Vulkan Furnace (Die Esse) */}
              <g transform="translate(85, 130)">
                <path
                  d="M10 155 L20 25 L105 25 L115 155 Z"
                  fill="url(#stoneArchGrad)"
                  stroke="#fb923c"
                  strokeWidth="2"
                />
                <path
                  d="M34 155 L34 82 A28 32 0 0 1 90 82 L90 155 Z"
                  fill="#ea580c"
                />
                <path
                  d="M44 155 L44 96 A18 22 0 0 1 80 96 L80 155 Z"
                  fill="#fef08a"
                />
              </g>

              {/* 2. TOP-LEFT: Mechanical Flywheel & Bellows (Takt-Schwungrad) */}
              <g transform="translate(215, 72)">
                <circle
                  cx="40"
                  cy="45"
                  r="34"
                  fill="rgba(28, 19, 17, 0.9)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                />
                <circle cx="40" cy="45" r="10" fill="#f97316" />
                <line x1="40" y1="11" x2="40" y2="79" stroke="#fde047" strokeWidth="2" />
                <line x1="6" y1="45" x2="74" y2="45" stroke="#fde047" strokeWidth="2" />
              </g>

              {/* 3. CENTER: Iconic Runic Anvil (Der Sternen-Amboss) */}
              <g transform="translate(290, 205)">
                {/* Wooden & Iron Base Block */}
                <rect x="28" y="62" width="64" height="34" rx="4" fill="#3b2316" stroke="#d97706" strokeWidth="2" />
                {/* Classic Anvil Body & Horn */}
                <path
                  d="M5 32 L32 22 L98 22 L115 30 L92 44 L80 62 L40 62 L32 44 Z"
                  fill="#475569"
                  stroke="#fde047"
                  strokeWidth="2.5"
                />
                {/* Glowing Hot Ingot & Hammer on Top */}
                <rect x="44" y="14" width="34" height="8" rx="3" fill="#fef08a" />
                <line x1="65" y1="-16" x2="54" y2="14" stroke="#d97706" strokeWidth="4" />
                <rect x="42" y="-22" width="24" height="11" rx="2" transform="rotate(-18 54 -16)" fill="#94a3b8" stroke="#fef08a" strokeWidth="1.5" />
              </g>

              {/* 4. TOP-RIGHT: Crystal Shelf of Worlds (Adventura & YjsE) */}
              <g transform="translate(435, 76)">
                <rect x="0" y="62" width="90" height="8" rx="3" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
                <polygon points="24,62 14,34 26,16 38,34" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1.5" />
                <polygon points="62,62 50,28 64,10 76,28" fill="#a855f7" stroke="#f3e8ff" strokeWidth="1.5" />
              </g>

              {/* 5. RIGHT: Tactical Arena Workbench (Nemisis) */}
              <g transform="translate(480, 185)">
                <rect x="10" y="65" width="120" height="14" rx="3" fill="#451a03" stroke="#fb923c" strokeWidth="2" />
                <rect x="22" y="79" width="12" height="36" fill="#29150c" />
                <rect x="106" y="79" width="12" height="36" fill="#29150c" />
                {/* Holographic FPS Arena Projection above Workbench */}
                <ellipse cx="70" cy="52" rx="44" ry="14" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" />
                <circle cx="70" cy="34" r="16" fill="none" stroke="#67e8f9" strokeWidth="1.8" />
                <line x1="50" y1="34" x2="90" y2="34" stroke="#67e8f9" strokeWidth="1.4" />
                <line x1="70" y1="14" x2="70" y2="54" stroke="#67e8f9" strokeWidth="1.4" />
              </g>
            </svg>

            {/* 5 Interactive Station Hotspots inside the Cozy Forge */}
            {FORGE_STATIONS.map((station) => {
              const leftPct = (station.mapX / 700) * 100
              const topPct = (station.mapY / 380) * 100
              const isSelected = station.id === activeForge.id

              return (
                <button
                  key={station.id}
                  type="button"
                  className={`forge-hotspot-node ${isSelected ? 'is-selected' : ''}`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onClick={() => handleForgeObjectClick(station.id)}
                  aria-label={`${station.objectName} (${station.projectTitle}) – in der Schmiede heranzoomen`}
                >
                  <span className="forge-hotspot-ember" />
                  <span className="forge-hotspot-ring" />
                  <span className="forge-hotspot-card">
                    <small>{station.stationNumber}</small>
                    <strong>{station.objectName}</strong>
                    <span>{station.techBadge} · Zoom ↗</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* ZOOMED-IN FORGE STATION EXPEDITION VIEW */}
          <div className="forge-station-zoom-view" aria-live="polite">
            <div className="planet-chamber-topbar">
              <button
                type="button"
                className="chamber-back-btn"
                onClick={() => setIsForgeZoomed(false)}
              >
                <ArrowLeft size={16} />
                Zurück in die gesamte Schmiede (Out-Zoom)
              </button>

              <div className="chamber-planet-MinimalNav">
                <button
                  type="button"
                  className="chamber-step-btn"
                  onClick={() => {
                    const prev =
                      (activeForgeIndex - 1 + FORGE_STATIONS.length) % FORGE_STATIONS.length
                    setSelectedForgeId(FORGE_STATIONS[prev].id)
                  }}
                >
                  <ArrowLeft size={15} /> Vorherige Station
                </button>
                <span className="chamber-orbit-badge">
                  {activeForge.stationNumber} · {activeForge.objectName}
                </span>
                <button
                  type="button"
                  className="chamber-step-btn"
                  onClick={() => {
                    const next = (activeForgeIndex + 1) % FORGE_STATIONS.length
                    setSelectedForgeId(FORGE_STATIONS[next].id)
                  }}
                >
                  Nächste Station <ArrowRight size={15} />
                </button>
              </div>
            </div>

            <div className="forge-zoom-content-grid">
              <div className="forge-zoom-artifact-stage">
                <div className={`forge-artifact-emblem forge-artifact--${activeForge.iconType}`}>
                  <Flame size={42} />
                  <span>{activeForge.objectName}</span>
                  <small>{activeForge.techBadge}</small>
                </div>

                <div className="forge-lore-quote">
                  <span>SCHMIEDE-NOTIZ</span>
                  <p>„{activeForge.forgeLore}“</p>
                </div>

                <div className="forge-code-plate">
                  <FileCode2 size={16} />
                  <code>{activeForge.codeSnippet}</code>
                </div>
              </div>

              <div className="forge-zoom-dossier">
                <span className="dossier-planet-code">{activeForge.stationNumber}</span>
                <h3>{activeForge.projectTitle}</h3>
                <p className="dossier-role-subtitle">{activeForge.tagline}</p>
                <p className="planet-summary-text">{activeForge.description}</p>

                <div className="forge-specs-list">
                  {activeForge.specs.map((spec, idx) => (
                    <div key={spec} className="forge-spec-item">
                      <span>0{idx + 1}</span>
                      <strong>{spec}</strong>
                    </div>
                  ))}
                </div>

                <div className="planet-dossier-actions">
                  <a
                    href={activeForge.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--primary"
                  >
                    <GitBranch size={16} /> {activeForge.repoLabel} <ArrowUpRight size={16} />
                  </a>
                  <button
                    type="button"
                    className="button button--quiet"
                    onClick={() => setIsForgeZoomed(false)}
                  >
                    <Minimize2 size={16} /> Andere Schmiede-Station wählen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          EBENE 06: YJARVIS — BRAIN CORTEX MERGED WITH A SPIRAL GALAXY
          ==================================================================== */}
      <section
        className="cosmic-realm realm--jarvis section-shell"
        id="jarvis-system"
        aria-labelledby="jarvis-deep-title"
      >
        <div className="realm-centered-head" data-stage>
          <div className="realm-badge realm-badge--jarvis">
            <Brain size={15} />
            <span>EBENE 06 · DER KOSMISCHE KORTEX · YJARVIS (GEHIRN × GALAXIE)</span>
          </div>
          <h2 id="jarvis-deep-title">
            Ein Gehirn, verschmolzen
            <br />
            <span className="jarvis-gradient-text">mit einer leuchtenden Galaxie.</span>
          </h2>
          <p className="realm-lead">
            <strong>YJarvis</strong> verbindet lokale Sprachmodelle (Python, FastAPI, Ollama) mit
            einer Desktop-Oberfläche. Hier reist du durch ein{' '}
            <strong>kosmisches Gehirn, dessen Windungen und Synapsen aus Spiralarmen bestehen</strong>
            . Klicke auf eine Gehirn-Region, um in ihre{' '}
            <strong>explodierte 3-Schichten-Kortex-Ansicht</strong> reinzuzoomen.
          </p>
        </div>

        {/* Brain Region Selector Bar */}
        <div className="brain-galaxy-toolbar" data-stage>
          <div className="brain-region-pills" role="tablist" aria-label="Gehirn-Bereiche von YJarvis">
            {BRAIN_GALAXY_REGIONS.map((region, idx) => (
              <button
                key={region.id}
                type="button"
                role="tab"
                aria-selected={selectedBrainId === region.id}
                className={`brain-region-pill ${selectedBrainId === region.id ? 'is-active' : ''}`}
                onClick={() => handleBrainRegionClick(region.id)}
              >
                <span className="region-num">0{idx + 1}</span>
                <span>{region.regionName}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`map-zoom-btn ${isBrainExploded ? 'is-active' : ''}`}
            onClick={() => setIsBrainExploded((v) => !v)}
          >
            {isBrainExploded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            {isBrainExploded ? 'Explodierte Kortex-Ansicht aktiv' : 'Kortex-Schichten auffächern'}
          </button>
        </div>

        {/* BRAIN × GALAXY MAP + EXPLODED CORTEX LAYER VIEW */}
        <div className={`brain-galaxy-stage ${isBrainExploded ? 'is-exploded' : ''}`} data-stage>
          {/* LEFT: Cosmic Brain Merged with Spiral Galaxy Map */}
          <div className="brain-galaxy-map-card">
            <div className="wormhole-dial-header">
              <span>NEURAL-GALAXIE · SYNAPSEN &amp; SPIRALARME</span>
              <strong>AKTIVE REGION: {activeBrain.regionName.toUpperCase()}</strong>
            </div>

            <div className="brain-galaxy-canvas">
              <svg
                className="brain-galaxy-svg"
                viewBox="0 0 680 380"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="brainGalaxyCore" cx="50%" cy="46%" r="52%">
                    <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.9" />
                    <stop offset="28%" stopColor="#34d399" stopOpacity="0.52" />
                    <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.26" />
                    <stop offset="85%" stopColor="#a855f7" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="cortexGyriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>

                {/* Galactic Aura inside the Cerebral Silhouette */}
                <ellipse cx="345" cy="180" rx="260" ry="155" fill="url(#brainGalaxyCore)" />

                {/* Outer Cerebral Cortex Silhouette Fused with Spiral Galaxy Arms */}
                <path
                  d="M165 235
                     C115 215, 108 150, 152 112
                     C178 72, 238 48, 305 54
                     C365 44, 448 56, 498 98
                     C555 135, 565 208, 512 246
                     C475 274, 415 278, 378 292
                     L362 332 L322 332 L308 278
                     C252 276, 202 262, 165 235 Z"
                  fill="rgba(10, 22, 36, 0.72)"
                  stroke="url(#cortexGyriGrad)"
                  strokeWidth="3"
                />

                {/* Cerebral Gyri / Sulci Folding into Galactic Spiral Arms */}
                <path
                  d="M175 155 C215 110, 295 95, 350 165 C405 235, 485 210, 515 162"
                  fill="none"
                  stroke="rgba(110, 231, 183, 0.55)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M205 220 C255 182, 310 135, 350 165 C395 195, 445 130, 488 122"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.48)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Synaptic Star Filaments Connecting the 4 Brain Regions */}
                <path
                  d="M195 215 L350 165 L255 105 L495 195 L350 165"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="1.8"
                  strokeDasharray="5 5"
                />
                {/* Brain Stem / Spinal Data Bus */}
                <path
                  d="M332 278 L332 345 M346 282 L346 345 M360 278 L360 345"
                  stroke="rgba(103, 232, 249, 0.55)"
                  strokeWidth="2.2"
                />
              </svg>

              {/* 4 Clickable Brain-Galaxy Region Markers */}
              {BRAIN_GALAXY_REGIONS.map((region, idx) => {
                const leftPct = (region.mapX / 680) * 100
                const topPct = (region.mapY / 380) * 100
                const isSelected = region.id === activeBrain.id

                return (
                  <button
                    key={region.id}
                    type="button"
                    className={`brain-region-node brain-node--${region.color} ${
                      isSelected ? 'is-selected' : ''
                    }`}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    onClick={() => handleBrainRegionClick(region.id)}
                    aria-label={`Gehirn-Bereich 0${idx + 1}: ${region.regionName} – Explodierte Ansicht öffnen`}
                  >
                    <span className="synapse-pulse-halo" />
                    <span className="synapse-star-core" />
                    <span className="brain-node-label">
                      <small>0{idx + 1} · {region.galaxyFeature.split('·')[0]}</small>
                      <strong>{region.regionName}</strong>
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="wormhole-dial-caption">
              Klicke auf einen der <strong>4 Kortex-Sektoren</strong> im Gehirn-Galaxie-Modell, um
              die synaptischen Schichten von YJarvis rechts in der explodierten Ansicht zu
              analysieren.
            </p>
          </div>

          {/* RIGHT: EXPLODED 3-LAYER CORTEX VIEW + INTERACTIVE APPROVAL GATE */}
          <div className="brain-exploded-inspector" aria-live="polite">
            <div className="exploded-header-badge exploded-header-badge--emerald">
              <Brain size={15} />
              <span>{activeBrain.lobeCode} · EXPLODIERTE KORTEX-ANSICHT</span>
            </div>

            <h3>{activeBrain.regionName}</h3>
            <p className="exploded-subtitle">{activeBrain.anatomicalArea}</p>
            <p className="exploded-explanation">{activeBrain.summary}</p>

            {/* 3 Exploded Neural Cortex Strata */}
            <div className="exploded-cortex-layers">
              {activeBrain.explodedLayers.map((item, idx) => (
                <div
                  key={item.layer}
                  className={`cortex-exploded-slice cortex-slice--${idx + 1}`}
                >
                  <div className="slice-index-pill">{item.layer}</div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>

            {/* Interactive Human-in-the-Loop Tool Gate Simulation */}
            <div className="jarvis-gate-simulator">
              <div className="gate-sim-header">
                <span>LIVE-TEST DER PRÄFRONTALEN FREIGABE-SCHRANKE</span>
                <span className={`gate-pill ${jarvisApproved ? 'is-open' : 'is-locked'}`}>
                  {jarvisApproved ? 'FREIGEGEBEN' : 'BLOCKIERT BIS FREIGABE'}
                </span>
              </div>
              <code className="gate-sim-command">
                ToolCall: workspace.organize_notes(directory=&quot;./projects/nexus&quot;, dry_run=false)
              </code>
              <div className="gate-sim-actions">
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => setJarvisApproved((v) => !v)}
                >
                  {jarvisApproved ? (
                    <>
                      <Lock size={15} /> Schranke wieder sperren
                    </>
                  ) : (
                    <>
                      <Play size={15} /> Werkzeug-Ausführung freigeben
                    </>
                  )}
                </button>
                <a
                  href="https://github.com/YoungJibbit95/YJarvis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--quiet"
                >
                  <GitBranch size={16} /> YJarvis auf GitHub <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   EBENE 07: INTERACTIVE 6-STATION WORKFLOW CONSTELLATION MAP
   ========================================================================== */

const WORKFLOW_STATIONS = [
  {
    code: '01',
    title: 'Idee & Frage',
    subtitle: 'Was will ich wirklich verstehen?',
    detail:
      'Jedes Projekt beginnt mit einer konkreten Frage: Wie bleibt Kontext im Workspace erhalten? Wie plant ein System nachvollziehbar? Wie fühlt sich eine eigene Engine an?',
    artifact: 'Leitfrage & Systemskizze',
    starCoords: 'RA 01h 14m · DEC +22°',
  },
  {
    code: '02',
    title: 'Gestaltung',
    subtitle: 'Wie soll es sich anfühlen?',
    detail:
      'Bevor Code wächst, überlege ich mir die Orientierung: Was muss auf den ersten Blick klar sein? Wo liegt der Fokus, und wie bleibt die Oberfläche ruhig?',
    artifact: 'UI-Richtung & Interaktionsfluss',
    starCoords: 'RA 04h 42m · DEC +38°',
  },
  {
    code: '03',
    title: 'Architektur',
    subtitle: 'Welche Grenzen tragen das System?',
    detail:
      'Ich trenne Runtime-Kern (@nexus/core), Planungsphasen (Nexus Cerebri) oder Engine-Schicht (NovaCore) bewusst von den jeweiligen Oberflächen und Spielregeln.',
    artifact: 'Modulgrenzen & Typverträge',
    starCoords: 'RA 08h 19m · DEC +51°',
  },
  {
    code: '04',
    title: 'Umsetzung',
    subtitle: 'Schritt für Schritt im Code bauen.',
    detail:
      'In TypeScript, Rust, C++23 oder Python entstehen die eigentlichen Module. KI-Agenten nutze ich dabei gezielt als Werkzeuge – ihre Ergebnisse müssen aber zur Architektur passen.',
    artifact: 'Lauffähige Kernmodule',
    starCoords: 'RA 13h 05m · DEC +44°',
  },
  {
    code: '05',
    title: 'Prüfung & Fehler',
    subtitle: 'Warum verhält es sich genau so?',
    detail:
      'Fehler zu suchen gehört für mich zum besten Teil der Arbeit: Kantenfälle, Timing-Probleme, Barrierefreiheit und automatisierte Tests zeigen, ob die Idee wirklich trägt.',
    artifact: 'Tests, Diagnose & Feinschliff',
    starCoords: 'RA 17h 50m · DEC +29°',
  },
  {
    code: '06',
    title: 'Release & Lernen',
    subtitle: 'Was nehme ich in den nächsten Schritt mit?',
    detail:
      'Ein Stand wird dokumentiert und veröffentlicht. Jede Antwort wirft neue Fragen auf, aus denen das nächste Kapitel oder das nächste Projekt im Orbit entsteht.',
    artifact: 'Dokumentierter Release-Stand',
    starCoords: 'RA 22h 10m · DEC +64°',
  },
]

export function WorkflowStepper() {
  const [activeStep, setActiveStep] = useState(0)
  const current = WORKFLOW_STATIONS[activeStep]

  return (
    <div className="workflow-orbit-panel workflow-orbit-panel--centered" data-stage>
      <div className="workflow-orbit-header">
        <div>
          <span className="eyebrow">STERNEN-MERIDIAN · MEIN ENTWICKLUNGS-ZYKLUS</span>
          <h3>In sechs Stationen von der offenen Frage zum geprüften System.</h3>
        </div>
        <span className="workflow-step-counter">
          STATION {current.code} / 06 · {current.starCoords}
        </span>
      </div>

      <div className="workflow-track" role="tablist" aria-label="Stationen meiner Arbeitsweise">
        {WORKFLOW_STATIONS.map((station, index) => (
          <button
            key={station.code}
            type="button"
            role="tab"
            aria-selected={activeStep === index}
            className={`workflow-node ${activeStep === index ? 'is-active' : ''} ${
              index < activeStep ? 'is-passed' : ''
            }`}
            onClick={() => setActiveStep(index)}
          >
            <span className="workflow-node-dot">{station.code}</span>
            <span className="workflow-node-title">{station.title}</span>
          </button>
        ))}
      </div>

      <div className="workflow-detail-card" aria-live="polite">
        <div className="workflow-detail-main">
          <span className="workflow-detail-kicker">
            STATION {current.code} · {current.subtitle}
          </span>
          <h4>{current.title}</h4>
          <p>{current.detail}</p>
        </div>
        <div className="workflow-detail-meta">
          <span>ERGEBNIS DIESER STATION</span>
          <strong>{current.artifact}</strong>
          <div className="workflow-nav-btns">
            <button
              type="button"
              onClick={() =>
                setActiveStep(
                  (s) => (s - 1 + WORKFLOW_STATIONS.length) % WORKFLOW_STATIONS.length,
                )
              }
            >
              ← Vorherige
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((s) => (s + 1) % WORKFLOW_STATIONS.length)}
            >
              Nächste Station →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
