import React, { useEffect, useState } from 'react'
import { tmdbGet } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import Skeleton from '../components/Skeleton'
import { useWatchlist } from '../context/WatchlistContext'

function Row({ title, items }) {
  return (
    <section className="row">
      <h3>{title}</h3>
      <div className="row-items">
        {items.map(i => (
          <MovieCard key={`${i.id}-${i.media_type || 'm'}`} item={i} />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const [hero, setHero] = useState(null)
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topTv, setTopTv] = useState([])
  const [recommended, setRecommended] = useState([])
  const [recLoading, setRecLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const { items: watchlistItems } = useWatchlist()

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const trendingData = await tmdbGet('/trending/all/day')
        const popularData = await tmdbGet('/movie/popular')
        const topTvData = await tmdbGet('/tv/top_rated')
  const topRated = await tmdbGet('/movie/top_rated')

  setTrending(trendingData.results || [])
        setPopular(popularData.results || [])
        setTopTv(topTvData.results || [])
        setHero((topRated.results && topRated.results[0]) || null)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    // Fetch recommendations for the first watchlist item (if any)
    async function loadRecs() {
      if (!watchlistItems || watchlistItems.length === 0) {
        setRecommended([])
        return
      }
      const first = watchlistItems[0]
      const media = first.media_type === 'tv' ? 'tv' : 'movie'
      setRecLoading(true)
      try {
        const data = await tmdbGet(`/${media}/${first.id}/recommendations`)
        setRecommended((data.results || []).slice(0, 12))
      } catch (e) {
        console.error('Failed to load recommendations', e)
        setRecommended([])
      } finally {
        setRecLoading(false)
      }
    }
    loadRecs()
  }, [watchlistItems])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {loading ? (
        <div className="py-10"><Skeleton count={4} /></div>
      ) : (
        <>
          {hero && (
            <section
              className="relative rounded-lg overflow-hidden mb-6 bg-cover bg-center h-72"
              style={{
                backgroundImage: `url(${hero.backdrop_path ? 'https://image.tmdb.org/t/p/original'+hero.backdrop_path : ''})`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 p-6 md:p-10 text-white max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{hero.title || hero.name}</h1>
                <p className="text-sm md:text-base text-gray-200 line-clamp-3">{hero.overview}</p>
              </div>
            </section>
          )}

          {(recLoading || (recommended && recommended.length > 0)) ? (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-white">Recommended for you</h2>
              <div className="flex gap-4 overflow-x-auto py-2">
                {recLoading ? (
                  <Skeleton count={6} />
                ) : (
                  recommended.map(i => <MovieCard key={`r-${i.id}-${i.media_type || 'm'}`} item={i} />)
                )}
              </div>
            </section>
          ) : (watchlistItems.length === 0 && !loading && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-white">Recommended for you</h2>
              <p className="text-gray-400">Add to your watchlist to get personalized picks!</p>
            </section>
          ))}

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-white">Trending Now</h2>
            <div className="flex gap-4 overflow-x-auto py-2">
              {trending.map(i => <MovieCard key={`t-${i.id}`} item={i} />)}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-white">Popular Movies</h2>
            <div className="flex gap-4 overflow-x-auto py-2">
              {popular.map(i => <MovieCard key={`p-${i.id}`} item={i} />)}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-white">Top Rated TV Shows</h2>
            <div className="flex gap-4 overflow-x-auto py-2">
              {topTv.map(i => <MovieCard key={`tv-${i.id}`} item={i} />)}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
