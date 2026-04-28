import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinemate_watchlist') || '[]')
    } catch {
      return []
    }
  })

  const save = (list) => {
    setWatchlist(list)
    localStorage.setItem('cinemate_watchlist', JSON.stringify(list))
  }

  const add = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev
      const updated = [movie, ...prev]
      localStorage.setItem('cinemate_watchlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const remove = useCallback((id) => {
    setWatchlist((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      localStorage.setItem('cinemate_watchlist', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isInWatchlist = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist]
  )

  const toggle = useCallback(
    (movie) => {
      if (isInWatchlist(movie.id)) remove(movie.id)
      else add(movie)
    },
    [isInWatchlist, add, remove]
  )

  const value = useMemo(
    () => ({ watchlist, add, remove, isInWatchlist, toggle }),
    [watchlist, add, remove, isInWatchlist, toggle]
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be inside WatchlistProvider')
  return ctx
}
