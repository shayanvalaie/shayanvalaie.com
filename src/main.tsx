import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { anyDisabled } from './flags'
import App from './App'

// Production HTML is pre-rendered at build time, so hydrate it. In dev the
// root is empty; hydrating it there makes React log a mismatch and rebuild
// the whole tree, so render normally instead.
const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Diagnostic mode (?off=...) renders a different tree than the prerendered
// HTML, so skip hydration and client-render from scratch there.
if (anyDisabled) container.replaceChildren()

if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}

// Scroll-perf diagnostics HUD; loaded only when explicitly requested.
if (location.search.includes('perf')) {
  import('./perf')
}
