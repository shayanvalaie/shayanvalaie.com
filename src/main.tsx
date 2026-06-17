import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// The markup already exists in the document (pre-rendered at build time), so we
// hydrate it rather than creating it from scratch.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
