# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

ig.news: subscription blog built during Rocketseat Ignite (2022). Next.js 12
+ React 18 with Stripe checkout, GitHub OAuth via next-auth, Prismic CMS for
posts and FaunaDB for subscriptions. Default branch was `igNews`, migrated
to the main/develop convention.

## Commands

```bash
yarn install
cp .env.example .env    # Stripe, GitHub OAuth, FaunaDB, JWT and Prismic settings
yarn dev                # http://localhost:3000
yarn slicemachine       # Prismic Slice Machine (content modeling)
```

## Structure

- `src/pages`: home (post list), `posts/[slug]` (paywalled content), `/api` (auth, subscribe, webhooks)
- `src/services`: Stripe, Prismic and CMS API clients
- `customtypes`, `.slicemachine`, `sm.json`: Prismic Slice Machine content models

## Rules for agents

- Docs-only maintenance phase: no dependency upgrades or runtime behavior changes
- Never commit `.env`, binaries or keys; `.env.example` documents all required variables
