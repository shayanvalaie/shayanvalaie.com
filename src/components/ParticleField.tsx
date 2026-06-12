import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

type Particle = {
  x: number
  y: number
  z: number // depth 0..1, drives size, speed, and pointer parallax
  vx: number
  vy: number
  kx: number // impulse from click bursts, decays each frame
  ky: number
}

const ACCENT = { r: 167, g: 139, b: 250 }
const LINK_DISTANCE = 110
const CURSOR_LINK_DISTANCE = 180
const REPEL_RADIUS = 130
const BURST_RADIUS = 240

/*
  Interactive particle constellation behind the hero. The field links nearby
  particles to the cursor, bends gently away from it, and scatters on click.
  Drawn straight to canvas in a rAF loop; React state is never touched.
*/
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let visible = true
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, inside: false }

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(Math.floor((width * height) / 16000), 110)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        kx: 0,
        ky: 0,
      }))
    }

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height)
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      const px = pointer.x * width
      const py = pointer.y * height

      for (const p of particles) {
        if (animate) {
          p.x += p.vx * (0.4 + p.z) + p.kx
          p.y += p.vy * (0.4 + p.z) + p.ky
          p.kx *= 0.92
          p.ky *= 0.92
          if (p.x < -20) p.x = width + 20
          if (p.x > width + 20) p.x = -20
          if (p.y < -20) p.y = height + 20
          if (p.y > height + 20) p.y = -20
        }
      }

      // Pointer parallax: deeper particles shift more.
      const ox = (pointer.x - 0.5) * 40
      const oy = (pointer.y - 0.5) * 40

      // Screen-space positions, with a gentle bend away from the cursor.
      const px_ = new Float32Array(particles.length)
      const py_ = new Float32Array(particles.length)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        let sx = p.x + ox * p.z
        let sy = p.y + oy * p.z
        if (pointer.inside) {
          const dx = sx - px
          const dy = sy - py
          const dist = Math.hypot(dx, dy)
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = (1 - dist / REPEL_RADIUS) ** 2 * 36 * (0.4 + p.z)
            sx += (dx / dist) * force
            sy += (dy / dist) * force
          }
        }
        px_[i] = sx
        py_[i] = sy
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        const ax = px_[i]
        const ay = py_[i]
        for (let j = i + 1; j < particles.length; j++) {
          const dx = ax - px_[j]
          const dy = ay - py_[j]
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.14
            ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(px_[j], py_[j])
            ctx.stroke()
          }
        }

        // The field notices the cursor: nearby particles tether to it
        // and glow brighter the closer they are.
        let proximity = 0
        if (pointer.inside) {
          const dx = ax - px
          const dy = ay - py
          const dist = Math.hypot(dx, dy)
          if (dist < CURSOR_LINK_DISTANCE) {
            proximity = 1 - dist / CURSOR_LINK_DISTANCE
            ctx.strokeStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${proximity * 0.5})`
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(px, py)
            ctx.stroke()
          }
        }

        const size = 0.8 + a.z * 1.6 + proximity * 1.2
        const alpha = Math.min(0.25 + a.z * 0.45 + proximity * 0.35, 1)
        ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(ax, ay, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Soft node where the cursor sits, anchoring the tethers.
      if (pointer.inside && !document.hidden) {
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 26)
        glow.addColorStop(0, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.5)`)
        glow.addColorStop(1, `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, 26, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(${ACCENT.r}, ${ACCENT.g}, ${ACCENT.b}, 0.9)`
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw(true)
      raf = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      cancelAnimationFrame(raf)
      if (visible && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = (e.clientX - rect.left) / rect.width
      pointer.ty = (e.clientY - rect.top) / rect.height
      pointer.inside =
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
    }

    // Click scatters nearby particles; they drift back as the kick decays.
    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      for (const p of particles) {
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.hypot(dx, dy)
        if (dist < BURST_RADIUS && dist > 0.001) {
          const kick = (1 - dist / BURST_RADIUS) ** 1.5 * 18
          p.kx += (dx / dist) * kick
          p.ky += (dy / dist) * kick
        }
      }
    }

    const onVisibility = () => {
      if (reduceMotion) return
      startLoop()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!reduceMotion) startLoop()
      },
      { threshold: 0 },
    )

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      draw(false) // static constellation, no loop
    } else {
      observer.observe(canvas)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerdown', onPointerDown)
      document.addEventListener('visibilitychange', onVisibility)
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
