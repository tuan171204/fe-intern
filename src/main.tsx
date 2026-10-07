import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Providers } from './web3/Providers'
import DAppDashboard from './web3/DAppDashboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <DAppDashboard />
    </Providers>
  </React.StrictMode>,
)