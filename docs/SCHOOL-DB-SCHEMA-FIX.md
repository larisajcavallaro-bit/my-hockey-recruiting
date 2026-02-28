# Fix: School Update "Invalid update invocation" (boysWebsite / girlsWebsite)

If you see a **500 error** when editing a school/team in Admin → Schools, with a message mentioning `boysWebsite` or `girlsWebsite`, your **database is missing those columns**.

## Quick fix (recommended)

Run this so your database matches the Prisma schema:

```bash
# Local development (uses .env.local):
npm run db:push

# Or for production (use your Neon DATABASE_URL from Vercel env vars):
DATABASE_URL="your-neon-connection-string" npx prisma db push
```

This adds `boys_website` and `girls_website` to the `school_submissions` table if they're missing.

---

## Alternative: Add columns manually in Neon

If `db push` isn’t possible, run this in the **Neon SQL Editor** (or any PostgreSQL client):

```sql
-- Add boys_website and girls_website columns to school_submissions
ALTER TABLE school_submissions
  ADD COLUMN IF NOT EXISTS boys_website TEXT,
  ADD COLUMN IF NOT EXISTS girls_website TEXT;
```

Note: `ADD COLUMN IF NOT EXISTS` requires PostgreSQL 9.6+. If your Postgres is older, run:

```sql
ALTER TABLE school_submissions ADD COLUMN boys_website TEXT;
ALTER TABLE school_submissions ADD COLUMN girls_website TEXT;
```

(You may see "column already exists" if they’re there, which is fine.)
