import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

const SearchHistoryContext = createContext(null)

const MAX_HISTORY = 8

export function SearchHistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinemate_search_history') || '[]')
    } catch {
      return []
    }
  })

  const addToHistory = useCallback((query) => {
    if (!query?.trim()) return
    setHistory((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase())
      const updated = [query, ...filtered].slice(0, MAX_HISTORY)
      localStorage.setItem('cinemate_search_history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeFromHistory = useCallback((query) => {
    setHistory((prev) => {
      const updated = prev.filter((q) => q !== query)
      localStorage.setItem('cinemate_search_history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('cinemate_search_history')
  }, [])

  const value = useMemo(
    () => ({ history, addToHistory, removeFromHistory, clearHistory }),
    [history, addToHistory, removeFromHistory, clearHistory]
  )

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>
}

export const useSearchHistory = () => {
  const ctx = useContext(SearchHistoryContext)
  if (!ctx) throw new Error('useSearchHistory must be inside SearchHistoryProvider')
  return ctx
}
