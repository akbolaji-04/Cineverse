import React from 'react'

export default function Pagination({ onLoadMore, loading }) {
  return (
    <div className="flex justify-center my-6">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-white text-black disabled:opacity-60"
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  )
}
