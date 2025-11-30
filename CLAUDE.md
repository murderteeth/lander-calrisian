# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start dev server on port 3000
bun run build    # Type-check and build for production
bun run lint     # Run ESLint
bun run preview  # Preview production build
```

## Architecture

Simple Vite + React 19 + TypeScript landing page with Tailwind CSS v4.

- `src/App.tsx` - Main application component
- `src/main.tsx` - React entry point with StrictMode
- `src/index.css` - Tailwind import
- `public/` - Static assets (SVG logos)

## Tech Stack

- Vite 7 with @vitejs/plugin-react
- React 19
- TypeScript 5.9
- Tailwind CSS 4 via @tailwindcss/vite plugin
- ESLint 9 flat config with typescript-eslint
