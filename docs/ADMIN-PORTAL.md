# Admin Portal – My Hockey Recruiting

The admin portal lets you manage lookups, contact messages, review disputes, training submissions, and users. It also supports **Zapier** for automation.

---

## Accessing the Admin Portal

1. **Sign in** at `/auth/sign-in` with an account that has the **ADMIN** role.
2. You’ll be redirected to `/admin-dashboard`.

### Creating an admin account

**Option A: Use the seed (for development)**  
Run `npx prisma db seed` – this creates `admin@example.com` / `password123`.

**Option B: Promote an existing user**  
Change a user’s role in the database to `ADMIN`:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## Admin Portal Sections

| Section | What you can do |
|---------|------------------|
| **Overview** | Summary counts and quick links |
| **Lookups** | Add, edit, delete dropdown options (levels, teams, leagues, coach titles, birth years, specialties) |
| **Contact Messages** | View all messages from the Contact Us form |
| **Review Disputes** | View coach and parent disputes; mark as resolved or dismissed |
| **Training Submissions** | View training requests; approve or reject |
| **Users** | View all users and filter by role |
| **Zapier** | Setup instructions and API endpoints |

---

## Zapier Integration

### Two ways to use Zapier

1. **Webhooks (push)** – Your app sends data to Zapier when something happens.
2. **API (pull)** – Zapier fetches data from your API on a schedule.

### Setup

Add these to `.env.local`:

```env
# Generate with: openssl rand -hex 32
ADMIN_API_KEY=your-secret-key

# Optional: Zapier "Catch Hook" URL – new events are posted here
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
```

### Webhook (push) – automatic notifications

When `ZAPIER_WEBHOOK_URL` is set, these events are posted to Zapier:

| Event | When | Payload |
|-------|------|---------|
| `contact_message` | Someone submits Contact Us form | id, firstName, lastName, email, topic, message, createdAt |
| `coach_review_dispute` | Coach disputes a review | id, reviewId, coachProfileId, reason, status, createdAt |
| `player_review_dispute` | Parent disputes a player review | id, reviewId, parentProfileId, reason, status, createdAt |
| `facility_submission` | User submits training request | id, facilityName, address, city, status, createdAt |
| `facebook_post` | Admin clicks "Share to Facebook" on a blog post | message, link, title, imageUrl, timestamp |

**Zapier setup:** Create a Zap → Trigger: **Webhooks by Zapier** → **Catch Hook** → Copy the webhook URL into `ZAPIER_WEBHOOK_URL`.

**Facebook posting:** In Blog Posts, click the share icon to send a post to Zapier. Add a Filter step (event = `facebook_post`) then **Facebook Pages** → **Create Page Post**.

### API (pull) – fetch data from Zapier

Use **Webhooks by Zapier** → **GET** or **Custom Request** with:

- **URL:** `https://your-site.com/api/zapier/contact-messages` (or `/disputes`, `/facility-submissions`)
- **Header:** `Authorization: Bearer YOUR_ADMIN_API_KEY`

Endpoints:

- `GET /api/zapier/contact-messages` – Contact form messages
- `GET /api/zapier/disputes?status=pending` – Pending disputes
- `GET /api/zapier/facility-submissions?status=pending` – Pending training submissions

---

## Database: Add FacilitySubmission table (Training)

After pulling these changes, run:

```bash
npx prisma db push
```

Or, if you use migrations:

```bash
npx prisma migrate dev --name add_facility_submissions
```

---

## Security

- Admin routes require `role === "ADMIN"`.
- Zapier API endpoints require `Authorization: Bearer <ADMIN_API_KEY>`.
- Keep `ADMIN_API_KEY` secret and do not commit it.
