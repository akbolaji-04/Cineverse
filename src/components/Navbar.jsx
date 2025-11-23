import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Autosuggest from './Autosuggest.jsx'

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
  // Use the ThemeContext hook so toggling persists and is consistent
  try {
    // dynamic import to avoid tree-shaking weirdness
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { useTheme } = require('../context/ThemeContext.jsx')
    // `useTheme` is a hook; we need to call it inside component render
    constQDHook = () => {
      const { theme, toggle } = useTheme()
      return (
        <button onClick={toggle} className="px-2 py-1 rounded bg-white/10 text-white text-xs md:text-sm border border-white/5">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      )
    }
    return <QDHook />
  } catch (e) {
    // Fallback in case require fails (older environments)
    function onClick() {
      const root = document.documentElement
      if (root.classList.contains('dark')) {
        root.classList.remove('dark')
        try { localStorage.setItem('cineverse_theme','light') } catch(e){}
      } else {
        root.classList.add('dark')
        try { localStorage.setItem('cineverse_theme','dark') } catch(e){}
      }
    }
    return (<button onClick={onClick} className="px-2 py-1 rounded bg-white/6 text-white text-xs">Theme</button>)
  }
}
