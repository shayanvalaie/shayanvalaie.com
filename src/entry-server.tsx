import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Rendered at build time by `vite build --ssr`, then injected into the static
// HTML by scripts/prerender.mjs so the page paints content before any JS runs.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
