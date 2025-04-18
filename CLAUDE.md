# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `yarn build`
- Dev: `yarn dev` (uses Turbopack)
- Start: `yarn start`
- Lint: `yarn lint`

## Code Style
- Use TypeScript with strict typing
- Follow Next.js conventions for components and pages
- Use path alias `@/*` for imports from root directory
- Follow ESLint core-web-vitals and TypeScript rules
- Prefer functional components with React hooks
- Use TailwindCSS for styling (v4)

## Project Structure
- Next.js 15 app router
- React 19
- TypeScript 5+
- Package manager: Yarn
- TailwindCSS 4

## Naming Conventions
- Use PascalCase for components
- Use camelCase for variables and functions
- Use descriptive names for files and functions