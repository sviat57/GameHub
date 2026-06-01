import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/games' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
]

type HeaderProps = {
  currentPath?: string
}

const isActiveLink = (href: string, currentPath?: string) => {
  if (!currentPath) {
    return false
  }

  if (href === '/') {
    return currentPath === '/'
  }

  if (href === '/games') {
    return currentPath === '/games' || currentPath.startsWith('/games/')
  }

  return false
}

export function Header({ currentPath }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-arcade-black/45 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="group flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-white"
          aria-label="Neon Game Hub home"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arcade-mint opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-arcade-mint shadow-[0_0_22px_rgba(94,210,156,0.9)]" />
          </span>
          <span className="transition-colors duration-300 group-hover:text-arcade-mint">
            NEON HUB
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              aria-current={isActiveLink(item.href, currentPath) ? 'page' : undefined}
              className={
                isActiveLink(item.href, currentPath)
                  ? 'text-xs font-bold uppercase tracking-[0.22em] text-arcade-mint transition-colors duration-300'
                  : 'text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:text-arcade-mint'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="relative z-50 inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white backdrop-blur-md transition hover:border-arcade-mint/50 hover:text-arcade-mint md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-arcade-black/95 px-6 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <motion.nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <NavLink
                    to={item.href}
                    aria-current={isActiveLink(item.href, currentPath) ? 'page' : undefined}
                    className={
                      isActiveLink(item.href, currentPath)
                        ? 'block border-b border-white/10 py-5 text-2xl font-extrabold uppercase tracking-[0.12em] text-arcade-mint transition-colors'
                        : 'block border-b border-white/10 py-5 text-2xl font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:text-arcade-mint'
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
