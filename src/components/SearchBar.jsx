import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../hooks/useDebounce'
import { searchMovies } from '../services/tmdb'
import { getPosterUrl } from '../services/tmdb'
import { formatYear } from '../utils/format'
import { useSearchHistory } from '../context/SearchHistoryContext'

export default function SearchBar({ compact = false, autoFocus = false }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 350)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    searchMovies(debouncedQuery, 1)
      .then((res) => {
        if (!cancelled) {
          setSuggestions(res.data.results?.slice(0, 6) || [])
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [debouncedQuery])

  // Outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = useCallback((q) => {
    const term = q || query
    if (!term.trim()) return
    addToHistory(term.trim())
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }, [query, navigate, addToHistory])

  const handleKeyDown = (e) => {
    const items = query.trim() ? suggestions : history
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && query.trim() && suggestions[activeIndex]) {
        const movie = suggestions[activeIndex]
        addToHistory(movie.title)
        navigate(`/movie/${movie.id}`)
        setOpen(false)
        setQuery('')
      } else if (activeIndex >= 0 && !query.trim() && history[activeIndex]) {
        handleSearch(history[activeIndex])
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }

  const highlightMatch = (text) => {
    if (!query.trim()) return text
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part)
        ? <mark key={i} className="bg-cinema-gold/20 text-cinema-gold not-italic font-semibold rounded px-0.5">{part}</mark>
        : part
    )
  }

  const showDropdown = open && (query.trim() ? suggestions.length > 0 || loading : history.length > 0)

  return (
    <div ref={containerRef} className={`relative ${compact ? 'w-full' : 'w-full max-w-2xl mx-auto'}`}>
      {/* Input */}
      <div className={`relative flex items-center ${compact ? '' : ''}`}>
        <span className="absolute left-3.5 text-cinema-muted pointer-events-none z-10">
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={compact ? 'Search movies...' : 'Search for movies, directors, genres...'}
          className={`input-base pl-10 pr-10 ${compact ? 'py-2 text-sm' : 'py-4 text-base'}`}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
            className="absolute right-3.5 text-cinema-muted hover:text-cinema-text transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cinema-card border border-cinema-border rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-down">
          {/* Search suggestions */}
          {query.trim() && suggestions.length > 0 && (
            <>
              <div className="px-3 pt-2.5 pb-1">
                <span className="text-xs font-mono text-cinema-muted uppercase tracking-widest">Results</span>
              </div>
              {suggestions.map((movie, i) => (
                <button
                  key={movie.id}
                  onMouseDown={() => {
                    addToHistory(movie.title)
                    navigate(`/movie/${movie.id}`)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                    activeIndex === i ? 'bg-cinema-border' : 'hover:bg-cinema-surface'
                  }`}
                >
                  <div className="w-9 h-12 rounded-md overflow-hidden bg-cinema-border shrink-0">
                    {movie.poster_path ? (
                      <img
                        src={getPosterUrl(movie.poster_path, 'w92')}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cinema-muted text-xs">?</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cinema-text truncate">
                      {highlightMatch(movie.title)}
                    </p>
                    <p className="text-xs text-cinema-muted">{formatYear(movie.release_date)}</p>
                  </div>
                  {movie.vote_average > 0 && (
                    <span className="text-xs font-mono text-cinema-gold shrink-0">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-cinema-border">
                <button
                  onMouseDown={() => handleSearch()}
                  className="w-full px-3 py-2.5 text-sm text-cinema-gold hover:bg-cinema-surface transition-colors text-left flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  See all results for <strong>"{query}"</strong>
                </button>
              </div>
            </>
          )}

          {/* History */}
          {!query.trim() && history.length > 0 && (
            <>
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                <span className="text-xs font-mono text-cinema-muted uppercase tracking-widest">Recent</span>
                <button
                  onMouseDown={clearHistory}
                  className="text-xs text-cinema-muted hover:text-cinema-gold transition-colors"
                >
                  Clear all
                </button>
              </div>
              {history.map((q, i) => (
                <div
                  key={q}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                    activeIndex === i ? 'bg-cinema-border' : 'hover:bg-cinema-surface'
                  }`}
                >
                  <svg className="w-4 h-4 text-cinema-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <button
                    onMouseDown={() => handleSearch(q)}
                    className="flex-1 text-sm text-cinema-text text-left"
                  >
                    {q}
                  </button>
                  <button
                    onMouseDown={(e) => { e.stopPropagation(); removeFromHistory(q) }}
                    className="text-cinema-muted hover:text-cinema-text transition-colors p-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
