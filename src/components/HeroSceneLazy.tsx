import { useEffect, useState, type ComponentType } from 'react'
import { useReducedMotion } from 'motion/react'

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
    if (reduceMotion) return
    if (!window.matchMedia('(min-width: 768px)').matches) return

    const probe = document.createElement('canvas')
    const gl =
      probe.getContext('webgl2') || probe.getContext('webgl')
    if (!gl) return

    let active = true
    import('./HeroScene').then((m) => {
      if (active) setScene(() => m.default)
    })
    return () => {
      active = false
    }
  }, [reduceMotion])

  if (!Scene) return null
  return (
    <div className="absolute inset-0 [animation:fade-in_1.2s_ease-out_both]">
      <Scene />
    </div>
  )
}
