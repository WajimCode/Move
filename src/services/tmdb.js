import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null

export const getBackdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
})

// Intercept to add language
tmdb.interceptors.request.use((config) => {
  config.params = { ...config.params, language: 'en-US' }
  return config
})

export const getTrending = (timeWindow = 'week', page = 1) =>
  tmdb.get(`/trending/movie/${timeWindow}`, { params: { page } })

export const getPopular = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } })

export const getTopRated = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } })

export const getNowPlaying = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } })

export const getUpcoming = (page = 1) =>
  tmdb.get('/movie/upcoming', { params: { page } })

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page, include_adult: false } })

export const getMovieDetail = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,watch/providers,recommendations,similar' },
  })

export const getGenres = () => tmdb.get('/genre/movie/list')

export const discoverMovies = ({ page = 1, genres = '', year = '', rating = '', sortBy = 'popularity.desc' } = {}) =>
  tmdb.get('/discover/movie', {
    params: {
      page,
      with_genres: genres,
      primary_release_year: year,
      'vote_average.gte': rating,
      sort_by: sortBy,
      include_adult: false,
    },
  })

export const getMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`)

export const getSimilar = (id, page = 1) =>
  tmdb.get(`/movie/${id}/similar`, { params: { page } })

export default tmdb
