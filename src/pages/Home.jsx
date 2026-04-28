import React, { useState, useCallback } from 'react'
import HeroSection from '../components/HeroSection'
import MovieRow from '../components/MovieRow'
import MovieGrid from '../components/MovieGrid'
import FilterBar from '../components/FilterBar'
import LoadMoreTrigger from '../components/LoadMoreTrigger'
import TabBar from '../components/TabBar'
import AdBanner from '../components/AdBanner'
import useMovies from '../hooks/useMovies'
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getUpcoming,
  discoverMovies,
} from '../services/tmdb'

const TABS = [
  { value: 'trending', label: 'Trending', icon: '🔥' },
  { value: 'popular', label: 'Popular', icon: '⭐' },
  { value: 'top_rated', label: 'Top Rated', icon: '🏆' },
  { value: 'now_playing', label: 'Now Playing', icon: '🎭' },
  { value: 'upcoming', label: 'Upcoming', icon: '📅' },
]

const DEFAULT_FILTERS = {
  genre: '',
  rating: '',
  year: '',
  sortBy: 'popularity.desc',
  page: 1,
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('trending')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  // Featured rows (always shown)
  const trendingRow = useMovies(() => getTrending('week', 1), [])
  const nowPlayingRow = useMovies(() => getNowPlaying(1), [])
  const topRatedRow = useMovies(() => getTopRated(1), [])
  const upcomingRow = useMovies(() => getUpcoming(1), [])

  // Tab-based + filtered grid
  const tabFetcher = useCallback(
    (page) => {
      // If any filter active, use discover regardless of tab
      if (filters.genre || filters.rating || filters.year) {
        return discoverMovies({ ...filters, page })
      }
      switch (activeTab) {
        case 'trending': return getTrending('week', page)
        case 'popular': return getPopular(page)
        case 'top_rated': return getTopRated(page)
        case 'now_playing': return getNowPlaying(page)
        case 'upcoming': return getUpcoming(page)
        default: return getPopular(page)
      }
    },
    [activeTab, filters]
  )

  const { movies, loading, loadingMore, error, loadMore, hasMore } = useMovies(tabFetcher, [activeTab, filters])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFilters(DEFAULT_FILTERS)
  }

  const hasActiveFilters = filters.genre || filters.rating || filters.year

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Ad banner */}
        <AdBanner slot="leaderboard" />

        {/* Trending Row */}
        <MovieRow
          title="🔥 Trending"
          movies={trendingRow.movies}
          loading={trendingRow.loading}
        />

        {/* Now Playing Row */}
        <MovieRow
          title="🎭 Now Playing"
          movies={nowPlayingRow.movies}
          loading={nowPlayingRow.loading}
        />

        {/* Ad mid */}
        <AdBanner slot="leaderboard" />

        {/* Top Rated Row */}
        <MovieRow
          title="🏆 Top Rated"
          movies={topRatedRow.movies}
          loading={topRatedRow.loading}
        />

        {/* Upcoming Row */}
        <MovieRow
          title="📅 Coming Soon"
          movies={upcomingRow.movies}
          loading={upcomingRow.loading}
        />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-cinema-border" />
          <span className="text-cinema-muted font-mono text-xs tracking-widest uppercase">Explore All</span>
          <div className="flex-1 h-px bg-cinema-border" />
        </div>

        {/* Tabs + Filters */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <TabBar tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`btn-secondary flex items-center gap-2 shrink-0 ${hasActiveFilters ? 'border-cinema-gold text-cinema-gold' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="badge bg-cinema-gold text-cinema-bg text-xs font-bold w-4 h-4 p-0 justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mb-6 animate-slide-down">
              <FilterBar filters={filters} onChange={setFilters} />
            </div>
          )}

          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            skeletonCount={20}
          />

          <LoadMoreTrigger onLoadMore={loadMore} hasMore={hasMore} loading={loadingMore} />
        </section>
      </div>
    </div>
  )
}
