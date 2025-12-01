# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + TypeScript + Vite** application currently in a minimal starter state. The project appears to be in transition from a previous **Next.js + Prisma** architecture (based on git history showing deleted files). The current stack includes:

- **Frontend**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4 with Hot Module Replacement (HMR)
- **Styling**: Tailwind CSS 4.1.17 with PostCSS and Autoprefixer
- **Linting**: ESLint 9.39.1 with TypeScript ESLint and React plugins
- **Package Manager**: npm (package-lock.json)

**Important Context**: Many files were deleted in recent commits, removing a Next.js App Router structure, Prisma database integration, API routes, dashboard components, and custom UI library. The current state is a basic Vite + React template.

## Common Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (default: http://localhost:5173) |
| `npm run build` | Build for production (`tsc -b && vite build`) |
| `npm run lint` | Run ESLint on all files |
| `npm run preview` | Preview production build locally |

**Note**: No test scripts are currently configured. The build process includes TypeScript compilation (`tsc -b`) followed by Vite bundling.

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration with React plugin |
| `tailwind.config.js` | Tailwind CSS configuration (content paths: `index.html`, `src/**/*`) |
| `postcss.config.js` | PostCSS configuration for Tailwind and Autoprefixer |
| `eslint.config.js` | ESLint configuration for TypeScript and React (flat config) |
| `tsconfig.json` | Base TypeScript config referencing app and node configs |
| `tsconfig.app.json` | TypeScript config for React app (strict mode enabled) |
| `tsconfig.node.json` | TypeScript config for Node.js/Vite config files |

## Source Code Structure

Current minimal structure:
```
src/
├── App.tsx           # Main App component (counter demo)
├── App.css          # Component-specific styles
├── main.tsx         # React entry point (uses StrictMode)
├── index.css        # Global styles with Tailwind directives
└── assets/          # Static assets (react.svg, vite.svg)
```

Previous deleted structure (for context):
```
src/app/              # Next.js App Router (deleted)
src/components/       # Custom UI components (deleted)
src/lib/              # Utilities and database client (deleted)
src/types/            # TypeScript definitions (deleted)
src/api/              # API routes (deleted)
```

## Architectural Notes

### TypeScript Configuration
- Strict mode enabled with all strict TypeScript flags
- React JSX transform (`"jsx": "react-jsx"`)
- ES2022 target for browser compatibility
- Module resolution: bundler (Vite-compatible)
- Separate configs for app and Node.js environments

### Styling Approach
- Tailwind CSS utility-first methodology
- Global styles in `src/index.css` with `@tailwind` directives
- Component-specific styles in `src/App.css`
- No CSS-in-JS or CSS modules currently configured

### Development Workflow
1. Run `npm run dev` for development server with HMR
2. Code changes automatically refresh the browser
3. Use `npm run lint` to check code quality
4. Build with `npm run build` for production deployment
5. Preview with `npm run preview` to test production build

### Missing Components (Compared to Previous State)
- No state management library (Redux, Zustand, etc.)
- No testing framework (Jest, Vitest, etc.)
- No database/backend integration
- No authentication system
- No custom UI component library
- No API routes or server-side logic

## Important Considerations for Future Development

1. **Project Transition**: This appears to be a project migrating from Next.js to Vite. Future development should clarify whether to:
   - Continue with Vite + React SPA architecture
   - Re-implement previous features in new architecture
   - Consider migrating back to Next.js if SSR/API routes needed

2. **Feature Re-implementation**: The git history shows previous features included:
   - Dashboard with sidebar/header layouts
   - Attractions, routes, and suggestions pages
   - API endpoints for data management
   - Prisma ORM with SQLite database
   - Toast notification system

3. **Development Recommendations**:
   - Add testing framework (Vitest recommended for Vite projects)
   - Consider state management if application complexity grows
   - Re-evaluate UI component strategy (custom vs. library)
   - Document architectural decisions for transition

## Git Status Notes

The repository shows many deleted files in the working directory. Before making significant changes, consider:
- Reviewing git history for context: `git log --oneline`
- Understanding why the transition occurred
- Consulting with team members about architectural direction