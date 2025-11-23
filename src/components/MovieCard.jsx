import React from 'react'
import { useNavigate } from 'react-router-dom'
import { posterUrl } from '../api/tmdb'

export default function MovieCard({ item }) {
  const navigate = useNavigate()
  const media = item.media_type || (item.title ? 'movie' : 'tv')

  function open() {
    navigate(`/${media}/${item.id}`)
  }

  return (
    <div className="min-w-[150px] cursor-pointer" onClick={open} role="button">
      <img 
        src={posterUrl(item.poster_path)} 
        alt={item.title || item.name} 
        className="w-[150px] h-[225px] object-cover rounded-md transition-transform duration-150 hover:-translate-y-1 hover:scale-[1.03] shadow-xl" 
      />
      {/* FIX: Added dark mode conditional colors */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="font-semibold truncate">{item.title || item.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{item.release_date || item.first_air_date}</div>
      </div>
    </div>
  )
}
