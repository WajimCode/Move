import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      {/* Cinematic 404 */}
      <div className="relative mb-8">
        <div className="font-display text-[160px] sm:text-[220px] leading-none text-cinema-border/30 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-bounce">🎬</span>
        </div>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl tracking-widest text-cinema-text mb-4">
        Scene Not Found
      </h1>
      <p className="text-cinema-muted max-w-md leading-relaxed mb-8">
        Looks like this page got cut from the final edit. It may have been moved, deleted, or never existed.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>

      {/* Film strip decoration */}
      <div className="mt-16 flex gap-1 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-12 h-8 border border-cinema-muted rounded-sm" />
        ))}
      </div>
    </div>
  )
}
