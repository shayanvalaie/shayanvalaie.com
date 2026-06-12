import { useRef, type ReactNode, type PointerEvent } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react'

/*
  Anchor that leans toward the cursor. Driven entirely by motion values so
  pointer movement never re-renders the React tree.
*/
export default function MagneticButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  const styles =
    variant === 'primary'
      ? 'bg-accent text-base hover:bg-[#b9a3fb]'
      : 'border border-edge text-ink hover:border-accent/60'

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-colors ${styles}`}
    >
      {children}
    </motion.a>
  )
}
