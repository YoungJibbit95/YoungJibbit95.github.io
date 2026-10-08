import { useEffect, useId, useRef, useState } from 'react'
import { AudioLines, Box, Orbit, Workflow } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useMotion } from './MotionProvider'
import type { ProjectId } from '../data/projects'

const nodes = [
  {
    id: 'nexus' as const,
    label: 'Nexus',
    sub: 'Verbundene Workspaces',
    icon: Orbit,
    x: 116,
    y: 163,
    path: 'M300 300Q147 270 116 163',
  },
  {
    id: 'cerebri' as const,
    label: 'Cerebri',
    sub: 'Nachvollziehbare Planung',
    icon: Workflow,
    x: 494,
    y: 142,
    path: 'M300 300Q447 298 494 142',
  },
  {
    id: 'novacore' as const,
    label: 'Eigene Welten',
    sub: 'Engines & Spiele',
    icon: Box,
    x: 109,
    y: 458,
    path: 'M300 300Q125 351 109 458',
  },
  {
    id: 'jarvis' as const,
    label: 'YJarvis',
    sub: 'Lokale Assistenz',
    icon: AudioLines,
    x: 491,
    y: 451,
    path: 'M300 300Q456 337 491 451',
  },
]

export function Constellation({
  selected,
  onSelect,
}: {
  selected: ProjectId
  onSelect: (id: ProjectId) => void
}) {
  const scene = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()
  const gradient = `orbit-${useId().replaceAll(':', '')}`
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (scene.current) observer.observe(scene.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={scene}
      className={`constellation ${visible ? 'is-visible' : ''}`}
      aria-label="Meine Projektkonstellation"
      data-motion-scene={motion}
    >
      <div className="scene-kicker">
        <span className="signal-dot" /> WORAN ICH BAUE
      </div>
      <div className="scene-glow" aria-hidden="true" />
      <svg className="orbit-map" viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <linearGradient id={gradient} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#62d6ef" />
            <stop offset=".6" stopColor="#8499ed" />
            <stop offset="1" stopColor="#b794ef" />
          </linearGradient>
        </defs>
        <g className="orbit-guides" stroke={`url(#${gradient})`}>
          <path d="M78 295C38 186 204 65 350 92S592 284 498 431S167 548 91 381" />
          <path d="M111 174C243 85 451 143 522 319S402 555 252 485S101 301 167 218" />
          <path d="M74 369C205 283 356 358 522 224" />
        </g>
        <g className="orbit-connections">
          {nodes.map((node) => (
            <path key={node.id} d={node.path} className={selected === node.id ? 'is-active' : ''} />
          ))}
        </g>
        <g className="orbit-points">
          {[
            [54, 273],
            [328, 47],
            [512, 305],
            [299, 560],
            [376, 100],
            [82, 95],
            [552, 496],
            [233, 447],
          ].map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r={index % 3 === 0 ? 2.8 : 1.6} />
          ))}
        </g>
        <g className="orbit-traveler">
          <circle cx="300" cy="58" r="4" />
          <circle cx="300" cy="58" r="9" opacity=".1" />
        </g>
      </svg>
      <div className="scene-core" aria-hidden="true">
        <div className="core-rings" />
        <BrandMark className="core-mark" />
        <span>IDEEN VERBINDEN</span>
      </div>
      <span className="map-handwriting" aria-hidden="true">
        immer eine neue Frage.
      </span>
      <div className="scene-nodes">
        {nodes.map((node) => (
          <button
            key={node.id}
            className={`orbit-node orbit-node--${node.id}`}
            aria-pressed={selected === node.id}
            onClick={() => onSelect(node.id)}
            style={
              { '--node-x': `${node.x / 6}%`, '--node-y': `${node.y / 6}%` } as React.CSSProperties
            }
          >
            <node.icon size={20} strokeWidth={1.6} />
            <span>
              {node.label}
              <small>{node.sub}</small>
            </span>
            <span className="node-signal" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="scene-coordinate" aria-hidden="true">
        <span>BUILD · BREAK · LEARN</span>
        <span>01 — ∞</span>
      </div>
      <p className="scene-caption">Wähle eine Welt. Entdecke die Idee dahinter.</p>
    </div>
  )
}
