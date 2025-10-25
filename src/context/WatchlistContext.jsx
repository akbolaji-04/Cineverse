import React, { createContext, useContext, useEffect, useState } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cineverse_watchlist')
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load watchlist', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cineverse_watchlist', JSON.stringify(items))
    } catch (e) {
      console.warn('Failed to save watchlist', e)
    }
  }, [items])

  function addItem(item) {
    setItems(prev => {
      if (prev.find(i => i.id === item.id && i.media_type === item.media_type)) return prev
      return [item, ...prev]
    })
  }

  function removeItem(id, media_type) {
    setItems(prev => prev.filter(i => !(i.id === id && i.media_type === media_type)))
  }

  const value = { items, addItem, removeItem }

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
