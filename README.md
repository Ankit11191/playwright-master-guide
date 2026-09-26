# Playwright 50 Master Guide

A browser-based learning app for Playwright interview preparation, built as a static React + Vite web application.

## Features

- 50 Playwright interview questions and answers
- Category and difficulty filters
- Mastered/bookmarked tracking in local storage
- Flashcards, quiz mode, and architecture study views
- Offline-ready PWA support
- Static build suitable for GitHub Pages, Netlify, Vercel, or any standard web host

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
