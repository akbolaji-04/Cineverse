import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tmdbGet, posterUrl } from '../api/tmdb'
import ActorCard from '../components/ActorCard'
import { useWatchlist } from '../context/WatchlistContext'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const { addItem, removeItem, items } = useWatchlist()

  useEffect(() => {
    async function load() {
      try {
        const data = await tmdbGet(`/movie/${id}`, { append_to_response: 'credits' })
        setMovie(data)
      } catch (e) {
        setError('Movie not found')
      }
    }
    load()
  }, [id])

  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-red-400">{error}</h2></div>
  if (!movie) return <div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>

  const inList = items.find(i => i.id === movie.id && i.media_type === 'movie')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={posterUrl(movie.poster_path, 'w500')} alt={movie.title} className="w-full md:w-56 rounded-lg shadow-lg" />

        <div className="flex-1 text-white">
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-200 mb-3">{movie.overview}</p>
          <div className="text-sm text-gray-400 mb-4">Released: {movie.release_date} • Runtime: {movie.runtime} min</div>

          <div className="flex gap-3">
            {!inList ? (
              <button onClick={() => addItem({ id: movie.id, title: movie.title, poster_path: movie.poster_path, media_type: 'movie' })} className="px-4 py-2 rounded-md bg-red-500 text-black font-semibold">Add to Watchlist</button>
            ) : (
              <button onClick={() => removeItem(movie.id, 'movie')} className="px-4 py-2 rounded-md bg-gray-700 text-white">Remove from Watchlist</button>
            )}
            <button onClick={() => nav(-1)} className="px-4 py-2 rounded-md bg-white/5 text-white">Back</button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-white">Cast</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {(movie.credits && movie.credits.cast ? movie.credits.cast.slice(0, 12) : []).map(c => (
            <ActorCard key={c.cast_id || c.id} person={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
