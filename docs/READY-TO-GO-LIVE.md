# Ready to Go Live Checklist – My Hockey Recruiting

Use this checklist before pointing your domain (myhockeyrecruiting.com) to the live site. Check off each item as you verify it works.

---

## 1. Auth & sign-up flow

- [x] **Parent sign up** – Create account → phone verification → auto sign-in → parent dashboard
- [x] **Coach sign up** – Create account → phone verification → auto sign-in → coach dashboard
- [x] **Regular sign in** – Parent email → parent portal; coach email → coach portal
- [x] **Sign out** – Logout works from both dashboards
- [x] **Password reset / Forgot password** – (If implemented) works end-to-end

---

## 2. Parent portal

- [X] **Overview** – Page loads, shows correct parent info
- [X] **Players** – Add player, view player list, view player details
- [x] **Coaches** – View coach list, view coach profile
- [x] **Events** – See events (if applicable)
- [X] **Profile** – View/edit parent profile
- [x] **Settings** – Security, notifications, billing (if used)
- [x] **Verifications** – (If applicable) works as expected

---

## 3. Coach portal

- [x] **Overview** – Page loads, shows correct coach info
- [x] **Players** – View player list, view player details
- [x] **Events** – Create/view events (if applicable)
- [X] **Team management** – Works as expected
- [x] **Profile** – View/edit coach profile, certifications
- [X] **Settings** – Security, notifications
- [X] **Verifications** – (If applicable) works as expected

---

## 4. Public / marketing pages

- [X] **Homepage** – Loads correctly
- [X] **Contact form** – Submits and works (check for emails/storage)
- [X] **About us** – Content displays
- [X] **Terms of service** – Content displays
- [X] **Privacy policy** – Content displays
- [X] **Facilities** – (If applicable) browse and view facility details

---

## 5. Data & API

- [ ] **Coaches API** – List and single coach return real data
- [ ] **Players API** – List and single player return real data
- [ ] **Reviews** – Can submit and view coach/player reviews
- [ ] **Database** – All tables created in Neon; no schema errors

---

## 6. Deployment setup

- [ ] **Vercel** – Project connected to GitHub repo
- [ ] **Environment variables in Vercel:**
  - [ ] `DATABASE_URL` (from Neon)
  - [ ] `AUTH_SECRET` (run `openssl rand -base64 32` to generate)
  - [X] `TWILIO_ACCOUNT_SID`
  - [X] `TWILIO_AUTH_TOKEN`
  - [X] `TWILIO_VERIFY_SERVICE_SID` (required for phone verification; create a Verify Service in Twilio Console)
  - [X] `TWILIO_PHONE_NUMBER` (for SMS, if used elsewhere)
  - [X] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (if used)
  - [X] Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and all `STRIPE_PRICE_*` vars (see STRIPE-SETUP.md)
- [ ] **Code pushed** – Latest changes pushed to GitHub; Vercel deploy succeeds
- [ ] **Database schema on Neon** – Run `npx prisma db push` with production `DATABASE_URL` (or migrations)

---

## 7. Final checks

- [X] **Test on phone** – Sign up, sign in, and key flows on mobile
- [X] **SMS verification** – Real phone receives codes (not just dev toast)
- [X] **No console errors** – Check browser DevTools (F12) for red errors on main pages
- [ ] **HTTPS** – Site loads over `https://` (Vercel does this by default)

---

## When everything is checked

1. In Vercel: **Settings** → **Domains** → add `myhockeyrecruiting.com` (if not already)
2. In GoDaddy: add the DNS records from [GODADDY-DOMAIN-SETUP.md](./GODADDY-DOMAIN-SETUP.md)
3. Wait for DNS propagation (often 15–30 min)
4. Visit **https://myhockeyrecruiting.com** and confirm it loads

---

*If a feature isn’t built yet, leave it unchecked and either complete it or remove it from the checklist before going live.*
