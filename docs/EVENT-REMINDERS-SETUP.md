# Event Reminders Setup

Parents who RSVP "going" to an event will receive an SMS reminder **24 hours before** the event starts—as long as they have Event Reminders turned on in **Settings → Notifications** and a phone number on their profile.

---

## What You Need

1. **Twilio** – Same account you use for sign-up verification (SMS)
2. **Vercel Pro** – Cron jobs only run on the Pro plan
3. **CRON_SECRET** – A secret key so only Vercel can trigger the reminders

---

## Step 1: Generate CRON_SECRET

1. On your Mac, open **Terminal** (or the black text box in Cursor)
2. Run: `openssl rand -hex 32`
3. Copy the long string it gives you (e.g. `a1b2c3d4e5f6...`). This is your `CRON_SECRET`.

---

## Step 2: Add CRON_SECRET to Vercel

1. Go to [vercel.com](https://vercel.com) and open your project
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name:** `CRON_SECRET`
   - **Value:** paste the secret you generated
4. Choose **Production** (and Preview if you want)
5. Click **Save**
6. **Redeploy** your site so the new variable is used (Deployments → … menu → Redeploy)

---

## Step 3: Verify Twilio

Event reminders use the same Twilio setup as your verification texts. Make sure these are set in Vercel:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (your Twilio number, e.g. +15551234567)

If sign-up verification works, reminders will use the same setup.

---

## Step 4: Confirm Vercel Plan

Cron jobs run only on the **Pro** plan. If you’re on Hobby, upgrade to Pro in Vercel for the cron to work.

---

## How It Works

1. **Hourly** – Vercel calls your `/api/cron/event-reminders` endpoint every hour
2. **24‑hour window** – It checks for events starting in about 24 hours (23–25 hour window)
3. **Eligible parents** – Parents who:
   - RSVP’d **going** and chose a child
   - Have Event Reminders **on** in Settings → Notifications
   - Have a **phone number** on their profile
4. **SMS** – They receive a text like:
   > *Reminder: You RSVP'd Jake to AAA Tryouts (Saturday, Mar 15 at 9:00 AM) at Arctic Ice Arena, 123 Main St.*

---

## Testing

### Option A: Create a test event

1. Sign in as a coach
2. Create an event that starts about 24 hours from now
3. Sign in as a parent
4. RSVP “Going” and pick a child
5. Ensure Event Reminders is ON and your profile has a phone number
6. Wait for the next hourly cron run (or use Option B)

### Option B: Trigger the cron manually

If you have your `CRON_SECRET`:

```bash
curl "https://your-site.vercel.app/api/cron/event-reminders" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace `YOUR_CRON_SECRET` with the value from Step 1, and `your-site.vercel.app` with your domain.

---

## Turning Reminders Off

Parents can turn Event Reminders off in **Settings → Notifications**. The toggle is stored in the database, so their choice persists across sessions.

---

## Checklist

- [ ] `CRON_SECRET` added to Vercel environment variables
- [ ] Project redeployed after adding `CRON_SECRET`
- [ ] Twilio credentials set (SMS verification already working)
- [ ] Vercel Pro plan active
- [ ] Parent profile has phone number when testing
