import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, GitBranch, Menu, X } from 'lucide-react'
import { BrandMark } from './BrandMark'

const links = [
  { href: '#projekte', label: 'Projekte' },
  { href: '#denkweise', label: 'Denkweise' },
  { href: '#mensch', label: 'Über mich' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])

  return (
    <header className="site-header">
      <nav className="navigation" aria-label="Hauptnavigation">
        <a href="#start" className="brand" aria-label="YoungJibbit95 – zum Anfang">
          <BrandMark />
          <span>
            YoungJibbit95<small>INDEPENDENT DEVELOPER</small>
          </span>
        </a>
        <div className="desktop-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <a
          className="github-link"
          href="https://github.com/YoungJibbit95"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub-Profil öffnen"
        >
          <GitBranch size={16} />
          <span>GitHub</span>
          <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          ref={trigger}
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      <div className="mobile-navigation" id="mobile-navigation" hidden={!open}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
            <ArrowUpRight size={18} />
          </a>
        ))}
      </div>
    </header>
  )
}
