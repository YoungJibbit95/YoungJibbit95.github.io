import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useMotion } from './MotionProvider'

export function NexusField() {
  const [view, setView] = useState<'workspace' | 'system'>('workspace')
  const root = useRef<HTMLDivElement>(null)
  const { motion } = useMotion()
  useGSAP(
    () => {
      if (motion !== 'full') return
      gsap.from('.nexus-field-view', {
        y: 20,
        opacity: 0,
        scale: 0.96,
        duration: 0.65,
        clearProps: 'all',
        ease: 'power3.out',
      })
      gsap.fromTo(
        '.core-wire',
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1,
          stagger: 0.08,
          clearProps: 'strokeDashoffset',
          ease: 'power2.inOut',
        },
      )
    },
    { scope: root, dependencies: [view, motion], revertOnUpdate: true },
  )
  return (
    <div className="nexus-field atlas-visual" ref={root}>
      <div className="field-switch" role="group" aria-label="Nexus-Darstellung">
        <button
          type="button"
          aria-pressed={view === 'workspace'}
          onClick={() => setView('workspace')}
        >
          Workspace
        </button>
        <button type="button" aria-pressed={view === 'system'} onClick={() => setView('system')}>
          Gemeinsamer Kern
        </button>
      </div>
      <div className="nexus-field-view">
        {view === 'workspace' ? (
          <figure className="nexus-plate">
            <img
              className="nexus-background-shot"
              src="/media/nexus/notes.png"
              alt=""
              width="1600"
              height="827"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
            <a
              className="nexus-main-shot"
              href="/media/nexus/dashboard.png"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nexus-Aufnahme in voller Größe öffnen"
            >
              <img
                src="/media/nexus/dashboard.png"
                alt="Nexus Main v6 Beta: Dashboard mit Notizen, Aufgaben und zuletzt bearbeiteten Inhalten"
                width="1600"
                height="827"
                loading="lazy"
                decoding="async"
              />
              <span>
                Aufnahme öffnen <ArrowUpRight size={15} />
              </span>
            </a>
            <div className="nexus-client-strip">
              <span>Main</span>
              <span>Mobile</span>
              <span>Code</span>
              <span>Code Mobile</span>
            </div>
            <figcaption>
              Produktaufnahmen: Nexus Main v6 Beta.
              <br />
              Den aktuellen Stand dokumentiert das Repository.
            </figcaption>
          </figure>
        ) : (
          <div className="nexus-system">
            <svg viewBox="0 0 600 440" preserveAspectRatio="none" aria-hidden="true">
              <path className="core-wire" pathLength="1" d="M123 111Q180 230 300 230" />
              <path className="core-wire" pathLength="1" d="M477 111Q420 230 300 230" />
              <path className="core-wire" pathLength="1" d="M123 354Q180 230 300 230" />
              <path className="core-wire" pathLength="1" d="M477 354Q420 230 300 230" />
            </svg>
            <span className="system-client system-client--main">
              Nexus Main<small>Desktop Workspace</small>
            </span>
            <span className="system-client system-client--mobile">
              Nexus Mobile<small>Mobile Workspace</small>
            </span>
            <span className="system-client system-client--code">
              Nexus Code<small>Desktop Coding</small>
            </span>
            <span className="system-client system-client--code-mobile">
              Code Mobile<small>Mobile Coding</small>
            </span>
            <span className="system-core">
              @nexus/core<small>Gemeinsame Runtime</small>
            </span>
            <p>Vier Oberflächen teilen eine technische Grundlage.</p>
          </div>
        )}
      </div>
    </div>
  )
}
