import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BrandMark } from './BrandMark'
import { useMotion } from './MotionProvider'

const steps = [
  {
    label: 'Web & UI',
    text: 'Angefangen habe ich mit Webentwicklung, UI-Experimenten und kleineren Projekten. Ich lerne am liebsten, indem ich etwas baue und dabei herausfinde, wie es funktioniert.',
    x: 16,
    y: 25,
    wire: 'M300 232Q163 164 96 118',
  },
  {
    label: 'Nexus',
    text: 'Nexus ist mein langfristiges Hauptprojekt geworden. Hier beschäftigen mich die Gestaltung, die Anwendungen selbst und die Frage, wie die einzelnen Teile zusammenpassen.',
    x: 77,
    y: 24,
    wire: 'M300 232Q394 139 464 114',
    href: '#nexus',
  },
  {
    label: 'Cerebri',
    text: 'Beim Bauen von Planungsoberflächen wollte ich die Entscheidungen dahinter genauer verstehen. Daraus ist Cerebri entstanden – ein Lernprojekt rund um Zeit und Planung.',
    x: 77,
    y: 72,
    wire: 'M300 232Q396 304 464 344',
    href: '#cerebri',
  },
  {
    label: 'Engines & Spiele',
    text: 'Mit NovaCore, Nemisis, Adventura und YjsE probiere ich mich auch an eigenen Engines und Spielen. Damit beschäftige ich mich mit ganz anderen Fragen als bei einer Oberfläche.',
    x: 17,
    y: 72,
    wire: 'M300 232Q161 309 103 344',
    href: '#github',
  },
]
export function JourneyField() {
  const [selected, setSelected] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()
  useGSAP(
    () => {
      if (motion !== 'full') return
      gsap.fromTo(
        '.journey-focus',
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          clearProps: 'strokeDashoffset',
        },
      )
      gsap.from('.journey-summary', { y: 10, opacity: 0, duration: 0.4, clearProps: 'all' })
    },
    { scope: root, dependencies: [selected, motion], revertOnUpdate: true },
  )
  return (
    <div className="journey-field intro-map-art atlas-visual" ref={root}>
      <div className="journey-space">
        <svg viewBox="0 0 600 470" aria-hidden="true">
          <defs>
            <linearGradient id="journey-spectrum">
              <stop stopColor="#71d5e6" />
              <stop offset="1" stopColor="#b99bea" />
            </linearGradient>
          </defs>
          <g className="journey-orbits">
            <ellipse cx="300" cy="232" rx="238" ry="142" transform="rotate(-24 300 232)" />
            <ellipse cx="300" cy="232" rx="224" ry="92" transform="rotate(27 300 232)" />
            <ellipse cx="300" cy="232" rx="155" ry="194" transform="rotate(38 300 232)" />
          </g>
          <path className="journey-focus" pathLength="1" d={steps[selected].wire} />
          <circle className="journey-star" cx="533" cy="180" r="3" />
          <circle className="journey-star" cx="278" cy="42" r="2" />
        </svg>
        <div className="journey-center" aria-hidden="true">
          <div className="journey-halo" />
          <BrandMark />
        </div>
        {steps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            className={`journey-planet journey-planet--${index}`}
            style={{ left: `${step.x}%`, top: `${step.y}%` }}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span className="planet-sphere" aria-hidden="true" />
            <span>{step.label}</span>
          </button>
        ))}
      </div>
      <div className="journey-summary" aria-live="polite">
        <span className="section-label">Mein Weg / {steps[selected].label}</span>
        <p>{steps[selected].text}</p>
        {steps[selected].href && (
          <a href={steps[selected].href}>
            Zum Bereich <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </div>
  )
}
