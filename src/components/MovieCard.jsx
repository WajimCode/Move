import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { getPosterUrl } from '../services/tmdb'
import { formatYear, formatRating, getRatingBg } from '../utils/format'
import { useWatchlist } from '../context/WatchlistContext'

const MovieCard = memo(function MovieCard({ movie, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { isInWatchlist, toggle } = useWatchlist()
  const inWatchlist = isInWatchlist(movie.id)

  const posterUrl = getPosterUrl(movie.poster_path)

  return (
    <div
      className="group relative animate-fade-in card-hover"
      style={{ animationDelay: `${(index % 20) * 40}ms`, animationFillMode: 'both' }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cinema-card border border-cinema-border/50">
          {/* Skeleton */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Image */}
          {posterUrl && !imgError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-cinema-muted bg-cinema-card">
              <span className="text-4xl">🎬</span>
              <span className="text-xs text-center px-2 leading-tight">{movie.title}</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2">
              <span className={`badge ${getRatingBg(movie.vote_average)} font-mono`}>
                ★ {formatRating(movie.vote_average)}
              </span>
            </div>
          )}

          {/* Hover overlay content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs leading-relaxed line-clamp-3 mb-2">
              {movie.overview || 'No description available.'}
            </p>
            <span className="text-cinema-gold text-xs font-mono">View Details →</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-cinema-text text-sm font-medium leading-snug line-clamp-1 group-hover:text-cinema-gold transition-colors duration-200">
            {movie.title}
          </h3>
          <p className="text-cinema-muted text-xs mt-0.5 font-mono">
            {formatYear(movie.release_date)}
          </p>
        </div>
      </Link>

      {/* Watchlist button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          toggle(movie)
        }}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          inWatchlist
            ? 'bg-cinema-gold text-cinema-bg shadow-lg shadow-cinema-gold/30 scale-100'
            : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-cinema-gold hover:text-cinema-bg'
        }`}
        title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {inWatchlist ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </button>
    </div>
  )
})

export default MovieCard
