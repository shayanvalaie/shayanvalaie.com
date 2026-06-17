import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { List, X } from '@phosphor-icons/react'
import { NAV_LINKS } from '../data/content'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 32))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line/70 bg-bg/75 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 sm:px-10">
        <a href="#top" className="font-mono text-sm tracking-tight text-ink">
          SV<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-10 sm:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="font-mono text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-ink sm:hidden"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="border-b border-line bg-bg/95 px-6 pb-6 backdrop-blur-md sm:hidden"
          >
            <ul className="flex flex-col gap-4 pt-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="block font-mono text-sm uppercase tracking-[0.12em] text-muted hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
