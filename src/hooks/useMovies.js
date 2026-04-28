import { useState, useEffect, useCallback } from 'react'

export default function useMovies(fetcher, deps = []) {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)
      setError(null)

      try {
        const res = await fetcher(pageNum)
        const results = res.data.results || []
        setMovies((prev) => (append ? [...prev, ...results] : results))
        setTotalPages(res.data.total_pages || 1)
        setPage(pageNum)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.message || 'Failed to fetch movies')
        }
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps]
  )

  useEffect(() => {
    setMovies([])
    setPage(1)
    fetch(1, false)
  }, [fetch])

  const loadMore = useCallback(() => {
    if (page < totalPages && !loadingMore) {
      fetch(page + 1, true)
    }
  }, [page, totalPages, loadingMore, fetch])

  return {
    movies,
    page,
    totalPages,
    loading,
    loadingMore,
    error,
    loadMore,
    hasMore: page < totalPages,
    refetch: () => fetch(1, false),
  }
}
