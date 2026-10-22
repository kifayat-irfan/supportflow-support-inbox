# SupportFlow — Support Inbox (work in progress)

A help-desk support inbox: ticket management UI plus a Next.js (App Router) backend scaffold
with JWT auth and Gemini AI ticket assistance.

## What's implemented

- `app/api/` — `login` route (email + password → JWT), ticket list/create and ticket reply routes
- `lib/auth.ts` — JWT sign/verify helpers · `lib/prisma.ts` — Prisma client setup
- `services/gemini.ts` — Gemini AI ticket summarization and knowledge-base article suggestions
- `components/` — full inbox UI (`TicketList`, `TicketDetail`, `KnowledgeBase`, `Dashboard`,
  `UserManagement`, `Outbox`, `Notifications`, …)
- `tests/` — placeholder Vitest specs (simulated assertions, not integration tests)

## Gaps (not yet wired up)

- `prisma/schema.prisma` is **empty** — no database models are defined, so the API routes
  have no database to talk to yet.
- The root `App.tsx` is a separate standalone React/Vite mock-data demo (`localStorage`),
  not connected to the Next.js app.

## Run

```bash
npm install
# 1. define your models in prisma/schema.prisma
# 2. set DATABASE_URL and API_KEY (Gemini) in .env
npx prisma migrate dev
npm run dev
```

## Tech

Next.js 14 · TypeScript · Prisma · JWT · Google Gemini AI · React

## Author

Kifayat Irfan
