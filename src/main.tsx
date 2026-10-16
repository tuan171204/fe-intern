import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastProvider } from './store/ToastContext'
import { Web3Provider } from './store/Web3Provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ToastProvider>
  </StrictMode>,
)