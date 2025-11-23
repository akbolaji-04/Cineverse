import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ActorCard from '../components/ActorCard'
import TrailerModal from '../components/TrailerModal'
import { tmdbGet, posterUrl } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

export default function TvDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [tv, setTv] = useState(null)
  const [error, setError] = useState(null)
  const { addItem, removeItem, items } = useWatchlist()
  const [trailer, setTrailer] = React.useState(null)
  const [trailerOpen, setTrailerOpen] = React.useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await tmdbGet(`/tv/${id}`, { append_to_response: 'credits,videos' })
        const providersData = await tmdbGet(`/tv/${id}/watch/providers`)
        setTv({ ...data, watchProviders: providersData.results || {} })
      } catch (e) {
        setError('TV show not found')
      }
    }
    load()
  }, [id])

  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-red-500">{error}</h2></div>
  if (!tv) return <div className="max-w-6xl mx-auto px-4 py-8 text-gray-900 dark:text-white">Loading...</div>

  const inList = items.find(i => i.id === tv.id && i.media_type === 'tv')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={posterUrl(tv.poster_path, 'w500')} alt={tv.name} className="w-full md:w-56 rounded-lg shadow-lg" />

        {/* FIX: Main text container adapts to theme */}
        <div className="flex-1 text-gray-900 dark:text-white">
          <h1 className="text-2xl font-bold mb-2">{tv.name}</h1>
          {/* FIX: Overview text */}
          <p className="text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">{tv.overview}</p>
          {/* FIX: Metadata text */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">First air: {tv.first_air_date} • Episodes: {tv.number_of_episodes}</div>

          {tv.watchProviders.US && (
            <div className="mb-4">
              {tv.watchProviders.US.flatrate && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">Stream:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tv.watchProviders.US.flatrate.map(p => (
                      <a key={p.provider_id} href={tv.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-gray-900 dark:text-white transition-colors">
                        <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-6 h-6 rounded-full mr-2" />
                        {p.provider_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {tv.watchProviders.US.buy && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">Buy:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tv.watchProviders.US.buy.map(p => (
                      <a key={p.provider_id} href={tv.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-gray-900 dark:text-white transition-colors">
                        <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-6 h-6 rounded-full mr-2" />
                        {p.provider_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {tv.watchProviders.US.rent && (
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white">Rent:</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tv.watchProviders.US.rent.map(p => (
                      <a key={p.provider_id} href={tv.watchProviders.US.link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-gray-900 dark:text-white transition-colors">
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
              <button onClick={() => addItem({ id: tv.id, title: tv.name, poster_path: tv.poster_path, media_type: 'tv' })} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">Add to Watchlist</button>
            ) : (
              <button onClick={() => removeItem(tv.id, 'tv')} className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white font-semibold transition-colors">Remove from Watchlist</button>
            )}
            <button
              onClick={async () => {
                try {
                  const data = await tmdbGet(`/tv/${tv.id}/videos`)
                  const vids = (data.results || []).filter(v => v.site === 'YouTube' && v.type === 'Trailer')
                  setTrailer(vids[0] || null)
                  setTrailerOpen(true)
                } catch (e) {
                  console.error(e)
                  setTrailer(null)
                  setTrailerOpen(true)
                }
              }}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-black dark:text-white transition-colors font-medium border border-gray-300 dark:border-transparent"
            >
              Watch Trailer
            </button>
            <button onClick={() => nav(-1)} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-black dark:text-white transition-colors font-medium border border-gray-300 dark:border-transparent">Back</button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Cast</h2>
        <div className="flex gap-4 overflow-x-auto py-2 custom-scrollbar">
          {(tv.credits && tv.credits.cast ? tv.credits.cast.slice(0, 12) : []).map(c => (
            <ActorCard key={c.cast_id || c.id} person={c} />
          ))}
        </div>
      </section>
      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} video={trailer} />
    </div>
  )
}
