import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'
import MovieCardSkeleton from './MovieCardSkeleton'

export default function MovieRow({ title, movies = [], loading = false, viewAllLink = null }) {
  const rowRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll = (dir) => {
    const el = rowRef.current
    if (!el) return
    const amount = dir === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = rowRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  return (
    <section className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-3xl tracking-widest text-cinema-text">{title}</h2>
        <div className="flex items-center gap-3">
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm text-cinema-muted hover:text-cinema-gold transition-colors font-mono">
              View all →
            </Link>
          )}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-cinema-border flex items-center justify-center text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-cinema-border flex items-center justify-center text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll container */}
      <div className="relative">
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="shrink-0 w-36 sm:w-40 md:w-44">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie, i) => (
                <div key={`${movie.id}-${i}`} className="shrink-0 w-36 sm:w-40 md:w-44">
                  <MovieCard movie={movie} index={i} />
                </div>
              ))}
        </div>

        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-3 w-12 bg-gradient-to-r from-cinema-bg to-transparent pointer-events-none" />
        )}
        {canScrollRight && movies.length > 0 && (
          <div className="absolute right-0 top-0 bottom-3 w-12 bg-gradient-to-l from-cinema-bg to-transparent pointer-events-none" />
        )}
      </div>
    </section>
  )
}
