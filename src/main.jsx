import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { WatchlistProvider } from './context/WatchlistContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WatchlistProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WatchlistProvider>
  </React.StrictMode>
)

// Register service worker (if supported)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      // ignore registration failures in dev
      console.warn('SW registration failed:', err)
    })
  })
}
