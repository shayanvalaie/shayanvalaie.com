import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { disabled } from '../flags'
import { EXPERIENCE } from '../data/content'

/*
  Sticky-stack: each role pins near the top and scales back slightly as the
  next slides over it, so the history reads in sequence. The scale transform
  only engages on desktop with motion allowed; tall cards on a phone would
  otherwise pin content out of reach. `enabled` starts false so the server and
  first client render agree (no hydration mismatch).
*/
function StackCard({
  index,
  total,
  progress,
  role,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  role: (typeof EXPERIENCE)[number]
}) {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const targetScale = 1 - (total - 1 - index) * 0.04
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  // Subtle 3D tilt toward the cursor, spring-smoothed so it has momentum.
  const rotateX = useSpring(0, { stiffness: 150, damping: 18, mass: 0.5 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 18, mass: 0.5 })

  useEffect(() => {
    if (reduceMotion || disabled('stack')) return
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduceMotion])

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!enabled) return
    const r = e.currentTarget.getBoundingClientRect()
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 5)
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 5)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div
      className="stack-card md:sticky"
      style={{ top: `calc(6rem + ${index * 1.75}rem)` }}
    >
      <motion.article
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          enabled ? { scale, rotateX, rotateY, transformPerspective: 1200 } : undefined
        }
        className="origin-top overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex flex-col gap-1 border-b border-line px-7 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {role.title}
            </h3>
            <p className="mt-1 text-accent">{role.company}</p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
            {role.date}
          </p>
        </div>
        <ul className="grid gap-5 px-7 py-7 sm:px-10 lg:grid-cols-2 lg:gap-x-12">
          {role.points.map((point, i) => (
            <li
              key={i}
              className="border-l border-line pl-4 leading-relaxed text-muted"
            >
              {point}
            </li>
          ))}
        </ul>
      </motion.article>
    </div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="experience"
      className="mx-auto max-w-[1320px] scroll-mt-20 px-6 py-28 sm:px-10 lg:px-14 lg:py-44"
    >
      <div className="reveal flex items-end justify-between gap-6">
        <h2 className="text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold tracking-[-0.025em]">
          Experience
        </h2>
        <p className="hidden font-mono text-xs uppercase tracking-[0.12em] text-muted sm:block">
          {EXPERIENCE.length} roles
        </p>
      </div>

      <div ref={containerRef} className="mt-14 flex flex-col gap-10">
        {EXPERIENCE.map((role, i) => (
          <StackCard
            key={role.company}
            index={i}
            total={EXPERIENCE.length}
            progress={scrollYProgress}
            role={role}
          />
        ))}
      </div>
    </section>
  )
}
