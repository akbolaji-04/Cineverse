import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { tmdbGet } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import Pagination from '../components/Pagination'

export default function SearchResultsPage() {
  const { query } = useParams()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setItems([])
    setPage(1)
  }, [query])

  useEffect(() => {
    async function search() {
      setLoading(true)
      try {
        const data = await tmdbGet('/search/multi', { query, page })
        setItems(prev => (page === 1 ? data.results : [...prev, ...(data.results || [])]))
        setTotalPages(data.total_pages || 1)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    if (query) search()
  }, [query, page])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-white mb-4">Results for: {decodeURIComponent(query)}</h2>
      <div className="flex gap-4 flex-wrap">
        {items.map(it => (
          <div key={`${it.id}-${it.media_type || 'm'}`} className="w-[150px]">
            <MovieCard item={it} />
          </div>
        ))}
      </div>

      {page < totalPages && (
        <Pagination onLoadMore={() => setPage(p => p + 1)} loading={loading} />
      )}
    </div>
  )
}
