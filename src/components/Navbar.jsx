import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Autosuggest from './Autosuggest.jsx'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-black/70 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <div className="flex-shrink-0">
          <Link to="/" className="text-red-500 font-extrabold text-lg">CineVerse</Link>
          <div className="text-xs text-gray-400">Your universe of film and television</div>
        </div>

        <div className="flex-1">
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

        <div className="flex-shrink-0">
          <Link to="/watchlist" className="text-gray-300 hover:text-white">Watchlist</Link>
        </div>
      </div>
    </nav>
  )
}
