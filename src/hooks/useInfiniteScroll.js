import { useEffect, useRef, useCallback } from 'react'

export default function useInfiniteScroll(onLoadMore, hasMore, loading) {
  const observerRef = useRef(null)
  const sentinelRef = useRef(null)

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    disconnect()

    if (!hasMore || loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: '200px' }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return disconnect
  }, [hasMore, loading, onLoadMore, disconnect])

  return sentinelRef
}
