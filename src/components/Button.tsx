import { useRef, type ReactNode, type PointerEvent } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react'

/*
  Link styled as a CTA. Primary leans toward the cursor (spring-driven motion
  values, so pointer movement never re-renders React) and presses down on tap.
*/
export default function Button({
  href,
  children,
  variant = 'primary',
  external = false,
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || variant !== 'primary' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3)
    y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const styles =
    variant === 'primary'
      ? 'bg-ink text-bg hover:bg-white'
      : 'border border-line text-ink hover:border-accent/60 hover:text-accent'

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      style={variant === 'primary' ? { x: sx, y: sy } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-medium transition-colors duration-200 ${styles}`}
    >
      {children}
    </motion.a>
  )
}
