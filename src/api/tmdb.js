import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

const client = axios.create({
  baseURL: BASE,
  params: {
    api_key: API_KEY
  }
})

export async function tmdbGet(path, params = {}) {
  const res = await client.get(path, { params })
  return res.data
}

export function posterUrl(path, size = 'w300') {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}
