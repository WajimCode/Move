import React from 'react'
import MovieCard from './MovieCard'
import MovieCardSkeleton from './MovieCardSkeleton'
import EmptyState from './EmptyState'

export default function MovieGrid({
  movies = [],
  loading = false,
  error = null,
  skeletonCount = 20,
  emptyMessage = 'No movies found',
  emptyIcon = '🎬',
}) {
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        message={error}
      />
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!movies.length) {
    return <EmptyState icon={emptyIcon} title={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie, i) => (
        <MovieCard key={`${movie.id}-${i}`} movie={movie} index={i} />
      ))}
    </div>
  )
}
