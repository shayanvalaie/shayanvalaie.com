import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { TECHNOLOGIES } from '../data/content'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/*
  Marquee that rides the scroll: idle it drifts slowly, scrolling down speeds it
  up, scrolling up reverses it. Logos render twice for a seamless loop.
*/
export default function TechMarquee() {
  const reduceMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smooth, [0, 1200], [0, 4], { clamp: false })
  const direction = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return
    const vf = velocityFactor.get()
    if (vf < 0) direction.current = -1
    else if (vf > 0) direction.current = 1
    let moveBy = direction.current * -1.2 * (delta / 1000)
    moveBy += moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <section
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
                  <img
                    src={`https://cdn.simpleicons.org/${tech.slug}/97969F`}
                    alt={tech.name}
                    width={24}
                    height={24}
                    loading="lazy"
                  />
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
