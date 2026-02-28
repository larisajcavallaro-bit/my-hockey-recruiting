/**
 * Syncs environment variables from .env.local to Vercel.
 * Requires VERCEL_TOKEN in .env.local (create at https://vercel.com/account/tokens)
 * Run: dotenv -e .env.local -- npx tsx scripts/sync-env-to-vercel.ts
 */

import * as fs from "fs";
import * as path from "path";

const PROJECT_NAME = "my-hockey-recruiting";
const LIVE_URL = "https://www.myhockeyrecruiting.com";

// Vars to sync (exclude comments, empty lines, and VERCEL_TOKEN itself)
function parseEnvFile(filePath: string): Record<string, string> {
  const content = fs.readFileSync(filePath, "utf-8");
  const vars: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"'))
      value = value.slice(1, -1).replace(/\\"/g, '"');
    if (value.startsWith("'") && value.endsWith("'"))
      value = value.slice(1, -1).replace(/\\'/g, "'");
    if (key && key !== "VERCEL_TOKEN") vars[key] = value;
  }
  return vars;
}

async function addEnvVar(
  token: string,
  key: string,
  value: string,
): Promise<boolean> {
  // Use "plain" for public vars (NEXT_PUBLIC_*, NEXTAUTH_URL), "encrypted" for secrets
  const type =
    key.startsWith("NEXT_PUBLIC_") || key === "NEXTAUTH_URL"
      ? "plain"
      : "encrypted";

  const res = await fetch(
    `https://api.vercel.com/v10/projects/${PROJECT_NAME}/env?upsert=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type,
        target: ["production", "preview"],
      }),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ ${key}: ${res.status} ${err}`);
    return false;
  }
  console.log(`  ✓ ${key}`);
  return true;
}

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error(`
Missing VERCEL_TOKEN. To sync env vars to Vercel:

1. Go to https://vercel.com/account/tokens
2. Create a new token (any name)
3. Add to .env.local: VERCEL_TOKEN=your_token_here
4. Run: dotenv -e .env.local -- npx tsx scripts/sync-env-to-vercel.ts
`);
    process.exit(1);
  }

  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local not found");
    process.exit(1);
  }

  const vars = parseEnvFile(envPath);
  // Override NEXTAUTH_URL for production
  vars.NEXTAUTH_URL = LIVE_URL;

  console.log(`Syncing ${Object.keys(vars).length} vars to Vercel...\n`);
  let ok = 0;
  for (const [key, value] of Object.entries(vars)) {
    if (await addEnvVar(token, key, value)) ok++;
  }
  console.log(`\nDone. ${ok}/${Object.keys(vars).length} synced.`);
}

main();
