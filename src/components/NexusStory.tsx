import { useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Layers, Network } from 'lucide-react'
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
  },
]

export function NexusStory() {
  const [chapter, setChapter] = useState(0)
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

  return (
    <section
      ref={root}
      className="nexus-story section-shell"
      id="nexus-geschichte"
      aria-labelledby="nexus-story-title"
    >
      <header className="story-heading" data-reveal>
        <div>
          <span className="eyebrow section-number">02 / PROJEKTGESCHICHTE</span>
          <h2 id="nexus-story-title">
            Nexus.
            <span>
              Eine Idee, die mich
              <br />
              weiterlernen lässt.
            </span>
          </h2>
        </div>
        <div className="story-introduction">
          <span className="handwritten">Mein langfristiges Experiment.</span>
          <p>
            Hier laufen viele meiner Interessen zusammen: Gestaltung, Architektur und die Frage, wie
            Software sich im Alltag anfühlen sollte.
          </p>
          <dl className="story-facts">
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

      <div className="story-navigation" role="group" aria-label="Kapitel der Nexus-Geschichte">
        {chapters.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={chapter === index}
            aria-controls={contentId}
            onClick={() => setChapter(index)}
          >
            <span className="chapter-number">0{index + 1}</span>
            <span>{item.label}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="story-body" id={contentId}>
        <div className="story-chapter-copy" aria-live="polite">
          <span className="eyebrow story-step-label">
            0{chapter + 1} / 03 · {current.label}
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
