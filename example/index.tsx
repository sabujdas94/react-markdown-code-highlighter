import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App content="Hello, world!" />
  </StrictMode>,
)
