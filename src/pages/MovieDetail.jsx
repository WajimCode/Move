import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getMovieDetail, getPosterUrl, getBackdropUrl } from '../services/tmdb'
import { formatDate, formatYear, formatRating, formatRuntime, getRatingBg } from '../utils/format'
import { useWatchlist } from '../context/WatchlistContext'
import StreamingButtons from '../components/StreamingButtons'
import MovieRow from '../components/MovieRow'
import AdBanner from '../components/AdBanner'
import PageLoader from '../components/PageLoader'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const { isInWatchlist, toggle } = useWatchlist()

  useEffect(() => {
    setLoading(true)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    getMovieDetail(id)
      .then((res) => setMovie(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const trailer = useMemo(() => {
    if (!movie?.videos?.results) return null
    return (
      movie.videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
      movie.videos.results.find((v) => v.site === 'YouTube')
    )
  }, [movie])

  const cast = useMemo(() => movie?.credits?.cast?.slice(0, 12) || [], [movie])
  const crew = useMemo(() => {
    if (!movie?.credits?.crew) return {}
    const director = movie.credits.crew.find((c) => c.job === 'Director')
    const writer = movie.credits.crew.find((c) => c.job === 'Screenplay' || c.job === 'Writer')
    return { director, writer }
  }, [movie])

  const recommendations = useMemo(
    () => movie?.recommendations?.results || movie?.similar?.results || [],
    [movie]
  )

  if (loading) return (
    <div className="pt-16">
      <PageLoader />
    </div>
  )

  if (error || !movie) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">😕</span>
        <h2 className="font-display text-3xl tracking-widest text-cinema-text">Movie not found</h2>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go back</button>
      </div>
    )
  }

  const inWatchlist = isInWatchlist(movie.id)
  const backdrop = getBackdropUrl(movie.backdrop_path)
  const poster = getPosterUrl(movie.poster_path, 'w500')

  const TABS = [
    { value: 'overview', label: 'Overview' },
    { value: 'cast', label: `Cast (${cast.length})` },
    trailer ? { value: 'trailer', label: 'Trailer' } : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[360px]">
        {backdrop && (
          <img src={backdrop} alt={movie.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/70 to-cinema-bg/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/80 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-sm text-cinema-muted hover:text-cinema-text transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0">
            <div className="w-48 sm:w-56 md:w-64 rounded-2xl overflow-hidden shadow-2xl border border-cinema-border mx-auto md:mx-0">
              {poster ? (
                <img src={poster} alt={movie.title} className="w-full" />
              ) : (
                <div className="aspect-[2/3] bg-cinema-card flex items-center justify-center text-cinema-muted">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
            </div>

            {/* Watchlist button */}
            <button
              onClick={() => toggle(movie)}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-200 text-sm font-medium ${
                inWatchlist
                  ? 'bg-cinema-gold/10 border-cinema-gold text-cinema-gold'
                  : 'border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold'
              }`}
            >
              {inWatchlist ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
                  </svg>
                  In Watchlist
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Add to Watchlist
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 animate-fade-in">
            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-widest text-cinema-text leading-none mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-cinema-muted italic text-lg mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {movie.vote_average > 0 && (
                <span className={`badge ${getRatingBg(movie.vote_average)} font-mono text-sm px-3 py-1`}>
                  ★ {formatRating(movie.vote_average)}
                  <span className="text-xs opacity-60 ml-1">({movie.vote_count?.toLocaleString()})</span>
                </span>
              )}
              <span className="text-cinema-muted font-mono text-sm">{formatYear(movie.release_date)}</span>
              {movie.runtime > 0 && (
                <span className="text-cinema-muted font-mono text-sm">{formatRuntime(movie.runtime)}</span>
              )}
              {movie.adult && (
                <span className="badge bg-red-500/10 text-red-400 font-mono">18+</span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/search?q=${encodeURIComponent(g.name)}`}
                    className="badge bg-cinema-card border border-cinema-border text-cinema-subtext hover:border-cinema-gold hover:text-cinema-gold transition-all px-3 py-1.5 text-sm"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Director/Writer */}
            <div className="flex flex-wrap gap-6 mb-6">
              {crew.director && (
                <div>
                  <p className="text-xs text-cinema-muted font-mono uppercase tracking-widest mb-0.5">Director</p>
                  <p className="text-cinema-text font-medium">{crew.director.name}</p>
                </div>
              )}
              {crew.writer && (
                <div>
                  <p className="text-xs text-cinema-muted font-mono uppercase tracking-widest mb-0.5">Writer</p>
                  <p className="text-cinema-text font-medium">{crew.writer.name}</p>
                </div>
              )}
              {movie.release_date && (
                <div>
                  <p className="text-xs text-cinema-muted font-mono uppercase tracking-widest mb-0.5">Release Date</p>
                  <p className="text-cinema-text font-medium">{formatDate(movie.release_date)}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-cinema-border mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === tab.value
                      ? 'border-cinema-gold text-cinema-gold'
                      : 'border-transparent text-cinema-muted hover:text-cinema-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <p className="text-cinema-subtext leading-relaxed text-base">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cast.map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3 bg-cinema-card rounded-xl p-2 border border-cinema-border/50">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-cinema-border shrink-0">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cinema-muted text-lg">
                            👤
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-cinema-text truncate">{actor.name}</p>
                        <p className="text-xs text-cinema-muted truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trailer' && trailer && (
              <div className="animate-fade-in">
                <div className="aspect-video rounded-xl overflow-hidden bg-cinema-card">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Streaming section */}
        <div className="mt-12 bg-cinema-surface border border-cinema-border rounded-2xl p-6">
          <StreamingButtons
            movieTitle={movie.title}
            providers={movie['watch/providers']}
          />
        </div>

        {/* Ad */}
        <div className="mt-8">
          <AdBanner slot="leaderboard" />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <MovieRow
              title="You Might Also Like"
              movies={recommendations}
              loading={false}
            />
          </div>
        )}

        <div className="pb-16" />
      </div>
    </div>
  )
}
