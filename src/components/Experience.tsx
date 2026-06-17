import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
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

  useEffect(() => {
    if (reduceMotion) return
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduceMotion])

  return (
    <div className="md:sticky" style={{ top: `calc(6rem + ${index * 1.75}rem)` }}>
      <motion.article
        style={enabled ? { scale } : undefined}
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
