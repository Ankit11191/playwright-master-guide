# Playwright Master Guide (160 Q&A)

A comprehensive browser-based learning application and reference handbook for Playwright interview preparation and technical mastery, built as a modern React + Vite application.

## Features

- **160 In-Depth Interview Q&A**: Filterable across Beginner (49), Intermediate (74), and Advanced (37) difficulty tiers.
- **Dynamic Topic & Difficulty Filtering**: Real-time cross-filtering across 10 categories with active question counts.
- **Interactive Active Recall**: Flashcard mode with spacebar/arrow key navigation, shuffle, and level/category filtering.
- **Interactive Quiz Engine**: Randomized mock interview testing with instant explanations and scoring.
- **Comprehensive Cheat Sheet**: 10 reference categories covering 90+ locator APIs, assertions, CLI commands, fixtures, and network mocking patterns.
- **Study Progress Tracking**: Track "Mastered" and "Bookmarked" questions in browser `localStorage`.
- **Export Handbook**: Instant export of all 160 questions or the cheat sheet to Markdown and JSON formats.
- **Offline PWA Support**: Fast offline caching and PWA service worker.

## Local development

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the local URL shown in the terminal, usually http://localhost:3000

## Production build

npm run build

The generated static files are placed in the dist folder and can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Any static web server

## Deploy to GitHub Pages

1. Ensure the project is pushed to a GitHub repository.
2. Run the deploy command:
   npm run deploy:gh-pages
3. In GitHub, enable Pages from the gh-pages branch or use the Pages action output for your repository.

## Notes

- The app is fully client-side and does not require a backend server.
- The app uses browser localStorage for progress persistence.
- The Vite config uses relative asset paths so it works cleanly on GitHub Pages.
