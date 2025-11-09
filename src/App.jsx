import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import TvDetailsPage from './pages/TvDetailsPage'
import PersonDetailsPage from './pages/PersonDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import WatchlistPage from './pages/WatchlistPage'
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/tv/:id" element={<TvDetailsPage />} />
          <Route path="/person/:id" element={<PersonDetailsPage />} />
          <Route path="/search/:query" element={<SearchResultsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/404" element={<div style={{padding:40}}>Not found</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
