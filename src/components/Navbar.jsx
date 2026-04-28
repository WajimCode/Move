import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import SearchBar from './SearchBar'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { watchlist } = useWatchlist()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-cinema-border shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🎬</span>
            <span className="font-display text-2xl tracking-widest text-gradient-gold">CINEMATE</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar compact />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-cinema-gold' : ''}`}>
              Discover
            </Link>
            <Link
              to="/watchlist"
              className={`nav-link relative ${location.pathname === '/watchlist' ? 'text-cinema-gold' : ''}`}
            >
              Watchlist
              {watchlist.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-cinema-gold text-cinema-bg text-xs font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {watchlist.length > 9 ? '9+' : watchlist.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu btn */}
          <button
            className="md:hidden text-cinema-text p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-cinema-border animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            <SearchBar compact />
            <div className="flex gap-6 pt-2">
              <Link to="/" className="nav-link">Discover</Link>
              <Link to="/watchlist" className="nav-link flex items-center gap-2">
                Watchlist
                {watchlist.length > 0 && (
                  <span className="badge bg-cinema-gold/20 text-cinema-gold">{watchlist.length}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
