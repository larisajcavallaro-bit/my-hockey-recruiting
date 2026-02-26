# Stripe Subscription Setup

This guide walks you through setting up Stripe for subscriptions on My Hockey Recruiting.

---

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete account verification (you can use test mode first)

---

## 2. Get Your API Keys

1. In Stripe Dashboard: **Developers** → **API keys**
2. Copy your **Secret key** (starts with `sk_test_` for test, `sk_live_` for production)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

## 3. Create Products and Prices in Stripe

In **Stripe Dashboard** → **Products**, create these products and their recurring prices:

| Plan         | Monthly Price | Annual Price | Billing Interval |
|-------------|---------------|--------------|------------------|
| Gold        | $3.99         | $33.99       | month / year     |
| Elite       | $5.99         | $59.99       | month / year     |
| Family Gold | $9.99         | $99.99       | month / year     |
| Family Elite| $14.99        | $149.99      | month / year     |

For each product:

1. Click **Add product**
2. Name it (e.g. "Gold Profile")
3. Add a **Price** – choose "Recurring", set amount and interval (monthly or yearly)
4. Copy the **Price ID** (starts with `price_`)

Add all 8 Price IDs to `.env.local`. **Important:** These must be Stripe Price IDs (e.g. `price_1ABC123xyz...`), NOT dollar amounts like `3.99`. You get Price IDs from the Stripe Dashboard after creating each product and price.

```
STRIPE_PRICE_GOLD_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_GOLD_ANNUAL=price_xxxxxxxxxxxxx
STRIPE_PRICE_ELITE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_ELITE_ANNUAL=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_GOLD_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_GOLD_ANNUAL=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_ELITE_MONTHLY=price_xxxxxxxxxxxxx
STRIPE_PRICE_FAMILY_ELITE_ANNUAL=price_xxxxxxxxxxxxx
```

---

## 4. Set Up the Webhook (for subscription updates)

Stripe notifies your app when subscriptions change. You need a webhook endpoint.

### Local development (use Stripe CLI)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/subscription/webhook
   ```
3. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Production (Vercel or your host)

1. In Stripe Dashboard: **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://your-domain.com/api/subscription/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy the **Signing secret** and add it to your hosting env vars as `STRIPE_WEBHOOK_SECRET`

---

## 5. Configure Stripe Customer Portal (optional)

For "Manage Billing" and "Change plan", Stripe Customer Portal is used.

1. In Stripe Dashboard: **Settings** → **Billing** → **Customer portal**
2. Configure what customers can do (update payment, cancel, etc.)
3. No extra env vars needed; it uses your `STRIPE_SECRET_KEY`

---

## 6. Test the Flow

1. Ensure `.env.local` has all Stripe variables
2. Run `npm run dev`
3. Sign in as a parent
4. Go to **Subscription** or **Settings** → **Subscription**
5. Choose a paid plan → you should be redirected to Stripe Checkout
6. Use test card `4242 4242 4242 4242` for successful payment

---

## Checklist for Go-Live

- [ ] Switch to live API keys (`sk_live_`, `pk_live_`)
- [ ] Create live-mode products and prices
- [ ] Add production webhook endpoint with live signing secret
- [ ] Add all Stripe env vars to Vercel (or your host)
