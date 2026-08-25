# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

ig.news: subscription blog originally built during Rocketseat Ignite (2022),
modernized in 2026. Next.js 16 (pages router) + React 19, Stripe Checkout,
GitHub OAuth via next-auth, Prismic CMS for posts, Prisma 7 + SQLite for
subscriptions. Branches: `main` (stable) and `develop` (work happens here).

## Commands

```bash
npm install             # node >= 22 (see .nvmrc); postinstall runs prisma generate
cp .env.example .env    # works empty: sandbox providers activate automatically
npx prisma migrate deploy
npm run db:seed         # alice (active plan), bob (canceled), carol (no plan)
npm run dev             # http://localhost:3010 (PORT env respected)
npm run typecheck       # must pass with zero errors before any commit
npm run lint            # eslint flat config, next core-web-vitals
npm run test:e2e        # playwright, expects a running server on :3010 or starts one
npm run build           # production build must stay green
```

## Architecture notes

- Data layer is Prisma 7 + SQLite (FaunaDB was discontinued). Config lives in
  `prisma.config.ts`; generated client goes to `src/generated/prisma`
  (gitignored). Relative DATABASE_URL resolves against the project root.
- External integrations are pluggable providers under `src/services/cms` and
  `src/services/payments`: real implementation when env credentials exist,
  sandbox implementation otherwise. Never hardcode provider URLs.
- All API routes use the `{ data, error }` response envelope from
  `src/lib/api.ts` plus zod validation; authorize first, validate after.
- Webhook signature verification uses `getStripeWebhooks()` which works
  offline; regular API calls require `getStripe()`.
- Imports use the single `@/*` alias mapped to `src/*` (tsconfig paths).
  Same module relative imports are fine.

## Rules for agents

- Conventional Commits, short messages, one logical block per commit.
- Never force push without explicit owner approval.
- Never commit `.env`, binaries or keys; `.env.example` documents every
  variable. REACTIVATION.md is local only (git/info/exclude).
- No em dashes anywhere (code, commits, docs).
- English for all repository content.
- Run typecheck, lint, build and the E2E suite before declaring work done.
- Port 3000 may be occupied by other local projects; default to PORT=3010.
