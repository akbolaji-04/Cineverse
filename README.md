# CineVerse

Your universe of film and television. Discover. Track. Enjoy.

This is a React + Vite single-page app that uses The Movie Database (TMDB) API.

Quick start

1. Copy `.env.example` to `.env` and add your TMDB v3 API key as `VITE_TMDB_API_KEY`.

2. Install dependencies:

```powershell
npm install
```

3. Run the dev server:

```powershell
npm run dev
```

4. Open http://localhost:5173

Notes
- The project reads the API key from `import.meta.env.VITE_TMDB_API_KEY`.
- Add items to the Watchlist from movie/tv detail pages. The watchlist is persisted to localStorage.

Features implemented
- Home page with hero and horizontal rows
- Movie / TV details with credits
- Person page with filmography
- Search page with pagination (Load More)
- Watchlist using React Context + localStorage
- Loading skeletons and basic error handling

Next steps and improvements
- Add unit tests and E2E tests
- Add nicer styling or Tailwind integration
- Add authentication to save watchlist to a server

Mobile conversion & CI
---------------------

If you want to convert this web app into a native mobile app, two common approaches are:

- PWAs: Make the site a Progressive Web App and let users "install" it on their phones. This is easiest.
- Capacitor (recommended for native wrapper): Wrap the built web assets with Capacitor to produce Android/iOS native projects.

I've added two GitHub Actions workflows under `.github/workflows/`:

- `build-and-artifact.yml` — builds the web app on pushes to `main` and uploads the `dist` folder as an artifact.
- `android-capacitor-build.yml` — a template workflow that attempts to build an Android APK if you have a Capacitor `android/` project in the repository. It is a template and requires you to add signing keys and initialize Capacitor locally first.

Quick Capacitor steps (locally):

1. Install Capacitor and initialize:

```bash
npm install @capacitor/cli @capacitor/core
npx cap init cineverse com.yourcompany.cineverse
```

2. Build the web app and add Android:

```bash
npm run build
npx cap add android
npx cap copy
npx cap open android
```

3. Configure Android signing in `android/` then you can run Gradle assembleRelease locally or via CI. The `android-capacitor-build.yml` workflow will attempt to run Gradle and upload the release APK as an artifact if an `android/` folder exists.

Security note: If you need to keep the TMDB API key secret for server-side requests, implement a small serverless proxy (Netlify Functions, Vercel Serverless, or AWS Lambda) and call that from the app. Client-side `VITE_` variables are visible to end users after build-time.

"# Cineverse" 
