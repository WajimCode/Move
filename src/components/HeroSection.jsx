import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTrending } from '../services/tmdb'
import { getBackdropUrl, getPosterUrl } from '../services/tmdb'
import { formatYear, formatRating, formatRuntime, getRatingBg } from '../utils/format'
import { useWatchlist } from '../context/WatchlistContext'
import SearchBar from './SearchBar'

export default function HeroSection() {
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isInWatchlist, toggle } = useWatchlist()

  useEffect(() => {
    getTrending('week', 1)
      .then((res) => {
        const movies = res.data.results || []
        // Pick a random one from top 5
        const pick = movies[Math.floor(Math.random() * Math.min(5, movies.length))]
        setFeatured(pick || null)
      })
      .catch(() => setFeatured(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="relative h-[70vh] min-h-[500px] skeleton flex items-end">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <div className="h-12 skeleton rounded w-64" />
          <div className="h-4 skeleton rounded w-96" />
          <div className="h-4 skeleton rounded w-80" />
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-36 skeleton rounded-lg" />
            <div className="h-11 w-36 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!featured) return null

  const backdrop = getBackdropUrl(featured.backdrop_path)
  const inWatchlist = isInWatchlist(featured.id)

  return (
    <div className="relative h-[80vh] min-h-[560px] flex flex-col justify-end overflow-hidden">
      {/* Backdrop */}
      {backdrop && (
        <div className="absolute inset-0">
          <img
            src={backdrop}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/60 to-cinema-bg/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/90 via-cinema-bg/30 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        {/* Search bar centered at top on mobile */}
        <div className="md:hidden mb-8 mt-4">
          <SearchBar />
        </div>

        <div className="max-w-2xl animate-slide-up">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="badge bg-cinema-gold/15 text-cinema-gold border border-cinema-gold/30 font-mono text-xs">
              🔥 TRENDING THIS WEEK
            </span>
            {featured.vote_average > 0 && (
              <span className={`badge ${getRatingBg(featured.vote_average)} font-mono`}>
                ★ {formatRating(featured.vote_average)}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl tracking-widest text-white mb-4 leading-none">
            {featured.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-cinema-subtext font-mono mb-4">
            <span>{formatYear(featured.release_date)}</span>
            {featured.genre_ids?.length > 0 && (
              <>
                <span className="text-cinema-border">•</span>
                <span>Action / Drama</span>
              </>
            )}
          </div>

          {/* Overview */}
          <p className="text-cinema-subtext leading-relaxed line-clamp-3 mb-8 max-w-xl">
            {featured.overview}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to={`/movie/${featured.id}`} className="btn-primary flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              View Details
            </Link>
            <button
              onClick={() => toggle(featured)}
              className={`btn-secondary flex items-center gap-2 ${inWatchlist ? 'border-cinema-gold text-cinema-gold' : ''}`}
            >
              {inWatchlist ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Watchlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cinema-bg to-transparent" />
    </div>
  )
}
