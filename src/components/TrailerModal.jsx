import React from 'react'

export default function TrailerModal({ open, onClose, video }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-black rounded-md max-w-3xl w-full mx-4">
        <div className="p-2 flex justify-end">
          <button onClick={onClose} className="text-white px-3 py-1">Close</button>
        </div>
        <div className="aspect-video">
          {video ? (
            <iframe
              title="trailer"
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="p-6 text-center text-white">Trailer not available</div>
          )}
        </div>
      </div>
    </div>
  )
}
