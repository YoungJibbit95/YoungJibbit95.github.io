import { AudioLines, Code2, FileText, Laptop, Monitor, ShieldCheck, Smartphone } from 'lucide-react'
import type { ProjectId } from '../data/projects'

export function ProjectVisual({ id }: { id: ProjectId }) {
  if (id === 'nexus')
    return (
      <div
        className="project-visual nexus-visual"
        aria-label="Vier Nexus-Clients teilen einen Runtime-Kern"
      >
        <div className="visual-label">VERBUNDEN DURCH EINEN GEMEINSAMEN KERN</div>
        <svg className="nexus-wires" viewBox="0 0 600 360" aria-hidden="true">
          <path d="M120 105Q240 105 300 196M480 105Q360 105 300 196M120 283Q240 283 300 196M480 283Q360 283 300 196" />
        </svg>
        <div className="client client--main">
          <Monitor size={20} />
          <span>
            Nexus Main<small>Desktop Workspace</small>
          </span>
        </div>
        <div className="client client--mobile">
          <Smartphone size={20} />
          <span>
            Nexus Mobile<small>Mobile Workspace</small>
          </span>
        </div>
        <div className="runtime-core">
          <Code2 size={24} />
          <span>@nexus/core</span>
          <small>SHARED RUNTIME</small>
        </div>
        <div className="client client--code">
          <Laptop size={20} />
          <span>
            Nexus Code<small>Desktop IDE</small>
          </span>
        </div>
        <div className="client client--code-mobile">
          <Code2 size={20} />
          <span>
            Code Mobile<small>Mobile IDE</small>
          </span>
        </div>
        <span className="visual-caption">
          Schematische Darstellung der öffentlichen Client-Architektur
        </span>
      </div>
    )

  if (id === 'cerebri')
    return (
      <div
        className="project-visual cerebri-visual"
        aria-label="Planung bleibt von Prüfung und Freigabe getrennt"
      >
        <div className="visual-label">NACHVOLLZIEHBARE SCHRITTE</div>
        <div className="planning-lines" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="planning-item planning-item--facts">
          <FileText size={18} />
          <span>
            Fakten & Regeln<small>Was ist bekannt?</small>
          </span>
        </div>
        <div className="planning-item planning-item--proposal">
          <span className="planning-symbol">?</span>
          <span>
            Vorschlag<small>Was könnte passen?</small>
          </span>
        </div>
        <div className="planning-boundary">
          <ShieldCheck size={20} />
          <span>PRÜFUNG & FREIGABE</span>
        </div>
        <div className="planning-item planning-item--execute">
          <span className="planning-symbol">↗</span>
          <span>
            Ausführung<small>Was ist erlaubt?</small>
          </span>
        </div>
        <span className="visual-caption">Illustration der Planungs- und Freigabephasen</span>
      </div>
    )

  if (id === 'jarvis')
    return (
      <div
        className="project-visual jarvis-visual"
        aria-label="Lokale Spracheingabe, ein Vorschlag und bewusste Freigabe"
      >
        <div className="visual-label">AUF DEM EIGENEN RECHNER</div>
        <div className="assistant-orb">
          <AudioLines size={44} strokeWidth={1} />
        </div>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 31 }, (_, index) => (
            <span
              key={index}
              style={{ '--bar-height': `${12 + ((index * 17 + 3) % 51)}px` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="assistant-flow">
          <span>Sprache</span>
          <i aria-hidden="true">→</i>
          <span>Vorschlag</span>
          <i aria-hidden="true">→</i>
          <span>
            <ShieldCheck size={14} /> Freigabe
          </span>
        </div>
        <span className="visual-caption">Lokale Assistenz mit bewusster Kontrolle</span>
      </div>
    )

  return (
    <div
      className="project-visual engine-visual"
      aria-label="Illustration von Engine und Spielschichten"
    >
      <div className="visual-label">DIE BAUSTEINE EINER WELT</div>
      <svg className="wire-world" viewBox="0 0 600 360" aria-hidden="true">
        <defs>
          <linearGradient id={`world-${id}`} x2="1" y2="1">
            <stop stopColor="#70d7e5" />
            <stop offset="1" stopColor="#b294eb" />
          </linearGradient>
        </defs>
        <g fill="none" stroke={`url(#world-${id})`} strokeWidth="1">
          <path d="m300 55 140 80-140 80-140-80 140-80Zm-140 80v105l140 80 140-80V135M300 215v105M160 187l140 80 140-80M230 95v104m140-104v104M230 175v105m140-105v105M194 154l140-80M266 194l140-80M194 259l140-80M266 300l140-81" />
          <path
            opacity=".25"
            d="m35 277 265-155 265 155M70 298l230-136 230 136M108 320l192-117 192 117M155 347l145-104 145 104M90 243l210 124 210-124M130 220l170 100 170-100M176 193l124 73 124-73"
          />
        </g>
        <circle cx="300" cy="55" r="4" fill="#b6b3ff" />
        <circle cx="300" cy="215" r="4" fill="#71deec" />
      </svg>
      <span className="world-label world-label--top">SPIELIDEE</span>
      <span className="world-label world-label--bottom">ENGINE & SIMULATION</span>
      <span className="visual-caption">Illustrative Struktur · aktueller Stand im Repository</span>
    </div>
  )
}
