import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import FilterBar from '../components/FilterBar'
import LoadMoreTrigger from '../components/LoadMoreTrigger'
import AdBanner from '../components/AdBanner'
import useMovies from '../hooks/useMovies'
import { searchMovies, discoverMovies } from '../services/tmdb'
import { useSearchHistory } from '../context/SearchHistoryContext'

const DEFAULT_FILTERS = { genre: '', rating: '', year: '', sortBy: 'popularity.desc' }

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const { addToHistory } = useSearchHistory()

  // Add to history when query changes
  useEffect(() => {
    if (query.trim()) addToHistory(query.trim())
  }, [query, addToHistory])

  const fetcher = useCallback(
    (page) => {
      const hasFilters = filters.genre || filters.rating || filters.year
      if (query && !hasFilters) {
        return searchMovies(query, page)
      }
      if (hasFilters) {
        return discoverMovies({ ...filters, page })
      }
      return searchMovies('', page)
    },
    [query, filters]
  )

  const { movies, loading, loadingMore, error, hasMore, loadMore } = useMovies(fetcher, [query, filters])

  const hasActiveFilters = filters.genre || filters.rating || filters.year

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero search */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-5xl tracking-widest text-cinema-text">
            {query ? (
              <>Search: <span className="text-gradient-gold">{query}</span></>
            ) : (
              'Discover Movies'
            )}
          </h1>
          {!loading && movies.length > 0 && (
            <p className="text-cinema-muted font-mono text-sm">
              {movies.length}+ results {query ? `for "${query}"` : ''}
            </p>
          )}
        </div>

        {/* Large search bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar autoFocus={!query} />
        </div>

        <AdBanner slot="leaderboard" />

        {/* Filters toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-cinema-gold text-cinema-gold' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {hasActiveFilters && '(active)'}
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-sm text-cinema-muted hover:text-cinema-gold transition-colors font-mono"
            >
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="animate-slide-down">
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Results */}
        {!query && !hasActiveFilters ? (
          <div className="text-center py-16 space-y-4">
            <span className="text-6xl">🎬</span>
            <h2 className="font-display text-3xl tracking-widest text-cinema-text">Search for movies</h2>
            <p className="text-cinema-muted">Type a movie title, actor name, or genre above</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['Inception', 'The Dark Knight', 'Interstellar', 'Dune', 'Oppenheimer', 'Avatar'].map((s) => (
                <Link
                  key={s}
                  to={`/search?q=${encodeURIComponent(s)}`}
                  className="badge bg-cinema-card border border-cinema-border text-cinema-subtext hover:border-cinema-gold hover:text-cinema-gold transition-all px-3 py-1.5 rounded-full text-sm"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={movies}
              loading={loading}
              error={error}
              emptyMessage={`No results for "${query}"`}
              emptyIcon="🔍"
              skeletonCount={20}
            />
            <LoadMoreTrigger onLoadMore={loadMore} hasMore={hasMore} loading={loadingMore} />
          </>
        )}
      </div>
    </div>
  )
}
