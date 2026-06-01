import { Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  const links = [
    { label: 'Games', href: '/games' },
    { label: 'Projects', href: '/#projects' },
    { label: 'GitHub', href: '/#projects' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-8 text-sm text-white/56 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-extrabold uppercase tracking-[0.18em] text-white">
            NEON HUB
          </p>
          <p className="mt-2">
            Mini games rebuilt for the web with React, TypeScript and Tailwind.
          </p>
          <p className="mt-4 text-xs text-white/40">© 2025 Neon Game Hub</p>
        </div>

        <nav className="flex flex-wrap gap-4 md:justify-end" aria-label="Footer navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white/70 transition hover:text-arcade-mint"
            >
              {link.label === 'GitHub' ? <Github size={15} strokeWidth={2.5} /> : null}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
