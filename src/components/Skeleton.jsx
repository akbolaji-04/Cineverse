import React from 'react'

export default function Skeleton({ count = 6 }) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[150px] h-[225px] bg-gradient-to-r from-slate-800 to-slate-700 rounded-md animate-pulse" />
      ))}
    </div>
  )
}
