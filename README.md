# ignews

![Next.js](https://img.shields.io/badge/Next.js-12-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?logo=typescript&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-subscriptions-008CDD?logo=stripe&logoColor=white)

ig.news is a subscription blog built during [Rocketseat Ignite](https://rocketseat.com.br)
(2022): readers sign in with GitHub, subscribe through Stripe Checkout and
get full access to posts published on a Prismic CMS headless blog.

## Features

- GitHub OAuth login (next-auth)
- Stripe Checkout subscription flow with webhook handling
- Posts rendered from Prismic CMS (SSG/ISR)
- Paywall logic: subscribers read full posts, visitors get previews
- Subscriptions stored in FaunaDB

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 12 |
| Language | TypeScript |
| UI | React 18, Sass modules, react-icons |
| Payments | Stripe (checkout + webhooks) |
| Auth | next-auth (GitHub provider) + JWT signing |
| Content / data | Prismic CMS (+ Slice Machine), FaunaDB |

## How to run

```bash
# requirements: Node.js 14-16 era runtime (see legacy note)
yarn install
cp .env.example .env    # fill Stripe, GitHub, FaunaDB, JWT and Prismic variables
yarn dev                # http://localhost:3000
```

## Legacy note

Study project from 2022. Dependencies are pinned to that era (Next.js 12,
React 18, Stripe SDK 8); expect friction on current runtimes without
upgrades. Estimated modernization effort if picked up later: medium (1 day),
bumping Next.js majors and replacing FaunaDB (now part of Datastax). No
fixes are planned as part of this cleanup phase.

## License

[MIT](LICENSE)

## Author

Built by [Tiago Gonçalves de Castro](https://github.com/tiagogcastro)
· [LinkedIn](https://www.linkedin.com/in/tiagogcastro)
