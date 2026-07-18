import { useRef, type PointerEvent } from 'react'
import { ArrowDown } from '@phosphor-icons/react'
import Button from './Button'
import HeroSceneLazy from './HeroSceneLazy'
import { disabled } from '../flags'
import { HERO } from '../data/content'

const nameLines = HERO.name.split(' ')

/*
  The hero parallax/fade runs as CSS scroll-driven animations (.hero-content /
  .hero-aurora in index.css), not JS. JS scroll handlers update transforms a
  frame behind the compositor's scroll, which makes the hero visibly stutter
  against the page; compositor-driven timelines stay perfectly in sync.
*/
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLSpanElement>(null)

  // Move the violet "spotlight" mask to the cursor. Coordinates are written
  // straight to the overlay's CSS variables, so this never re-renders React.
  // The overlay rect is measured once on entry, not per move — pointermove can
  // fire at 120Hz+ and each getBoundingClientRect is a layout read.
  const rectRef = useRef<{ left: number; top: number; scrollY: number } | null>(
    null,
  )

  const onPointerEnter = () => {
    if (disabled('spotlight')) return
    const r = overlayRef.current?.getBoundingClientRect()
    rectRef.current = r
      ? { left: r.left, top: r.top, scrollY: window.scrollY }
      : null
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = overlayRef.current
    const r = rectRef.current
    if (!el || !r) return
    // window.scrollY compensates for scrolling mid-hover without a layout read.
    const top = r.top - (window.scrollY - r.scrollY)
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - top}px`)
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
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div aria-hidden className="hero-aurora absolute inset-0">
        <div className="aurora aurora-deep absolute -left-[10%] top-[8%] h-[42rem] w-[42rem]" />
        <div className="aurora aurora-soft absolute -right-[12%] bottom-[2%] h-[34rem] w-[34rem]" />
      </div>

      {/* WebGL centerpiece (desktop + motion only); aurora above is the fallback. */}
      <HeroSceneLazy />

      {/* Keep the headline legible over the scene: solid on the left, clear on
          the right where the blob sits. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/20 md:to-transparent"
      />

      <div className="hero-content relative z-10 mx-auto w-full max-w-[1320px] px-6 sm:px-10 lg:px-14">
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
      </div>
    </section>
  )
}
