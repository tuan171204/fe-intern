import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ThemeProvider } from './store/ThemeContext'
import { ToastProvider } from './store/ToastContext'
import { Web3Provider } from './store/Web3Provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <Web3Provider>
          <App />
        </Web3Provider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)