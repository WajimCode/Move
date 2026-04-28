import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { getPosterUrl } from '../services/tmdb'
import { formatYear, formatRating, getRatingBg } from '../utils/format'
import EmptyState from '../components/EmptyState'
import AdBanner from '../components/AdBanner'

export default function WatchlistPage() {
  const { watchlist, remove } = useWatchlist()
  const [sortBy, setSortBy] = useState('added')
  const [viewMode, setViewMode] = useState('grid')

  const sorted = useMemo(() => {
    const list = [...watchlist]
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      case 'year':
        return list.sort((a, b) => {
          const ya = a.release_date ? new Date(a.release_date).getFullYear() : 0
          const yb = b.release_date ? new Date(b.release_date).getFullYear() : 0
          return yb - ya
        })
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return list // 'added' = original order (most recent first)
    }
  }, [watchlist, sortBy])

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-5xl tracking-widest text-cinema-text">My Watchlist</h1>
            <p className="text-cinema-muted font-mono text-sm mt-1">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>

          {watchlist.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base py-2 text-sm w-auto"
              >
                <option value="added">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="year">Newest First</option>
                <option value="title">A–Z</option>
              </select>

              {/* View toggle */}
              <div className="flex gap-1 bg-cinema-surface border border-cinema-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-cinema-gold text-cinema-bg' : 'text-cinema-muted hover:text-cinema-text'}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-cinema-gold text-cinema-bg' : 'text-cinema-muted hover:text-cinema-text'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {watchlist.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="Your watchlist is empty"
            message="Browse movies and click the bookmark icon to save them here."
            action={
              <Link to="/" className="btn-primary">
                Discover Movies
              </Link>
            }
          />
        ) : (
          <>
            <AdBanner slot="leaderboard" className="mb-8" />

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sorted.map((movie) => (
                  <WatchlistCard key={movie.id} movie={movie} onRemove={remove} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map((movie, i) => (
                  <WatchlistListItem key={movie.id} movie={movie} index={i} onRemove={remove} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function WatchlistCard({ movie, onRemove }) {
  const poster = getPosterUrl(movie.poster_path)

  return (
    <div className="group relative card-hover animate-fade-in">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-cinema-card border border-cinema-border/50">
          {poster ? (
            <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cinema-muted">
              <span className="text-4xl">🎬</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-cinema-text line-clamp-1 group-hover:text-cinema-gold transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-cinema-muted font-mono">{formatYear(movie.release_date)}</p>
        </div>
      </Link>
      <button
        onClick={() => onRemove(movie.id)}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:scale-110"
        title="Remove from watchlist"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function WatchlistListItem({ movie, index, onRemove }) {
  const poster = getPosterUrl(movie.poster_path, 'w92')

  return (
    <div
      className="flex items-center gap-4 bg-cinema-card border border-cinema-border rounded-xl p-3 hover:border-cinema-gold/30 transition-all duration-200 animate-fade-in group"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
    >
      <span className="text-cinema-muted font-mono text-sm w-6 text-right shrink-0">{index + 1}</span>

      <div className="w-10 h-14 rounded-lg overflow-hidden bg-cinema-border shrink-0">
        {poster ? (
          <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cinema-muted text-sm">🎬</div>
        )}
      </div>

      <Link to={`/movie/${movie.id}`} className="flex-1 min-w-0">
        <h3 className="text-cinema-text font-medium text-sm group-hover:text-cinema-gold transition-colors truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-cinema-muted font-mono text-xs">{formatYear(movie.release_date)}</span>
          {movie.vote_average > 0 && (
            <span className={`badge ${getRatingBg(movie.vote_average)} text-xs font-mono`}>
              ★ {formatRating(movie.vote_average)}
            </span>
          )}
        </div>
      </Link>

      <p className="hidden sm:block text-cinema-muted text-xs leading-relaxed line-clamp-2 max-w-xs flex-1">
        {movie.overview}
      </p>

      <button
        onClick={() => onRemove(movie.id)}
        className="shrink-0 w-8 h-8 rounded-full border border-cinema-border text-cinema-muted hover:border-red-400 hover:text-red-400 flex items-center justify-center transition-all duration-200"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
