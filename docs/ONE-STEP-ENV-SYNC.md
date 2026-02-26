# One-Step Environment Variable Sync

Your code is pushed and the database is synced. The **only thing left** is adding your environment variables to Vercel.

## Do this once (takes ~60 seconds)

1. **Create a Vercel token**
   - Open: https://vercel.com/account/tokens
   - Click **"Create"**
   - Name it anything (e.g. "env sync")
   - Copy the token (it looks like `vercel_xxxx...`)

2. **Add the token to .env.local**
   - Open your `.env.local` file in Cursor
   - Add this line at the bottom (replace with your actual token):
   ```
   VERCEL_TOKEN=vercel_xxxx_your_actual_token_here
   ```
   - Save the file

3. **Run the sync**
   - Open a **new terminal** in Cursor (Cmd+Shift+P → "Terminal: Create New Terminal")
   - Run:
   ```
   npm run sync-env
   ```
   - You should see `✓` for each variable

4. **Redeploy** (so Vercel picks up the new env vars)
   - Go to https://vercel.com/larisajcavallaro-bit/my-hockey-recruiting/deployments
   - Click the three dots on the latest deployment → **Redeploy**

That's it. Your site will be fully live with login, database, Stripe, and Twilio working.
