import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Autosuggest from './Autosuggest.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-black/70 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-6">
        
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-red-500 font-extrabold text-lg">CineVerse</Link>
          <div className="text-xs text-gray-400">Your universe of film and television</div>
        </div>

        {/* Actions (Theme/Watchlist) - Visible on top right on mobile */}
        <div className="flex-shrink-0 flex items-center gap-3 md:order-last">
          <ThemeToggle />
          <Link to="/watchlist" className="text-gray-300 hover:text-white text-sm md:text-base">Watchlist</Link>
        </div>

        {/* Search Section - Drops to bottom on mobile, Center on desktop */}
        <div className="w-full order-last md:order-none md:flex-1">
          <Autosuggest
            onSearch={q => {
              if (!q) return
              navigate(`/search/${encodeURIComponent(q)}`)
            }}
            onNavigateTo={item => {
              const media = item.media_type || (item.title ? 'movie' : 'tv')
              navigate(`/${media}/${item.id}`)
            }}
          />
        </div>

      </div>
    </nav>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button 
      onClick={toggle} 
      className="px-3 py-1.5 rounded-md bg-white/10 text-white text-xs md:text-sm border border-white/10 hover:bg-white/20 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
