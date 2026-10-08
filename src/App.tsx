import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Header } from './components/Header'
import { AtlasGraphics } from './components/AtlasGraphics'
import { SpaceBackdrop } from './components/SpaceBackdrop'
import { MotionProvider, useMotion } from './components/MotionProvider'

gsap.registerPlugin(useGSAP, ScrollTrigger)
const layers = [
  { id: 'start', label: 'Überblick' },
  { id: 'nexus', label: 'Nexus' },
  { id: 'cerebri', label: 'Cerebri' },
  { id: 'stack', label: 'Stack' },
  { id: 'arbeitsweise', label: 'Arbeitsweise' },
]
const stack = [
  { area: 'Oberflächen', tools: 'TypeScript · React', project: 'Nexus' },
  { area: 'Desktop & Mobile', tools: 'Electron · Capacitor', project: 'Nexus Clients' },
  { area: 'Planung', tools: 'Rust', project: 'Cerebri' },
  { area: 'Engines & Spiele', tools: 'C++ · C# · Java', project: 'NovaCore · YjsE · Adventura' },
  { area: 'Tools & Entwicklung', tools: 'Python · GitHub Actions', project: 'YJarvis · Releases' },
]

function Atlas() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState('start')
  const { mode, motion, setMode } = useMotion()
  useEffect(() => {
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        })
        const next = [...visible].sort((a, b) => b[1] - a[1])[0]
        if (next) setActive(next[0])
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75] },
    )
    root.current!.querySelectorAll('.atlas-layer').forEach((layer) => observer.observe(layer))
    return () => observer.disconnect()
  }, [])
  useGSAP(
    () => {
      if (motion !== 'full') return
      gsap.from('.atlas-intro-copy > *', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all',
      })
      gsap.utils.toArray<HTMLElement>('.atlas-layer:not(.atlas-intro)').forEach((layer, index) => {
        const panel = layer.querySelector('.layer-panel')
        const visual = layer.querySelector('.atlas-visual')
        const elements = layer.querySelectorAll('[data-fly]')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: layer, start: 'top 90%', end: 'bottom 8%', scrub: 0.65 },
        })
        timeline.fromTo(
          panel,
          { y: 90, autoAlpha: 0, rotationX: 3, filter: 'blur(9px)' },
          {
            y: 0,
            autoAlpha: 1,
            rotationX: 0,
            filter: 'blur(0px)',
            duration: 0.22,
            ease: 'power2.out',
          },
          0,
        )
        if (visual)
          timeline.fromTo(
            visual,
            { x: index % 2 === 0 ? 90 : -90, rotationY: index % 2 === 0 ? -6 : 6 },
            { x: 0, rotationY: 0, duration: 0.3, ease: 'power2.out' },
            0,
          )
        if (elements.length)
          timeline.from(
            elements,
            { y: 32, opacity: 0, stagger: 0.025, duration: 0.2, ease: 'power2.out' },
            0.04,
          )
        timeline.to(
          panel,
          {
            y: -70,
            autoAlpha: 0,
            rotationX: -2,
            filter: 'blur(7px)',
            duration: 0.14,
            ease: 'power2.in',
          },
          0.86,
        )
      })
      gsap.from('.intro-map-art', {
        x: 40,
        opacity: 0,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
      })
      gsap.from('.work-trace', {
        strokeDashoffset: 1,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '#arbeitsweise', start: 'top 80%', once: true },
      })
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  )
  return (
    <div ref={root}>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt
      </a>
      <SpaceBackdrop />
      <Header />
      <nav className="atlas-index" aria-label="Atlas-Ebenen">
        {layers.map((layer, index) => (
          <a
            key={layer.id}
            href={`#${layer.id}`}
            aria-label={layer.label}
            aria-current={active === layer.id ? 'location' : undefined}
          >
            <span aria-hidden="true">0{index}</span>
            <span className="index-label">{layer.label}</span>
          </a>
        ))}
      </nav>
      <main id="inhalt">
        <section className="atlas-layer atlas-intro" id="start" aria-labelledby="intro-title">
          <div className="layer-panel section-shell">
            <div className="atlas-intro-copy">
              <span className="section-label">Entwicklerportfolio</span>
              <h1 id="intro-title" aria-label="YoungJibbit95">
                Young
                <br />
                <span>Jibbit95</span>
              </h1>
              <p>
                Angefangen habe ich mit Webentwicklung, UI-Experimenten und kleineren Projekten. Mit
                Nexus kamen größere Anwendungen dazu. Cerebri hat mich dann tiefer in Zeit und
                Planung geführt.
              </p>
              <div className="plain-links">
                <a href="#nexus">
                  Atlas durchscrollen <ArrowDown size={18} />
                </a>
                <a
                  href="https://github.com/YoungJibbit95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
            <AtlasGraphics type="intro" />
          </div>
        </section>
        <section className="atlas-layer" id="nexus" aria-labelledby="nexus-title">
          <div className="layer-panel section-shell">
            <div className="layer-copy">
              <span className="section-label">01 / Nexus Ecosystem</span>
              <h2 id="nexus-title">Nexus.</h2>
              <p className="layer-lead">Vom eigenen Workspace zu verbundenen Apps.</p>
              <ol className="origin-list">
                <li data-fly>
                  <span>Ausgangspunkt</span>
                  <p>
                    Ich wollte einen eigenen Workspace für Notizen, Aufgaben und Dateien. Daraus ist
                    Nexus entstanden.
                  </p>
                </li>
                <li data-fly>
                  <span>Entwicklung</span>
                  <p>
                    Aus dem Workspace ist nach und nach ein Ecosystem für Desktop und Mobile
                    geworden. Das Projekt hat mich zu Themen geführt, die über die Oberfläche
                    hinausgehen.
                  </p>
                </li>
                <li data-fly>
                  <span>Gemeinsame Grundlage</span>
                  <p>
                    Heute arbeite ich an vier verbundenen Clients. Eine gemeinsame Grundlage hält
                    Darstellung, Bewegung und grundlegendes Verhalten zusammen.
                  </p>
                </li>
              </ol>
              <div className="plain-links">
                <a
                  href="https://github.com/YoungJibbit95/Nexus-Ecosystem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repository <ArrowUpRight size={16} />
                </a>
                <a href="https://nexusproject.dev" target="_blank" rel="noopener noreferrer">
                  Produktwebsite <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <AtlasGraphics type="nexus" />
          </div>
        </section>
        <section className="atlas-layer" id="cerebri" aria-labelledby="cerebri-title">
          <div className="layer-panel section-shell">
            <div className="layer-copy">
              <span className="section-label">02 / Nexus Cerebri</span>
              <h2 id="cerebri-title">Cerebri.</h2>
              <p className="layer-lead">Die Planung hinter der Kalenderansicht.</p>
              <ol className="origin-list">
                <li data-fly>
                  <span>Die Frage dahinter</span>
                  <p>
                    Beim Bauen von Planungsoberflächen wollte ich genauer verstehen, wie die
                    Entscheidungen dahinter zustande kommen.
                  </p>
                </li>
                <li data-fly>
                  <span>Der Ansatz</span>
                  <p>
                    Daraus ist Cerebri geworden: Zeit, Regeln und bekannte Informationen werden so
                    beschrieben, dass sich ein Vorschlag prüfen lässt.
                  </p>
                </li>
                <li data-fly>
                  <span>Aktueller Stand</span>
                  <p>
                    Ich entwickle die Grundlage in Rust und nutze sie als Lernprojekt. Eine spätere
                    Einbindung in Nexus ist geplant.
                  </p>
                </li>
              </ol>
              <div className="plain-links">
                <a
                  href="https://github.com/YoungJibbit95/Nexus-Cerebri"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repository <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <AtlasGraphics type="cerebri" />
          </div>
        </section>
        <section className="atlas-layer" id="stack" aria-labelledby="stack-title">
          <div className="layer-panel section-shell stack-panel">
            <div className="layer-copy">
              <span className="section-label">03 / Tech-Stack</span>
              <h2 id="stack-title">Mein Stack.</h2>
              <p className="layer-lead">Die Werkzeuge richten sich nach dem Projekt.</p>
              <p className="body-copy">
                Ich arbeite mit unterschiedlichen Sprachen und Plattformen. Von Oberflächen und Apps
                bis zu Planung, Engines und kleinen Tools.
              </p>
            </div>
            <div className="stack-map atlas-visual">
              {stack.map((item, index) => (
                <div className={`stack-area stack-area--${index}`} key={item.area} data-fly>
                  <span>{item.area}</span>
                  <h3>{item.tools}</h3>
                  <p>{item.project}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="atlas-layer" id="arbeitsweise" aria-labelledby="working-title">
          <div className="layer-panel section-shell">
            <div className="layer-copy">
              <span className="section-label">04 / Denk- und Arbeitsweise</span>
              <h2 id="working-title">So arbeite ich.</h2>
              <p className="layer-lead">Konkrete Projekte, nachvollziehbare Schritte.</p>
              <p className="body-copy">
                Ich denke gern in Systemen und suche nach Fehlern. Neue Themen erschließe ich mir
                über eigene Projekte. Änderungen prüfe ich, wichtige Entscheidungen halte ich fest.
              </p>
              <p className="body-copy">
                KI-Tools nutze ich für Code, Tests und Dokumentation. Die Ergebnisse prüfe ich wie
                andere Änderungen auch.
              </p>
            </div>
            <AtlasGraphics type="work" />
          </div>
        </section>
      </main>
      <footer className="atlas-footer section-shell" id="github">
        <div>
          <a
            className="footer-github"
            href="https://github.com/YoungJibbit95"
            target="_blank"
            rel="noopener noreferrer"
          >
            YoungJibbit95 auf GitHub <ArrowUpRight size={22} />
          </a>
          <p>
            Weitere Projekte:{' '}
            <a
              href="https://github.com/YoungJibbit95/Novacore-Engine"
              target="_blank"
              rel="noopener noreferrer"
            >
              NovaCore
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/YoungJibbit95/Nemisis"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nemisis
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/YoungJibbit95/Adventura"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adventura
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/YoungJibbit95/YJarvis"
              target="_blank"
              rel="noopener noreferrer"
            >
              YJarvis
            </a>
          </p>
        </div>
        <label className="motion-control">
          Bewegung{' '}
          <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="auto">Systemeinstellung</option>
            <option value="full">Voll</option>
            <option value="reduced">Reduziert</option>
            <option value="off">Aus</option>
          </select>
        </label>
        <a className="back-top" href="#start">
          Nach oben <ArrowUpRight size={15} />
        </a>
      </footer>
    </div>
  )
}
export default function App() {
  return (
    <MotionProvider>
      <Atlas />
    </MotionProvider>
  )
}
