import { useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bug,
  Check,
  ChevronDown,
  Gamepad2,
  GitBranch,
  Heart,
  Network,
  Sprout,
  Telescope,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BrandMark } from './components/BrandMark'
import { Header } from './components/Header'
import { Constellation } from './components/Constellation'
import { ProjectVisual } from './components/ProjectVisual'
import { MotionProvider, useMotion } from './components/MotionProvider'
import { archiveProjects, featuredIds, getProject, projects, type ProjectId } from './data/projects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Portfolio() {
  const root = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<ProjectId>('nexus')
  const { mode, motion, setMode } = useMotion()
  const project = getProject(selected)

  useGSAP(
    () => {
      if (motion !== 'full') return
      gsap.from('.hero-copy > *', {
        y: 24,
        opacity: 0,
        duration: 0.85,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'all',
      })
      gsap.from('.constellation', {
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 25,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: element, start: 'top 92%', once: true },
        })
      })
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  )

  return (
    <div ref={root}>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt
      </a>
      <Header />
      <main id="inhalt">
        <section className="hero section-shell" id="start" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="signal-dot" /> INDEPENDENT DEVELOPER · ALWAYS LEARNING
            </div>
            <h1 id="hero-title">
              Aus Neugier
              <br />
              wird <span className="gradient-text">Software.</span>
            </h1>
            <p className="hero-intro">
              Ich bin <strong>YoungJibbit95.</strong> Ich denke gern in Systemen, finde gern Fehler
              und lerne, indem ich eigene Software baue.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#projekte">
                Meine Projekte <ArrowUpRight size={19} />
              </a>
              <a className="button button--quiet" href="#mensch">
                Der Mensch dahinter <ArrowDown size={18} />
              </a>
            </div>
            <p className="hero-note">
              WORKSPACES <span>·</span> PLANUNG <span>·</span> ENGINES <span>·</span> EXPERIMENTE
            </p>
          </div>
          <Constellation selected={selected} onSelect={setSelected} />
          <a href="#projekte" className="hero-focus" aria-live="polite">
            <span className="hero-focus-label">IM ORBIT</span>
            <span>{project.name}</span>
            <span className="hero-focus-description">{project.tagline}</span>
            <ArrowRight size={18} />
          </a>
          <div className="hero-bottom">
            <span>NEUGIER IST DER AUSGANGSPUNKT.</span>
            <a href="#projekte">
              WEITER ENTDECKEN <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <section className="work section-shell" id="projekte" aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow section-number">01 / MEINE ARBEIT</span>
              <h2 id="work-title">
                Ein Kopf.
                <br />
                <span className="muted-heading">Viele verbundene Welten.</span>
              </h2>
            </div>
            <p>
              Meine Projekte sind die Orte, an denen ich Fragen stelle, Dinge ausprobiere und die
              nächste Version besser mache.
            </p>
          </div>
          <div className="project-tabs" aria-label="Projekt im Fokus">
            {featuredIds.map((id) => (
              <button key={id} onClick={() => setSelected(id)} aria-pressed={selected === id}>
                <span className="tab-dot" />
                {id === 'novacore'
                  ? 'Engines & Welten'
                  : getProject(id)
                      .name.replace(' Ecosystem', '')
                      .replace('Nexus Cerebri', 'Cerebri')}
              </button>
            ))}
          </div>
          <article
            className={`project-feature project-feature--${selected}`}
            aria-label="Projekt im Fokus"
          >
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
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="project-links">
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
            <ProjectVisual id={selected} />
          </article>
          <div className="project-collection" data-reveal>
            <div className="collection-heading">
              <h3>Weitere Welten, weitere Fragen.</h3>
              <span className="eyebrow">DAS EXPERIMENT GEHT WEITER</span>
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
                    <span className="card-category">{item.category}</span>
                    <h4>{item.name}</h4>
                    <p>{item.tagline}</p>
                    <span className="card-stack">{item.stack.join(' / ')}</span>
                  </a>
                ))}
            </div>
          </div>
          <details className="project-archive">
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

        <section className="thinking section-shell" id="denkweise" aria-labelledby="thinking-title">
          <div className="thinking-intro" data-reveal>
            <span className="eyebrow section-number">02 / MEINE DENKWEISE</span>
            <h2 id="thinking-title">
              Ich möchte verstehen,
              <br />
              <span className="gradient-text">warum es funktioniert.</span>
            </h2>
            <p>
              Je größer meine Projekte werden, desto mehr interessiert mich, was um den Code herum
              passiert. Die Struktur. Die Entscheidungen. Die Fehler, die man erst beim zweiten
              Blick findet.
            </p>
            <div className="thinking-signature">
              <Network size={18} />
              <span>VERSTEHEN. PRÜFEN. VERBESSERN.</span>
            </div>
          </div>
          <div className="principles" data-reveal>
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
              <div className="principle" key={item.title}>
                <span className="principle-number">0{index + 1}</span>
                <item.icon size={22} strokeWidth={1.3} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
            <p className="ai-note">
              Ich nutze KI-Agenten als Werkzeuge für Entwicklung, Tests und Analyse. Ihre Ergebnisse
              müssen zur Architektur passen und überprüfbar bleiben.
            </p>
          </div>
        </section>

        <section className="person-section" id="mensch" aria-labelledby="person-title">
          <div className="person-landscape" aria-hidden="true">
            <svg viewBox="0 0 1400 500" preserveAspectRatio="none">
              <path d="M0 425Q160 350 280 396T500 378T730 390T1000 372T1400 390" />
              <path d="M0 455Q210 430 390 445T680 424T980 430T1400 438" />
              <path d="M0 487Q200 456 440 478T850 471T1400 478" />
              <path d="M820 415v-85m0 40q-36-15-46-41q42-4 46 41Zm0-16q33-18 43-48q-42 6-43 48Z" />
            </svg>
          </div>
          <div className="section-shell person-inner">
            <div className="person-copy" data-reveal>
              <span className="eyebrow section-number">03 / DER MENSCH DAHINTER</span>
              <h2 id="person-title">
                Systeme im Kopf.
                <br />
                <span>Natur im Blick.</span>
              </h2>
              <p className="person-lead">Nicht alles passt in ein Repository.</p>
              <p>
                Ich bin wissbegierig, denke gern in Systemen und suche nach Lösungen. Vieles davon
                landet in Software. Aber Musik, Gaming, Cannabisanbau und Zeit in der Natur gehören
                genauso zu mir.
              </p>
              <blockquote>
                „So paradox es klingt: Wenn es nach mir ginge, würde ich Computer und Internet
                wieder abschaffen. Obwohl genau das inzwischen mein größter Interessenbereich
                geworden ist.“
              </blockquote>
              <p className="peace-note">
                <Heart size={16} /> Ich mag die Natur. Und wünsche mir eine friedlichere Welt.
              </p>
            </div>
            <div className="interests" data-reveal>
              <div className="interest">
                <AudioLines size={23} />
                <div>
                  <span>01 / MUSIK</span>
                  <h3>Eine andere Art von Verbindung.</h3>
                </div>
                <div className="mini-wave" aria-hidden="true">
                  {Array.from({ length: 15 }, (_, index) => (
                    <i key={index} style={{ height: `${7 + ((index * 7) % 21)}px` }} />
                  ))}
                </div>
              </div>
              <div className="interest">
                <Gamepad2 size={23} />
                <div>
                  <span>02 / GAMING</span>
                  <h3>In andere Welten eintauchen.</h3>
                </div>
              </div>
              <div className="interest">
                <Sprout size={23} />
                <div>
                  <span>03 / CANNABISANBAU & NATUR</span>
                  <h3>Auch mal etwas wachsen lassen.</h3>
                </div>
              </div>
              <div className="offline-mark">
                <span className="signal-dot" />
                <span>MANCHMAL LIEBER OFFLINE.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="contact section-shell" aria-labelledby="contact-title" data-reveal>
          <span className="eyebrow">DIE NÄCHSTE IDEE IST NOCH OFFEN.</span>
          <h2 id="contact-title">Neugierig geworden?</h2>
          <p>Meine Projekte, Entscheidungen und nächsten Schritte findest du auf GitHub.</p>
          <a
            className="button button--primary"
            href="https://github.com/YoungJibbit95"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitBranch size={18} /> Auf GitHub entdecken <ArrowUpRight size={18} />
          </a>
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
