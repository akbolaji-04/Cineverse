import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ActorCard from '../components/ActorCard'
import TrailerModal from '../components/TrailerModal'
import { tmdbGet, posterUrl } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const { addItem, removeItem, items } = useWatchlist()
  const [trailer, setTrailer] = React.useState(null)
  const [trailerOpen, setTrailerOpen] = React.useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await tmdbGet(`/movie/${id}`, { append_to_response: 'credits,videos' })
        const providersData = await tmdbGet(`/movie/${id}/watch/providers`)
        setMovie({ ...data, watchProviders: providersData.results || {} })
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

          {movie.watchProviders.US && (
            <div className="mb-4">
              {movie.watchProviders.US.flatrate && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-white">Stream:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.watchProviders.US.flatrate.map(p => (
                      <a key={p.provider_id} href={movie.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-white">
                        <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-6 h-6 rounded-full mr-2" />
                        {p.provider_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {movie.watchProviders.US.buy && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-white">Buy:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.watchProviders.US.buy.map(p => (
                      <a key={p.provider_id} href={movie.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-white">
                        <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-6 h-6 rounded-full mr-2" />
                        {p.provider_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {movie.watchProviders.US.rent && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-white">Rent:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.watchProviders.US.rent.map(p => (
                      <a key={p.provider_id} href={movie.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-white">
                        <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-6 h-6 rounded-full mr-2" />
                        {p.provider_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!inList ? (
              <button onClick={() => addItem({ id: movie.id, title: movie.title, poster_path: movie.poster_path, media_type: 'movie' })} className="px-4 py-2 rounded-md bg-red-500 text-black font-semibold">Add to Watchlist</button>
            ) : (
              <button onClick={() => removeItem(movie.id, 'movie')} className="px-4 py-2 rounded-md bg-gray-700 text-white">Remove from Watchlist</button>
            )}
            <button
              onClick={async () => {
                try {
                  const data = await tmdbGet(`/movie/${movie.id}/videos`)
                  const vids = (data.results || []).filter(v => v.site === 'YouTube' && v.type === 'Trailer')
                  setTrailer(vids[0] || null)
                  setTrailerOpen(true)
                } catch (e) {
                  console.error(e)
                  setTrailer(null)
                  setTrailerOpen(true)
                }
              }}
              className="px-4 py-2 rounded-md bg-white/5 text-white"
            >
              Watch Trailer
            </button>
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
      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} video={trailer} />
    </div>
  )
}
