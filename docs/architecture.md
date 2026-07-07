# AOS Architecture

Last updated: 2026-07-07

## Overview

AOS (AULEXMED Operating System) is a platform-agnostic operations engine. It is **not a website**, **not a backend for the Website**, and **not a CMS**. It is a standalone CLI-first product that automates operational workflows across e-commerce platforms.

## Design Principles

1. **Platform Agnostic** — Modules work across TikTok, Temu, Amazon via connectors
2. **CLI First** — Primary interface is the command line; API is secondary
3. **Safety First** — Stage-gated policies prevent auto-execution of dangerous operations
4. **Audit Everything** — Every operation writes an action log
5. **Degrade Gracefully** — AI failures fall back to conservative defaults; DB failures skip safely

## Directory Structure

```
src/
├── core/           # Framework core — no business logic
│   ├── types/      # Shared types (Result<T>, Platform, ModuleName)
│   ├── config/     # Env var loading + Zod validation
│   ├── logging/    # Structured JSON-line logger
│   └── errors/     # AppError class + error codes
│
├── infra/          # Infrastructure — shared service clients
│   ├── database/   # Supabase REST client (service role)
│   ├── ai/         # DeepSeek API client + JSON extraction
│   └── notify/     # Feishu webhook notifications
│
├── modules/        # Business domain modules
│   └── roe/        # Review Operations Engine (deferred to Sprint 2+)
│
├── cli/            # CLI entry (commander)
└── api/            # HTTP API (Hono, reserved for future webhooks)
```

## Data Flow

```
Platform Data (JSON file / API)
    │
    ▼
Connector (platform-specific normalization)
    │
    ▼
Service (orchestration: dedup → analyze → store → notify)
    │
    ├──► Database (Supabase)
    │
    └──► Notification (Feishu)
```

## Module Pattern

Each business module under `src/modules/<name>/` follows this structure:

```
modules/<name>/
├── types.ts           # Module-specific types
├── connectors/        # Platform adapters (tiktok/, temu/, amazon/)
├── analyzers/         # AI analysis logic
├── services/          # Orchestration / business logic
├── db/                # Module-specific database queries
├── actions/           # Safety policy engine
├── reports/           # Report generation
└── prompts/           # AI prompt templates
```

## Database

- **Provider**: Supabase (PostgreSQL)
- **Access**: Service role key only (no public API)
- **RLS**: Enabled on all tables, default deny
- **Migrations**: SQL files under `supabase/migrations/`

### Tables

| Table | Purpose |
|-------|---------|
| `review_cases` | Review records from all platforms |
| `review_case_actions` | Audit log for review operations |
| `review_case_messages` | Reply drafts and sent messages |
| `review_daily_summaries` | Per-platform daily aggregation |

## External Services

| Service | Purpose | Auth |
|---------|---------|------|
| Supabase | Database | Service role key |
| DeepSeek | AI analysis | API key |
| Feishu | Internal notifications | Webhook URL |

## Security

- No browser-exposed keys
- No public API routes
- Password hashing via `crypto.timingSafeEqual` (when auth is added)
- All external API calls use HTTPS
- No secrets in repository
