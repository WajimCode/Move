import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-cinema-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎬</span>
              <span className="font-display text-2xl tracking-widest text-gradient-gold">CINEMATE</span>
            </div>
            <p className="text-cinema-muted text-sm leading-relaxed max-w-xs">
              Discover movies, build your watchlist, and find where to watch them — all in one place.
            </p>
            <p className="text-cinema-border text-xs mt-4 font-mono">
              Powered by{' '}
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-cinema-gold hover:underline">
                TMDB
              </a>
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-display tracking-widest text-cinema-text mb-4 text-lg">Navigate</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Discover' },
                { to: '/search?q=action', label: 'Action' },
                { to: '/search?q=drama', label: 'Drama' },
                { to: '/watchlist', label: 'My Watchlist' },
              ].map(({ to, label }) => (
                <li key={to + label}>
                  <Link to={to} className="text-cinema-muted hover:text-cinema-gold transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display tracking-widest text-cinema-text mb-4 text-lg">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Advertise'].map((item) => (
                <li key={item}>
                  <span className="text-cinema-muted text-sm cursor-pointer hover:text-cinema-gold transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cinema-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cinema-border text-xs font-mono">
            © {new Date().getFullYear()} CineMate. All rights reserved.
          </p>
          <p className="text-cinema-border text-xs font-mono">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  )
}
