import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.tsx'
import LegacyPage from './pages/LegacyPage.tsx'
import "./App.css"

import { ThemeProvider } from './contexts/ThemeContext'
import { OSISimulatorProvider } from './contexts/OSISimulatorContext'
import { ThemeScript } from './components/ThemeScript'
import { isTauri } from './lib/tauri'

// In Tauri: disable context menu and devtools shortcuts
if (isTauri()) {
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
      (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
    ) {
      e.preventDefault()
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeScript />
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OSISimulatorProvider><App /></OSISimulatorProvider>} />
          <Route path="/legacy" element={<LegacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
