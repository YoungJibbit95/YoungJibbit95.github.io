import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useMotion } from './MotionProvider'

const states = [
  {
    label: 'Zeitfenster',
    x: 135,
    text: 'Zwischen 09:00 und 10:00 UTC ist bereits ein Termin eingetragen.',
  },
  {
    label: 'Konflikt',
    x: 135,
    text: 'Ein Start um 09:30 würde sich mit diesem Termin überschneiden.',
  },
  {
    label: 'Vorschlag',
    x: 210,
    text: 'Ein Start um 10:00 lässt Platz für einen 30-minütigen Termin.',
  },
]
export function CerebriField() {
  const [step, setStep] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()
  useEffect(() => {
    const target = root.current!.querySelector('.candidate-slot')
    const tween = gsap.to(target, {
      attr: { x: states[step].x },
      duration: motion === 'full' ? 0.7 : 0,
      ease: 'power3.inOut',
    })
    return () => {
      tween.kill()
    }
  }, [step, motion])
  return (
    <figure className="cerebri-plate atlas-visual" ref={root} data-step={step}>
      <div className="planning-sheet">
        <span className="sheet-label">ZEIT & PLANUNG</span>
        <svg viewBox="0 0 590 280" role="img" aria-label={`Planungsbeispiel: ${states[step].text}`}>
          <g className="time-grid">
            {[60, 210, 360, 510].map((x) => (
              <path key={x} d={`M${x} 70V218`} />
            ))}
            <path d="M60 145H510" />
          </g>
          <g className="time-labels">
            <text x="60" y="50">
              09:00
            </text>
            <text x="210" y="50">
              10:00
            </text>
            <text x="360" y="50">
              11:00
            </text>
            <text x="510" y="50">
              12:00
            </text>
          </g>
          <rect className="busy-slot" x="60" y="100" width="150" height="44" rx="5" />
          <text className="slot-text" x="82" y="128">
            Belegt
          </text>
          <rect className="candidate-slot" x="135" y="165" width="75" height="44" rx="5" />
          <text className="candidate-note slot-text" x="340" y="192">
            {step === 1 ? 'Konflikt' : '30 Min.'}
          </text>
        </svg>
        <span className="time-zone">UTC · vereinfachtes Beispiel</span>
      </div>
      <div className="field-switch" role="group" aria-label="Cerebri-Planungsbeispiel">
        {states.map((state, index) => (
          <button
            key={state.label}
            type="button"
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            {state.label}
          </button>
        ))}
      </div>
      <figcaption aria-live="polite">{states[step].text}</figcaption>
    </figure>
  )
}
