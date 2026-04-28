import React from 'react'
import { STREAMING_SERVICES } from '../utils/format'

export default function StreamingButtons({ movieTitle, providers = null }) {
  // TMDB watch providers (if available from append_to_response)
  const tmdbProviders = providers?.results?.US?.flatrate || []

  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl tracking-widest text-cinema-text">Where to Watch</h3>

      {/* TMDB provider logos (if data available) */}
      {tmdbProviders.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tmdbProviders.map((p) => (
            <div
              key={p.provider_id}
              className="flex items-center gap-2 bg-cinema-card border border-cinema-border rounded-lg px-3 py-2"
              title={p.provider_name}
            >
              {p.logo_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                  alt={p.provider_name}
                  className="w-6 h-6 rounded-md object-cover"
                />
              )}
              <span className="text-sm text-cinema-text">{p.provider_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Generic streaming platform links */}
      <div className="flex flex-wrap gap-2">
        {STREAMING_SERVICES.map((service) => (
          <a
            key={service.name}
            href={`${service.url}${encodeURIComponent(movieTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cinema-border hover:border-opacity-100 transition-all duration-200 text-sm font-medium group"
            style={{ '--service-color': service.color }}
          >
            <span>{service.icon}</span>
            <span className="text-cinema-subtext group-hover:text-cinema-text transition-colors">
              {service.name}
            </span>
            <svg className="w-3 h-3 text-cinema-muted group-hover:text-cinema-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
      <p className="text-xs text-cinema-muted">
        * Availability varies by region. Links open respective platform search pages.
      </p>
    </div>
  )
}
