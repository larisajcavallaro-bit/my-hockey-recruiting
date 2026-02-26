# Deploy My Hockey Recruiting to Vercel

Your project is ready for deployment. Follow these steps:

---

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `my-hockey-recruiting` (or any name)
3. Choose **Private** (or Public)
4. Do **NOT** initialize with README (we already have code)
5. Click **Create repository**

---

## Step 2: Push Your Code to GitHub

In Terminal, run:

```bash
cd "/Users/larisacavallaro/Desktop/My Hockey Recruiting Code "
git remote add origin https://github.com/larisajcavallaro-bit/my-hockey-recruiting.git
git push -u origin main
```

Or if you use SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/my-hockey-recruiting.git
git push -u origin main
```

---

## Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and **Log in with GitHub**
2. Click **Add New...** → **Project**
3. **Import** your `my-hockey-recruiting` repository
4. Vercel auto-detects Next.js — click **Deploy**
5. Wait 1–2 minutes for the build

---

## Step 4: Sync the Database Schema (after schema changes)

If you changed the Prisma schema (e.g. contact form fields), sync your **production** database:

```bash
# Set your production DATABASE_URL (copy from Vercel env vars), then:
DATABASE_URL="your-production-neon-url" npx prisma db push
```

This ensures the live database has the same tables and columns as your code.

---

## Step 5: Add Environment Variables

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add:

| Name | Value | Environments |
|------|-------|---------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (your key from .env.local) | Production, Preview, Development |

3. Click **Redeploy** so the new variables are used

---

## Step 6: Custom Domain (Optional)

1. **Settings** → **Domains**
2. Add your domain (e.g. `myhockeyrecruiting.com`)
3. Follow the DNS instructions from your domain registrar

---

## Your site will be live at:
`https://my-hockey-recruiting-xxxx.vercel.app` (Vercel gives you a URL)
