# Phone Verification Not Working (Live Site)

If parents (or coaches) aren’t receiving verification codes on the **live site**, check these in order:

---

## 1. Twilio Verify Service SID in Vercel

Phone verification requires a **Twilio Verify Service**, not just regular Twilio SMS.

**Check:**
1. Go to [Vercel Dashboard](https://vercel.com) → your project → **Settings** → **Environment Variables**
2. Make sure you have:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID` ← **This one is required for verification**

If `TWILIO_VERIFY_SERVICE_SID` is missing:
1. Go to [Twilio Console](https://console.twilio.com) → **Verify** → **Services**
2. Click **Create new** and name it (e.g. “My Hockey Recruiting”)
3. Copy the **Service SID** (starts with `VA...`)
4. Add it in Vercel as `TWILIO_VERIFY_SERVICE_SID`
5. Redeploy so the new variable is applied

---

## 2. Twilio Trial Account Restriction

If you’re on a **Twilio Trial** account, SMS can only be sent to numbers you’ve **pre‑verified** in Twilio.

**Signs:** Users never get the SMS, or you see error 21608 in Vercel logs.

**Options:**
- **Upgrade to a paid Twilio account** (recommended for production) – removes this limit
- Or add test numbers at [Twilio Console](https://console.twilio.com) → **Phone Numbers** → **Manage** → **Verified Caller IDs**

---

## 3. Vercel Logs

After a sign-up or “Resend code” attempt, check what happened:

1. Vercel Dashboard → your project → **Logs**
2. Filter by the time of the attempt
3. Look for:
   - `[Twilio Verify] send failed:` – shows Twilio error code and message
   - `[Twilio Verify] Missing env:` – one or more Twilio env vars are not set

Common codes:
- **21608** – Trial account; number not in Verified Caller IDs
- **21211** – Invalid phone number format
- **21408** – Geographic/permissions restriction

---

## 4. Phone Number Format

The app normalizes numbers to E.164 (e.g. `+15551234567` for US). Most US/Canada 10‑digit numbers are handled correctly. International numbers may need country codes.

---

## 5. If It’s Still Not Working

1. Check Vercel logs for the exact Twilio error code.
2. Confirm all three Twilio env vars are set in Vercel.
3. Upgrade to a paid Twilio account if you’re on a trial and need to verify real users.
4. Use the Contact Us form for further help.
