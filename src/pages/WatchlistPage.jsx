import React from 'react'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'

export default function WatchlistPage() {
  const { items, removeItem } = useWatchlist()

  // Function to handle global export
  const handleExport = () => {
    const data = JSON.stringify(items, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cineverse-watchlist.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your watchlist is empty</h2>
        <p className="text-gray-600 dark:text-gray-400">Start exploring to add movies and TV shows!</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Section with Title and Global Export Button */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Watchlist</h2>
        
        <button 
          onClick={handleExport}
          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Backup Data
        </button>
      </div>

      {/* Grid Layout */}
      <div className="flex gap-6 flex-wrap">
        {items.map(i => (
          <div key={`${i.id}-${i.media_type}`} className="flex flex-col items-center w-[150px]">
            <MovieCard item={i} />
            
            {/* Clean Remove Button */}
            <button 
              onClick={() => removeItem(i.id, i.media_type)} 
              className="mt-3 w-full px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors border border-red-200 dark:border-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
