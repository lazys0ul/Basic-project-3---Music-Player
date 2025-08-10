import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import validateFrontendEnv from './utils/validateEnv.js'

// Validate environment before starting the app
if (validateFrontendEnv()) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
