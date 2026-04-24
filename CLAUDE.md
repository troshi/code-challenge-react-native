# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expo React Native app (SDK ~54.0.33) with file-based routing via expo-router. Uses React 19, TypeScript, and the new architecture (newArchEnabled: true).

## Commands

```bash
npm install              # Install dependencies
npm start                # Start Expo dev server (npx expo start)
npm run android          # Run on Android emulator
npm run ios              # Run on iOS simulator
npm run web              # Run on web browser
npm run lint             # Run ESLint
npm run reset-project    # Reset to blank app (moves starter code to app-example)
```

## Architecture

- **Routing**: File-based routing with expo-router. The `app/` directory defines routes:
  - `app/_layout.tsx` - Root layout with navigation provider and theme
  - `app/(tabs)/` - Tab-based navigation group (Home, Explore tabs)
  - `app/modal.tsx` - Modal screen with `presentation: 'modal'`
  
- **State Management**: React hooks only (no global state library)

- **Styling**: Inline styles with platform-aware color scheme (light/dark mode via `useColorScheme` hook)

- **Key Directories**:
  - `app/` - Routes and screens
  - `components/` - Reusable UI components (themed-text, themed-view, external-link, etc.)
  - `components/ui/` - Low-level UI primitives (icon-symbol, collapsible)
  - `constants/` - Theme colors and fonts
  - `hooks/` - Custom React hooks (color-scheme, theme-color)

- **Path Aliases**: `@/*` resolves to project root (configured in tsconfig.json)

- **Features**: React Compiler enabled, typed routes, haptic feedback on tab presses
