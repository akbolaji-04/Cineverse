import React, { useEffect, useRef, useState } from 'react'
import { tmdbGet, posterUrl } from '../api/tmdb'

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export default function Autosuggest({ onSearch = () => {}, onNavigateTo = () => {} }) {
  const [input, setInput] = useState('')
  const debounced = useDebounced(input, 300)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!debounced) {
      setSuggestions([])
      setOpen(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await tmdbGet('/search/multi', { query: debounced, page: 1 })
        if (cancelled) return
        const results = (data.results || []).filter(r => r.media_type !== 'person' || r.profile_path)

        // Rank suggestions: prefer movie/tv over person and sort by popularity
        results.sort((a, b) => {
          const aScore = ((a.media_type === 'movie' || a.media_type === 'tv') ? 1000000 : 0) + (a.popularity || 0)
          const bScore = ((b.media_type === 'movie' || b.media_type === 'tv') ? 1000000 : 0) + (b.popularity || 0)
          return bScore - aScore
        })

        setSuggestions(results.slice(0, 6))
        setOpen(true)
        setActive(0)
      } catch (e) {
        console.error(e)
      }
    })()

    return () => { cancelled = true }
  }, [debounced])

  useEffect(() => {
    function onDoc(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  function onKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions[active]) {
        select(suggestions[active])
      } else {
        onSearch(input.trim())
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function select(item) {
    setInput('')
    setOpen(false)
    onNavigateTo(item)
  }

  return (
    <div className="relative" ref={rootRef}>
      <div className="flex">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search movies, shows, people..."
          aria-label="Search"
          className="w-full rounded-lg px-3 py-2 bg-white/3 placeholder:text-gray-400 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-400"
        />
        <button
          className="ml-3 px-4 py-2 rounded-lg bg-red-500 text-black font-semibold"
          onClick={() => { onSearch(input.trim()); setOpen(false); setInput('') }}
        >
          Search
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-slate-900/90 border border-white/6 rounded-lg shadow-lg max-h-96 overflow-auto z-40" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={`${s.id}-${s.media_type}`}
              className={`flex items-center gap-3 p-2 hover:bg-red-500/10 ${i === active ? 'bg-red-500/10' : ''}`}
              onMouseDown={() => select(s)}
            >
              <img src={posterUrl(s.poster_path || s.profile_path, 'w92')} alt={s.title || s.name} className="w-14 h-20 object-cover rounded-md" />
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-white truncate">{s.title || s.name}</div>
                <div className="text-sm text-gray-400 truncate">{s.media_type}{(s.release_date || s.first_air_date) ? ' • ' + (s.release_date || s.first_air_date) : ''}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
