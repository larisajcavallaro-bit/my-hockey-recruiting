# Connect Your GoDaddy Domain to Vercel

Your domain **myhockeyrecruiting.com** is already added to Vercel. Now add these DNS records in GoDaddy.

---

## Add these 2 records in GoDaddy

1. Go to **[GoDaddy Domain Portfolio](https://dcc.godaddy.com/manage/dns)**
2. Find **myhockeyrecruiting.com** and click **DNS** or **Manage DNS**
3. Add these records (or edit existing ones):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **A** | `www` | `76.76.21.21` | 600 |

**GoDaddy field notes:**
- **Name `@`** = root domain (myhockeyrecruiting.com)
- **Name `www`** = www subdomain (www.myhockeyrecruiting.com)
- If there are existing A or CNAME records for `@` or `www`, delete or update them first

---

## Step 2: Wait for DNS propagation

- Changes can take **5 minutes to 48 hours** (often 15–30 minutes)
- Vercel will email you when the domain is verified
- SSL (HTTPS) is added automatically

---

## Step 3: Check status

- [Vercel Domains](https://vercel.com/larisajcavallaro-8969s-projects/my-hockey-recruiting/settings/domains)
- When both domains show **Valid Configuration**, you're done
- Visit **https://myhockeyrecruiting.com** in your browser
