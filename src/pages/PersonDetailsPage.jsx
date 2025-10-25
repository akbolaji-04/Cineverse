import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { tmdbGet, posterUrl } from '../api/tmdb'
import MovieCard from '../components/MovieCard'

export default function PersonDetailsPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [credits, setCredits] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await tmdbGet(`/person/${id}`)
        const creditsData = await tmdbGet(`/person/${id}/combined_credits`)
        setPerson(data)
        setCredits((creditsData.cast || []).sort((a,b)=> (b.popularity||0)-(a.popularity||0)))
      } catch (e) {
        setError('Person not found')
      }
    }
    load()
  }, [id])

  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><h2 className="text-red-400">{error}</h2></div>
  if (!person) return <div className="max-w-6xl mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img src={posterUrl(person.profile_path, 'w300')} alt={person.name} className="w-full md:w-56 rounded-md shadow-md" />
        <div className="flex-1 text-white">
          <h1 className="text-2xl font-bold mb-2">{person.name}</h1>
          <p className="text-gray-200 mb-3">{person.biography || 'No biography available.'}</p>
          <div className="text-sm text-gray-400">Born: {person.birthday} {person.place_of_birth ? 'in ' + person.place_of_birth : ''}</div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3 text-white">Filmography</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {credits.slice(0, 24).map(c => (
            <MovieCard key={`${c.id}-${c.media_type}`} item={{ ...c, media_type: c.media_type }} />
          ))}
        </div>
      </section>
    </div>
  )
}
