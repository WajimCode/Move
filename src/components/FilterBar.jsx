import React, { useState, useEffect, memo } from 'react'
import { getGenres } from '../services/tmdb'

const RATINGS = [
  { label: 'Any Rating', value: '' },
  { label: '9+ Masterpiece', value: '9' },
  { label: '8+ Excellent', value: '8' },
  { label: '7+ Great', value: '7' },
  { label: '6+ Good', value: '6' },
  { label: '5+ Average', value: '5' },
]

const currentYear = new Date().getFullYear()
const YEARS = [
  { label: 'Any Year', value: '' },
  ...Array.from({ length: 30 }, (_, i) => {
    const y = currentYear - i
    return { label: String(y), value: String(y) }
  }),
]

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popularity.desc' },
  { label: 'Highest Rated', value: 'vote_average.desc' },
  { label: 'Newest First', value: 'primary_release_date.desc' },
  { label: 'Oldest First', value: 'primary_release_date.asc' },
  { label: 'Revenue', value: 'revenue.desc' },
]

const FilterBar = memo(function FilterBar({ filters, onChange }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data.genres || []))
      .catch(() => setGenres([]))
  }, [])

  const set = (key, val) => onChange({ ...filters, [key]: val, page: 1 })

  const activeCount = [filters.genre, filters.rating, filters.year].filter(Boolean).length

  return (
    <div className="bg-cinema-surface border border-cinema-border rounded-2xl p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Active badge */}
        {activeCount > 0 && (
          <span className="badge bg-cinema-gold/15 text-cinema-gold border border-cinema-gold/30 font-mono text-xs">
            {activeCount} filter{activeCount > 1 ? 's' : ''}
          </span>
        )}

        {/* Genre */}
        <select
          value={filters.genre || ''}
          onChange={(e) => set('genre', e.target.value)}
          className="input-base py-2 text-sm w-auto min-w-[140px] cursor-pointer"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Rating */}
        <select
          value={filters.rating || ''}
          onChange={(e) => set('rating', e.target.value)}
          className="input-base py-2 text-sm w-auto min-w-[140px] cursor-pointer"
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* Year */}
        <select
          value={filters.year || ''}
          onChange={(e) => set('year', e.target.value)}
          className="input-base py-2 text-sm w-auto min-w-[120px] cursor-pointer"
        >
          {YEARS.map((y) => (
            <option key={y.value} value={y.value}>{y.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy || 'popularity.desc'}
          onChange={(e) => set('sortBy', e.target.value)}
          className="input-base py-2 text-sm w-auto min-w-[150px] cursor-pointer"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Clear */}
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ genre: '', rating: '', year: '', sortBy: 'popularity.desc', page: 1 })}
            className="text-sm text-cinema-muted hover:text-cinema-gold transition-colors font-mono ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
})

export default FilterBar
