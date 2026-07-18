/*
  Scroll-performance diagnostics, loaded only when the URL contains `?perf`.
  Shows a live HUD (fps / janky frames / worst frame), checkboxes that disable
  individual features (via ?off=..., see src/flags.ts), and logs specifics to
  the console:
    [perf] long frame  - frames over 25ms, with the scripts that ran in them
    [perf] layout shift - what moved, and by how much
  Usage: open /?perf, scroll around, read the HUD + console. Tick a feature to
  reload with it disabled, then scroll again and compare.
*/
import { FEATURES } from './flags'

// Feature kill-switch panel; ticking a box reloads with that feature off.
const offNow = new Set(
  (new URLSearchParams(location.search).get('off') ?? '')
    .split(',')
    .filter(Boolean),
)
const panel = document.createElement('div')
panel.style.cssText =
  'position:fixed;left:12px;bottom:110px;z-index:9999;padding:10px 14px;' +
  'font:11px/1.7 monospace;color:#eee;background:rgba(0,0,0,0.85);' +
  'border-radius:8px;user-select:none'
const title = document.createElement('div')
title.textContent = 'disable feature:'
title.style.cssText = 'color:#a78bfa;margin-bottom:2px'
panel.appendChild(title)
for (const f of FEATURES) {
  const label = document.createElement('label')
  label.style.cssText = 'display:block;cursor:pointer'
  const cb = document.createElement('input')
  cb.type = 'checkbox'
  cb.checked = offNow.has(f)
  cb.onchange = () => {
    if (cb.checked) offNow.add(f)
    else offNow.delete(f)
    const p = new URLSearchParams(location.search)
    if (offNow.size) p.set('off', [...offNow].join(','))
    else p.delete('off')
    location.search = p.toString() // reloads with the new flag set
  }
  label.append(cb, ` ${f}`)
  panel.appendChild(label)
}
document.body.appendChild(panel)

const hud = document.createElement('div')
hud.style.cssText =
  'position:fixed;left:12px;bottom:12px;z-index:9999;padding:8px 12px;' +
  'font:11px/1.5 monospace;color:#0f0;background:rgba(0,0,0,0.8);' +
  'border-radius:8px;pointer-events:none;white-space:pre'
document.body.appendChild(hud)

let frames: number[] = []
let janky = 0
let worst = 0
let last = performance.now()

function tick(t: number) {
  const d = t - last
  last = t
  frames.push(d)
  if (d > 25) {
    janky++
    if (d > worst) worst = d
    console.warn(`[perf] long frame: ${d.toFixed(1)}ms at scrollY=${window.scrollY}`)
  }
  requestAnimationFrame(tick)
}
requestAnimationFrame(tick)

setInterval(() => {
  const avg = frames.reduce((a, b) => a + b, 0) / (frames.length || 1)
  hud.textContent =
    `fps      ${(1000 / avg).toFixed(0)}\n` +
    `frame    ${avg.toFixed(1)}ms avg\n` +
    `janky    ${janky} (>25ms)\n` +
    `worst    ${worst.toFixed(0)}ms`
  frames = []
}, 500)

new PerformanceObserver((list) => {
  for (const e of list.getEntries() as PerformanceEntry[]) {
    const entry = e as unknown as {
      value: number
      sources?: { node?: Element }[]
    }
    const nodes = (entry.sources || [])
      .map((s) => {
        const n = s.node
        if (!n) return '?'
        const cls = typeof n.className === 'string' ? n.className.split(' ')[0] : ''
        return `${n.tagName}${cls ? '.' + cls : ''}`
      })
      .join(', ')
    console.warn(`[perf] layout shift: ${entry.value.toFixed(4)} — ${nodes}`)
  }
}).observe({ type: 'layout-shift' })

try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      const entry = e as unknown as {
        duration: number
        scripts?: { duration: number; invoker?: string; sourceURL?: string }[]
      }
      const scripts = (entry.scripts || [])
        .map((s) => `${s.duration.toFixed(0)}ms ${s.invoker || s.sourceURL || '?'}`)
        .join('; ')
      console.warn(
        `[perf] long animation frame: ${entry.duration.toFixed(0)}ms${scripts ? ' — ' + scripts : ''}`,
      )
    }
  }).observe({ type: 'long-animation-frame' } as PerformanceObserverInit)
} catch {
  /* long-animation-frame is Chromium-only */
}

console.info(
  '[perf] logger active. Tip: run  document.querySelector(".grain")?.remove()  ' +
    'in the console to A/B the grain overlay while scrolling.',
)

export {}
