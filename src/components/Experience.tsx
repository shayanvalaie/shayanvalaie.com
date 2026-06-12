import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react'
import { EXPERIENCE } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'

/*
  Sticky-stack: each role pins near the viewport top and scales back slightly
  as the next one slides over it, so the history reads in sequence. Cards can
  outgrow small viewports, where a pinned card's lower half would become
  unreachable, so the stack only engages from md up.
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
  const stackEnabled = useMediaQuery('(min-width: 768px)')
  const targetScale = 1 - (total - 1 - index) * 0.05
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  return (
    <div
      className="md:sticky"
      style={{ top: `calc(7rem + ${index * 2.25}rem)` }}
    >
      <motion.article
        style={reduceMotion || !stackEnabled ? undefined : { scale }}
        className="origin-top rounded-2xl border border-edge bg-raised p-8 shadow-[0_24px_60px_rgba(5,5,12,0.55)] sm:p-12"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {role.title}
            </h3>
            <p className="mt-1 text-lg font-medium text-accent">
              {role.company}
            </p>
          </div>
          <p className="font-mono text-sm text-muted">{role.date}</p>
        </div>
        <ul className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-x-10">
          {role.points.map((point, i) => (
            <li
              key={i}
              className="border-l-2 border-edge pl-4 leading-relaxed text-muted"
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
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="experience" className="mx-auto max-w-[1400px] scroll-mt-24 px-6 py-28 sm:px-10 lg:py-40">
      <motion.h2
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl font-bold tracking-tighter sm:text-5xl"
      >
        Work experience
      </motion.h2>

      <div ref={containerRef} className="mt-16 flex flex-col gap-12">
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
