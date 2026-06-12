import { useRef, type PointerEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Browsers,
  Database,
  Robot,
  TrendUp,
  type Icon,
} from '@phosphor-icons/react'
import { ABOUT, CAPABILITIES } from '../data/content'

const ICONS: Icon[] = [Browsers, Database, Robot, TrendUp]

/* Asymmetric 12-col bento: 7/5 then 5/7, with varied cell backgrounds. */
const CELL_STYLES = [
  'md:col-span-7 bg-gradient-to-br from-accent-deep/30 via-raised to-raised',
  'md:col-span-5 bg-raised',
  'md:col-span-5 bg-raised [background-image:radial-gradient(var(--color-edge)_1px,transparent_1px)] [background-size:22px_22px]',
  'md:col-span-7 bg-gradient-to-tl from-raised via-raised to-accent-deep/20',
]

export default function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="relative mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 lg:py-40">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="max-w-2xl text-4xl font-bold tracking-tighter sm:text-5xl">
          {ABOUT.headline}
        </h2>
        <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-muted">
          {ABOUT.body}
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12">
        {CAPABILITIES.map((cap, i) => (
          <SpotlightCell key={cap.title} index={i} {...cap} />
        ))}
      </div>
    </section>
  )
}

/*
  Capability cell with a radial spotlight that tracks the cursor. Position is
  written straight to CSS variables, so hover never re-renders the tree.
*/
function SpotlightCell({
  index,
  title,
  description,
}: {
  index: number
  title: string
  description: string
}) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const IconComponent = ICONS[index]

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden rounded-2xl border border-edge p-8 transition-colors duration-300 hover:border-accent/40 ${CELL_STYLES[index]}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(360px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(167, 139, 250, 0.12), transparent 70%)',
        }}
      />
      <IconComponent
        size={30}
        weight="duotone"
        className="text-accent transition-transform duration-300 group-hover:-translate-y-1"
      />
      <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md leading-relaxed text-muted">{description}</p>
    </motion.div>
  )
}
