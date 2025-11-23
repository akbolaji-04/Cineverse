import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Autosuggest from './Autosuggest.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    // FIX: Navbar background and border adapt to theme
    <nav className="bg-white/90 dark:bg-black/70 backdrop-blur-sm border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-6">
        
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-red-600 dark:text-red-500 font-extrabold text-lg">CineVerse</Link>
          <div className="text-xs text-gray-500 dark:text-gray-400">Your universe of film and television</div>
        </div>

        {/* Actions (Theme/Watchlist) */}
        <div className="flex-shrink-0 flex items-center gap-3 md:order-last">
          <ThemeToggle />
          <Link to="/watchlist" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm md:text-base transition-colors">Watchlist</Link>
        </div>

        {/* Search Section */}
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
      className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white text-xs md:text-sm border border-transparent dark:border-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
