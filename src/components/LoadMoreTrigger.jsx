import React from 'react'
import useInfiniteScroll from '../hooks/useInfiniteScroll'

export default function LoadMoreTrigger({ onLoadMore, hasMore, loading }) {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore, loading)

  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {loading && (
        <div className="flex items-center gap-3 text-cinema-muted">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cinema-gold rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span className="text-sm font-mono">Loading more...</span>
        </div>
      )}
      {!hasMore && !loading && (
        <p className="text-cinema-muted text-sm font-mono">— End of results —</p>
      )}
    </div>
  )
}
