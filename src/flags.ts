/*
  Diagnostic kill-switches for isolating performance problems. Append
  ?off=<feature,feature,...> to the URL to disable features at runtime, e.g.
  /?perf&off=webgl,grain. The ?perf HUD (src/perf.ts) renders checkboxes for
  these. Ordered by how likely each is to be hurting scroll performance.
*/
export const FEATURES = [
  'webgl', // rotating hero blob: continuous GPU render loop
  'grain', // full-viewport fixed noise overlay, composited every frame
  'aurora', // the two drifting glow layers behind the hero
  'marquee', // tech strip: per-frame transform writes on a very wide layer
  'stack', // experience cards: scroll-linked scale + 3D tilt transforms
  'sticky', // experience cards: position: sticky pinning itself
  'parallax', // hero content/aurora CSS scroll-timelines
  'reveal', // below-the-fold CSS view-timeline reveals
  'spotlight', // cursor-following mask on the headline + About cards
] as const

export type Feature = (typeof FEATURES)[number]

const off: Set<string> =
  typeof location !== 'undefined'
    ? new Set(
        (new URLSearchParams(location.search).get('off') ?? '')
          .split(',')
          .filter(Boolean),
      )
    : new Set()

export const disabled = (f: Feature) => off.has(f)
export const anyDisabled = off.size > 0

// Expose the off-list to CSS (html[data-off~="grain"] etc.) before first paint.
if (typeof document !== 'undefined' && off.size > 0) {
  document.documentElement.dataset.off = [...off].join(' ')
}
