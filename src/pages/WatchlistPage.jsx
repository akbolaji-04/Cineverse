import React from 'react'
import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'

export default function WatchlistPage() {
  const { items, removeItem } = useWatchlist()

  if (!items.length) return <div className="page"><h2>Your watchlist is empty</h2></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">Your Watchlist</h2>
      <div className="flex gap-6 flex-wrap">
        {items.map(i => (
          <div key={`${i.id}-${i.media_type}`} className="flex flex-col items-center">
            <MovieCard item={i} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => removeItem(i.id, i.media_type)} className="px-3 py-1 rounded-md bg-gray-700 text-white text-sm">Remove</button>
              <button onClick={() => {
                const data = JSON.stringify(items, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'cineverse-watchlist.json'
                a.click()
                URL.revokeObjectURL(url)
              }} className="px-3 py-1 rounded-md bg-green-600 text-white text-sm">Export JSON</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
