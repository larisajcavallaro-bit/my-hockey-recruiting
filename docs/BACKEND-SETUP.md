# Backend Setup – My Hockey Recruiting

The backend uses **Prisma** (PostgreSQL) and **Next.js API Routes** (Route Handlers).

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

1. Create a PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or local Postgres).
2. Add your connection string to `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

## 3. Initialize the database schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or use migrations for production:
# npm run db:migrate
```

## 4. Test the backend

```bash
npm run dev
```

- Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- Contact form uses: `POST /api/contact`
- Auth: `POST /api/auth/sign-up`, `POST /api/auth/sign-in`
- Coaches: `GET /api/coaches`, `GET /api/coaches/[id]`
- Players: `GET /api/players`, `GET /api/players/[id]`

## API overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check + DB connectivity |
| `/api/contact` | POST | Contact form submission |
| `/api/auth/sign-up` | POST | Create parent/coach account |
| `/api/auth/sign-in` | POST | Sign in, returns user object |
| `/api/coaches` | GET | List coaches (optional `?search=`) |
| `/api/coaches/[id]` | GET | Coach details |
| `/api/players` | GET | List players (optional `?search=`) |
| `/api/players/[id]` | GET | Player details |

## Database schema

- **User** – Auth (email, role: PARENT | COACH)
- **ParentProfile** – Parent details and linked players
- **CoachProfile** – Coach details, certifications, experience, reviews
- **Player** – Players linked to parents
- **ContactMessage** – Contact form submissions
- **Event** – Events (coach-created)
- **Notification** – User notifications

## Next steps

1. Add **NextAuth.js** (or similar) for session/JWT handling.
2. Replace hardcoded coach/player lists in the dashboards with API calls.
3. Add protected routes and role-based access.
4. Implement forgot-password and email verification.
