# AOS — AULEXMED Operating System

Operations engine for the AULEXMED brand. Platform-agnostic, CLI-first.

## Architecture

```
src/
├── core/          # Framework core (types, config, logging, errors)
├── infra/         # Shared infrastructure (database, AI, notifications)
├── modules/       # Business domain modules (roe, future: ads, content...)
├── cli/           # CLI entry point (commander)
└── api/           # HTTP API layer (Hono, future)
```

## Getting Started

```bash
cp .env.example .env
# Fill in required environment variables

npm install
npm run dev
```

## CLI Commands

```bash
npm run dev -- health          # Health check
npm run dev -- roe collect ... # Review Operations (future)
```

## Development

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run build        # Compile to dist/
```
