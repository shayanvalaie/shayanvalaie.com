import { useEffect, useState, type ComponentType } from 'react'
import { useReducedMotion } from 'motion/react'
import { disabled } from '../flags'

/*
  Client-only gate for the WebGL hero scene. It is dynamically imported (so
  three.js stays out of the SSR build and the initial bundle) and only loads on
  pointer-capable desktop viewports with motion allowed and WebGL available.
  Everywhere else the CSS aurora behind it is the fallback.
*/
export default function HeroSceneLazy() {
  const reduceMotion = useReducedMotion()
  const [Scene, setScene] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (disabled('webgl')) return
    if (reduceMotion) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const probe = document.createElement('canvas')
    const gl =
      probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) return

    // Wait for browser idle before pulling in the three.js chunk (~230 kB
    // gzipped): fetching, parsing, and compiling shaders during startup was
    // blocking first interaction. The scene fades in, so starting late is
    // invisible.
    let active = true
    const load = () =>
      import('./HeroScene').then((m) => {
        if (active) setScene(() => m.default)
      })

    let idleId: number | undefined
    let timerId: number | undefined
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(load, { timeout: 2500 })
    } else {
      timerId = window.setTimeout(load, 1200)
    }
    return () => {
      active = false
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
    }
  }, [reduceMotion])

  if (!Scene) return null
  return (
    <div className="absolute inset-0 [animation:fade-in_1.2s_ease-out_both]">
      <Scene />
    </div>
  )
}
