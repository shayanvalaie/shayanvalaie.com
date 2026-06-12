import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { ArrowDown } from '@phosphor-icons/react'
import ParticleField from './ParticleField'
import MagneticButton from './MagneticButton'
import { HERO } from '../data/content'

const headlineWords = HERO.greeting.split(' ')

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Layered parallax: copy drifts up and fades, glow drifts slower.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { y: glowY }}
        className="absolute inset-0"
      >
        <div className="absolute -top-32 right-[-15%] h-[34rem] w-[34rem] rounded-full bg-accent-deep/25 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[28rem] w-[28rem] rounded-full bg-accent-deep/15 blur-[120px]" />
      </motion.div>

      <ParticleField />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-16 sm:px-10 lg:pl-[8vw]"
      >
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl">
          {headlineWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                initial={reduceMotion ? false : { y: '100%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block ${i === headlineWords.length - 1 ? 'text-accent' : ''}`}
              >
                {word}
                {i < headlineWords.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {HERO.subtext}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#experience" variant="primary">
            View my experience
            <ArrowDown size={18} weight="bold" />
          </MagneticButton>
          <MagneticButton href="#contact" variant="secondary">
            Contact
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
