import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Providers } from './web3/Providers'
import DAppDashboard from './web3/DAppDashboard'
import { ErrorBoundary } from './web3/components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <DAppDashboard />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>,
)