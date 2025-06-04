import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

// Initialize Sentry
Sentry.init({
  dsn: 'https://0f9f9cd80b94ff809d3bbb1da37fb869@o315999.ingest.us.sentry.io/4509440506658816',
  // Setting this option to true will send default PII data to Sentry
  sendDefaultPii: true,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
