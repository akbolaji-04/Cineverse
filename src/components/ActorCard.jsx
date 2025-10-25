import React from 'react'
import { useNavigate } from 'react-router-dom'
import { posterUrl } from '../api/tmdb'

export default function ActorCard({ person }) {
  const navigate = useNavigate()

  return (
    <div className="w-[120px] cursor-pointer" onClick={() => navigate(`/person/${person.id}`)}>
      <img src={posterUrl(person.profile_path, 'w185')} alt={person.name} className="w-[120px] h-[160px] object-cover rounded-md" />
      <div className="mt-2 text-sm text-gray-300">
        <div className="font-semibold truncate">{person.name}</div>
        <div className="text-xs text-gray-400 truncate">{person.character || person.known_for_department}</div>
      </div>
    </div>
  )
}
