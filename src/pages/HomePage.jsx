import React, { useEffect, useState } from 'react'
import { tmdbGet } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import Skeleton from '../components/Skeleton'

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
  const [loading, setLoading] = useState(true)

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
