import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import {
  siDjango,
  siDotnet,
  siGo,
  siGooglecloud,
  siGraphql,
  siJavascript,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siRabbitmq,
  siReact,
  siSolidity,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'
import { disabled } from '../flags'
import { TECHNOLOGIES } from '../data/content'

/* Icons bundled from the simple-icons package: no runtime requests to a
   third-party CDN, no icon pop-in while the strip is already moving. */
const ICONS: Record<string, { path: string }> = {
  typescript: siTypescript,
  javascript: siJavascript,
  go: siGo,
  python: siPython,
  react: siReact,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  graphql: siGraphql,
  dotnet: siDotnet,
  django: siDjango,
  tailwindcss: siTailwindcss,
  rabbitmq: siRabbitmq,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  solidity: siSolidity,
  googlecloud: siGooglecloud,
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/*
  Marquee that rides the scroll: idle it drifts slowly, scrolling down speeds it
  up, scrolling up reverses it. Logos render twice for a seamless loop.
*/
export default function TechMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  // Only advance the marquee while it's on screen; the rAF loop would
  // otherwise run for the life of the page.
  const inView = useInView(sectionRef)
  const reduceMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smooth, [0, 1200], [0, 4], { clamp: false })
  const direction = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !inView || disabled('marquee')) return
    const vf = velocityFactor.get()
    if (vf < 0) direction.current = -1
    else if (vf > 0) direction.current = 1
    let moveBy = direction.current * -1.2 * (delta / 1000)
    moveBy += moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Technologies"
      className="border-y border-line py-12"
    >
      <div className="marquee-mask overflow-hidden">
        <motion.div style={{ x }} className="flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center"
            >
              {TECHNOLOGIES.map((tech) => (
                <div
                  key={`${copy}-${tech.slug}`}
                  className="flex items-center gap-3 px-8 opacity-55 transition-opacity duration-300 hover:opacity-100"
                >
                  <svg
                    role="img"
                    aria-label={tech.name}
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    fill="#97969F"
                  >
                    <path d={ICONS[tech.slug].path} />
                  </svg>
                  {!('iconOnly' in tech && tech.iconOnly) && (
                    <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em] text-muted">
                      {tech.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
