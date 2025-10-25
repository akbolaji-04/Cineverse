import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tmdbGet, posterUrl } from '../api/tmdb'
import ActorCard from '../components/ActorCard'
import { useWatchlist } from '../context/WatchlistContext'

export default function TvDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [tv, setTv] = useState(null)
  const [error, setError] = useState(null)
  const { addItem, removeItem, items } = useWatchlist()

  useEffect(() => {
    async function load() {
      try {
        const data = await tmdbGet(`/tv/${id}`, { append_to_response: 'credits' })
        setTv(data)
      } catch (e) {
        setError('TV show not found')
      }
    }
    load()
  }, [id])

  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-red-400">{error}</h2></div>
  if (!tv) return <div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>

  const inList = items.find(i => i.id === tv.id && i.media_type === 'tv')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={posterUrl(tv.poster_path, 'w500')} alt={tv.name} className="w-full md:w-56 rounded-lg shadow-lg" />

        <div className="flex-1 text-white">
          <h1 className="text-2xl font-bold mb-2">{tv.name}</h1>
          <p className="text-gray-200 mb-3">{tv.overview}</p>
          <div className="text-sm text-gray-400 mb-4">First air: {tv.first_air_date} • Episodes: {tv.number_of_episodes}</div>

          <div className="flex gap-3">
            {!inList ? (
              <button onClick={() => addItem({ id: tv.id, title: tv.name, poster_path: tv.poster_path, media_type: 'tv' })} className="px-4 py-2 rounded-md bg-red-500 text-black font-semibold">Add to Watchlist</button>
            ) : (
              <button onClick={() => removeItem(tv.id, 'tv')} className="px-4 py-2 rounded-md bg-gray-700 text-white">Remove from Watchlist</button>
            )}
            <button onClick={() => nav(-1)} className="px-4 py-2 rounded-md bg-white/5 text-white">Back</button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-white">Cast</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {(tv.credits && tv.credits.cast ? tv.credits.cast.slice(0, 12) : []).map(c => (
            <ActorCard key={c.cast_id || c.id} person={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
