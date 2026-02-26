# My Hockey Recruiting

A platform for youth hockey families and coaches—profiles, events, RSVPs, training facilities, schools & programs, subscriptions, and more.

## Quick Start

```bash
npm install
cp .env.example .env.local   # Add your values
npm run db:push              # Sync database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Seed database |
| `npm run test:e2e` | Run Playwright e2e tests |
| `npm run lint` | Run ESLint |

## Documentation

All setup guides are in the `docs/` folder:

| Doc | Purpose |
|-----|---------|
| [docs/DEPLOY.md](docs/DEPLOY.md) | Deploy to Vercel |
| [docs/READY-TO-GO-LIVE.md](docs/READY-TO-GO-LIVE.md) | Pre-launch checklist |
| [docs/EVENT-REMINDERS-SETUP.md](docs/EVENT-REMINDERS-SETUP.md) | SMS event reminders (cron) |
| [docs/STRIPE-SETUP.md](docs/STRIPE-SETUP.md) | Stripe subscriptions |
| [docs/BACKEND-SETUP.md](docs/BACKEND-SETUP.md) | Database & auth |
| [docs/ADMIN-PORTAL.md](docs/ADMIN-PORTAL.md) | Admin features |
| [docs/GODADDY-DOMAIN-SETUP.md](docs/GODADDY-DOMAIN-SETUP.md) | Custom domain |
| [docs/CODE-REVIEW.md](docs/CODE-REVIEW.md) | Code review notes |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** NextAuth v5
- **Database:** Prisma + PostgreSQL (Neon)
- **Payments:** Stripe
- **SMS:** Twilio (Verify + reminders)
- **Hosting:** Vercel
