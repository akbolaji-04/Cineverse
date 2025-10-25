import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

if (!API_KEY) {
  // Friendly runtime warning so missing API keys are easier to diagnose in production
  // Note: Vite inlines VITE_ variables at build-time — ensure you set VITE_TMDB_API_KEY in your host (Netlify/Vercel) before building.
  // eslint-disable-next-line no-console
  console.warn('VITE_TMDB_API_KEY is not set. TMDB requests will likely fail with 401. Set VITE_TMDB_API_KEY in your environment.')
}

const client = axios.create({
  baseURL: BASE,
  params: {
    api_key: API_KEY
  }
})

export async function tmdbGet(path, params = {}) {
  try {
    const res = await client.get(path, { params })
    return res.data
  } catch (err) {
    // Improve error messaging for 401s so it's clear the API key is missing/invalid
    if (err?.response?.status === 401) {
      const message = 'TMDB returned 401 Unauthorized. Check that VITE_TMDB_API_KEY is set and is a valid TMDB v3 API key.'
      // eslint-disable-next-line no-console
      console.error(message)
      // Attach a clearer message to the thrown error
      err.message = message + (err.message ? ' — ' + err.message : '')
    }
    throw err
  }
}

export function posterUrl(path, size = 'w300') {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}
