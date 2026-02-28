# Tools Explained — What Everything Does

A plain-language guide to the tools and services used by My Hockey Recruiting.

---

## Vercel

**What it is:** Where your website "lives" on the internet.

When someone visits **www.myhockeyrecruiting.com**, their browser talks to Vercel. Vercel runs your app and sends back the web pages.

---

## Neon

**What it is:** Where your app's *data* is stored — the database.

Think of it as a big, organized filing cabinet in the cloud. It holds things like:
- User accounts (emails, passwords)
- Coach profiles
- Parents, players, events
- Subscriptions, facilities, blog posts, etc.

Your app connects to Neon using the `DATABASE_URL` in your `.env.local` file.

---

## Git & GitHub

**Git** — A tool that keeps a history of every change you make to your code. It lets you go back to older versions, see what changed, and work with others on the same project.

**GitHub** — A website that stores your code and its history in the cloud. Your project lives at `larisajcavallaro-bit/my-hockey-recruiting`.

(GitLab is a similar service — you're using GitHub for this project.)

---

## npm (Node Package Manager)

**What it is:** The tool that installs all the extra "building blocks" your app needs.

Your app doesn't build everything from scratch. It uses libraries like Next.js, Stripe, Prisma, etc. When you run `npm install`, npm downloads all of those. Commands like `npm run dev` and `npm run build` use those downloaded packages.

---

## Docker

**What it is:** A tool for running apps in isolated "containers" — like lightweight virtual computers.

You have a `docker-compose.yml` file in your project. It *can* be used to run a database or other services on your own computer for testing. For your live site, you're using Neon in the cloud, so Docker is optional for you right now.

---

## Other Tools You're Using

| Tool | What it does |
|------|--------------|
| **Next.js** | The framework that powers your site — pages, navigation, API routes, auth. |
| **Prisma** | Connects your app to the database and makes it easier to read/write data. |
| **Stripe** | Handles subscriptions and payments. |
| **Twilio** | Sends text messages (e.g., verification codes, event reminders). |

---

## How It All Fits Together

```
You write code → Git tracks changes → Push to GitHub
                                           ↓
                          Vercel pulls from GitHub and builds your site
                                           ↓
                          Users visit www.myhockeyrecruiting.com
                                           ↓
                          Your app on Vercel talks to Neon (data), Stripe (payments), Twilio (SMS)
```

---

## Quick Reference

- **Vercel** = Where your site is hosted
- **Neon** = Where your data lives (database)
- **GitHub** = Where your code is stored and versioned
- **npm** = Installs and runs the libraries your app needs
- **Docker** = Optional — for running things locally in containers
