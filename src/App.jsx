import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import { SearchHistoryProvider } from './context/SearchHistoryContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'

const Home = lazy(() => import('./pages/Home'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const MovieDetail = lazy(() => import('./pages/MovieDetail'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Router>
      <WatchlistProvider>
        <SearchHistoryProvider>
          <div className="min-h-screen bg-cinema-bg flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </SearchHistoryProvider>
      </WatchlistProvider>
    </Router>
  )
}
