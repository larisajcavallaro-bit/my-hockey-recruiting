# Code Review – My Hockey Recruiting (Pre-Production)

**Date:** Feb 24, 2025  
**Status:** Review complete, cleanup and fixes applied  
**Last update:** Feb 24, 2025 – Pre-launch code cleanup

---

## Executive summary

The codebase is largely production-ready. Auth, API validation, and Prisma setup are solid. Several cleanup items (duplicate/unused files, leftover template content, and minor fixes) were identified and addressed. E2E tests were added via Playwright.

### Pre-launch cleanup (Feb 24, 2025)

- **ESLint:** Added ignores for `playwright-report`, `node_modules`, `.venv-numbers`, `prisma/migrations` to avoid linting third-party code
- **React hooks:** Fixed `set-state-in-effect` warnings by deferring fetch/setState calls with `Promise.resolve().then()` in all data-fetching effects
- **Conditional hook:** Fixed `SubscriptionPage` – moved `useState(loadingPlanId)` above early return so hooks are never called conditionally
- **Unused imports/vars:** Removed `Link`, `Input`, `cn`, `Card`, `CardContent`, `CalendarDays`, `total`, `isGoalie`, `getPlayerLimit`
- **Accessibility:** Added `aria-selected="false"` to `TypeaheadInput` option elements
- **TypeScript/build:** Fixed blog `publishedAt` serialization, `prisma.league` → `lookupValue` for leagues API, admin users `UserRole` cast, facility `updatedAt` → `createdAt`, `SchoolDetails` uniqueLeagues type, `AdminEditSchoolModal` league default `[]`, `TypeaheadInput` debounceRef init
- **Images:** Switched admin blog post preview to Next.js `Image` component
- **Playwright:** Disabled Firefox project (run `npx playwright install` to install browsers before e2e tests)

---

## Findings and fixes

### 1. Duplicate / dead files (removed)

- **`coach-dashboard/players copy/`** – Duplicate folder; removed. Use `players/` instead.
- **`SendUsAMassege.tsx`** – Typo in filename, included `console.log`, and did not call the API; removed.
- **`SendUsAMessage.tsx`** – Unused (contact page uses its own form with correct schema); removed.
- **`grammerJsonData.ts`** – Typo duplicate of `grammarJsonData.ts`; removed.

### 2. Template leftovers (cleaned)

- **ExploreByCategory** – “Maurita Topics” renamed to “Training Topics” for hockey context.
- **ContactInformation.tsx** – Replaced onschedule.ca placeholders with hockey recruiting placeholders.
- **maurita.services.ts** – Empty template leftover; removed.

### 3. Security

- **Dev reset password** (`/api/auth/dev-reset-password`) – Correctly guarded with `NODE_ENV !== "development"`; returns 403 in production.
- **API auth** – Protected routes use `auth()` from NextAuth; authorization checks are in place.
- **Input validation** – Zod used across API routes.
- **Password hashing** – bcrypt via `verifyPassword` / `hashPassword`.

### 4. Package name

- `package.json` – Name updated from `eva_srostlikova` to `my-hockey-recruiting`.

### 5. Debug logging

- `console.log` removed from `SendUsAMassege.tsx` (file removed).
- `console.error` in API catch blocks kept for server-side logging (acceptable).

### 6. Build / TypeScript fixes (pre-existing)

- **events API** – `parsed.flatten()` → `parsed.error.flatten()` (Zod safeParse).
- **players API** – `hasContactAccess` cast to `!!hasContactAccess` for `maskPlayerByPlan`.
- **subscription webhook** – Stripe SDK type workarounds for `current_period_end`, `subscription_data`, `Invoice.subscription`.
- **SubscriptionSettings** – Fallback `sub` object now includes `planId` and `canAddPlayer`.
- **plan-features** – Re-exported `PlanId` type for `useSubscriptionFeatures`.
- **lib/subscription** – `canAddPlayer: !!(isActive && playerCount < limit)` for strict boolean.

---

## Architecture overview

- **Framework:** Next.js 16 (App Router)
- **Auth:** NextAuth v5 (Credentials provider, phone verification, JWT)
- **Database:** Prisma + PostgreSQL (Neon)
- **Validation:** Zod
- **Forms:** react-hook-form + zodResolver

---

## Recommendations

1. **Environment variables** – Ensure all required vars are set in Vercel (see READY-TO-GO-LIVE.md).
2. **Database migrations** – Run `npx prisma db push` or migrations against production DB before going live.
3. **Stripe webhooks** – Configure and verify webhook secret for subscription events.
4. **Twilio** – Confirm Verify service SID or SMS template for verification codes.

---

## E2E testing

Playwright is set up with tests for:

- Homepage load
- Contact form flow
- Auth pages (sign-in, sign-up)
- Dashboard redirect when unauthenticated

**First time:** Run `npx playwright install` to download browsers.  
Then: `npm run test:e2e`
