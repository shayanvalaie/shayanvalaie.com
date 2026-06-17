import { useRef, type PointerEvent } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import Button from './Button'
import { HERO } from '../data/content'

const nameLines = HERO.name.split(' ')

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 140])

  // Move the violet "spotlight" mask to the cursor. Coordinates are written
  // straight to the overlay's CSS variables, so this never re-renders React.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = overlayRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const maskStyle = {
    maskImage:
      'radial-gradient(circle 150px at var(--mx, -300px) var(--my, -300px), #000 0%, #000 28%, transparent 72%)',
    WebkitMaskImage:
      'radial-gradient(circle 150px at var(--mx, -300px) var(--my, -300px), #000 0%, #000 28%, transparent 72%)',
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: auroraY }}
        className="absolute inset-0"
      >
        <div className="aurora absolute -left-[10%] top-[8%] h-[42rem] w-[42rem] rounded-full bg-accent-deep/22 blur-[150px]" />
        <div className="aurora absolute -right-[12%] bottom-[2%] h-[34rem] w-[34rem] rounded-full bg-accent/12 blur-[140px]" />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-14"
      >
        <p
          className="rise font-mono text-xs uppercase tracking-[0.28em] text-accent"
          style={{ animationDelay: '0ms' }}
        >
          {HERO.role}
        </p>

        <h1 className="mt-6 select-none text-[clamp(3rem,11vw,8rem)] font-bold leading-[0.9] tracking-[-0.035em]">
          {nameLines.map((line, i) => (
            <span key={line} className="relative block">
              <span
                className="rise block"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
          {/* Accent reveal layered over the whole name, masked to the cursor. */}
          <span
            ref={overlayRef}
            aria-hidden
            style={maskStyle}
            className="pointer-events-none absolute inset-0 text-accent"
          >
            {nameLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </h1>

        <p
          className="rise mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          style={{ animationDelay: '320ms' }}
        >
          {HERO.subtext}
        </p>

        <div
          className="rise mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: '420ms' }}
        >
          <Button href="#experience" variant="primary">
            View experience
            <ArrowDown size={17} weight="bold" />
          </Button>
          <Button href="#contact" variant="secondary">
            Get in touch
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
