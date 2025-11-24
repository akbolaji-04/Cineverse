import React, { useEffect, useState } from 'react'
import { tmdbGet } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import Skeleton from '../components/Skeleton'
import { useWatchlist } from '../context/WatchlistContext'

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
    // Added overflow-hidden to main wrapper to prevent any accidental page overflow
    <div className="max-w-6xl mx-auto px-4 py-6 overflow-hidden">
      {loading ? (
        // Added overflow-hidden to skeleton container so it doesn't push width out on mobile
        <div className="py-10 w-full overflow-hidden">
          <Skeleton count={4} />
        </div>
      ) : (
        <>
          {hero && (
            <section
              className="relative rounded-xl overflow-hidden mb-8 bg-cover bg-center min-h-[500px] md:h-[600px] flex items-end shadow-2xl"
              style={{
                backgroundImage: `url(${hero.backdrop_path ? 'https://image.tmdb.org/t/p/original' + hero.backdrop_path : ''})`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-black/60 to-transparent" />
              <div className="relative z-10 p-6 md:p-10 text-white max-w-3xl w-full">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight drop-shadow-lg">{hero.title || hero.name}</h1>
                <p className="text-sm md:text-lg text-gray-200 line-clamp-3 md:line-clamp-4 drop-shadow-md">{hero.overview}</p>
              </div>
            </section>
          )}

          {(recLoading || (recommended && recommended.length > 0)) ? (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Recommended for you</h2>
              <div className="flex gap-4 overflow-x-auto w-full py-2 custom-scrollbar">
                {recLoading ? (
                  <Skeleton count={6} />
                ) : (
                  recommended.map(i => <MovieCard key={`r-${i.id}-${i.media_type || 'm'}`} item={i} />)
                )}
              </div>
            </section>
          ) : (watchlistItems.length === 0 && !loading && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Recommended for you</h2>
              <p className="text-gray-600 dark:text-gray-400">Add to your watchlist to get personalized picks!</p>
            </section>
          ))}

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Trending Now</h2>
            <div className="flex gap-4 overflow-x-auto w-full py-2 custom-scrollbar">
              {trending.map(i => <MovieCard key={`t-${i.id}`} item={i} />)}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Popular Movies</h2>
            <div className="flex gap-4 overflow-x-auto w-full py-2 custom-scrollbar">
              {popular.map(i => <MovieCard key={`p-${i.id}`} item={i} />)}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Top Rated TV Shows</h2>
            <div className="flex gap-4 overflow-x-auto w-full py-2 custom-scrollbar">
              {topTv.map(i => <MovieCard key={`tv-${i.id}`} item={i} />)}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
