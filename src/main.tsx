import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

window.addEventListener('error', () => {
  localStorage.clear()
  console.log('Clearing localStorage')
  // setTimeout(() => {
  //   window.location.reload()
  // }, 30000)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
