#!/usr/bin/env node
/**
 * Capture team logos from websites. Run: npm run capture-logos
 * Or: LIMIT=10 npm run capture-logos (for first 10 teams)
 */
const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../docs/1MHR_All_Teams_Expanded.csv');
const LOGOS_DIR = path.join(__dirname, '../docs/team-logos');
const DELAY_MS = 2000;

function slugify(name) {
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').toLowerCase().slice(0, 40);
}

function getUrl(row) {
  const boys = (row['Boys Website'] || '').trim();
  const girls = (row['Girls Website'] || '').trim();
  if (boys && boys.startsWith('http')) return boys;
  if (girls && girls.startsWith('http')) return girls;
  if (boys) return 'https://' + boys.replace(/^https?:\/\//, '');
  if (girls) return 'https://' + girls.replace(/^https?:\/\//, '');
  return null;
}

function parseCSV(content) {
  const rows = [];
  const lines = content.split(/\r?\n/).filter(Boolean);
  for (let i = 1; i < lines.length; i++) {
    const parts = [];
    let cur = '';
    let inQ = false;
    for (let k = 0; k < lines[i].length; k++) {
      const c = lines[i][k];
      if (c === '"') inQ = !inQ;
      else if (c === ',' && !inQ) { parts.push(cur.trim()); cur = ''; }
      else if (c === '\n' && !inQ) { parts.push(cur.trim()); cur = ''; break; }
      else cur += c;
    }
    parts.push(cur.trim());
    rows.push({
      'Team Name': (parts[0] || '').replace(/^"|"$/g, ''),
      'Boys Website': (parts[1] || '').replace(/^"|"$/g, ''),
      'Girls Website': (parts[2] || '').replace(/^"|"$/g, ''),
      'Logo': (parts[12] || '').replace(/^"|"$/g, '').trim()
    });
  }
  return rows;
}

async function main() {
  if (!fs.existsSync(LOGOS_DIR)) fs.mkdirSync(LOGOS_DIR, { recursive: true });
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvContent);
  
  const { chromium } = require('playwright');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();
  
  const limit = parseInt(process.env.LIMIT || '0') || rows.length;
  const captured = [];
  for (let i = 0; i < Math.min(rows.length, limit || rows.length); i++) {
    const row = rows[i];
    const team = row['Team Name'] || '';
    const url = getUrl(row);
    if (!url) {
      console.log(`[${i+1}/${rows.length}] ${team} - No URL, skip`);
      continue;
    }
    const slug = slugify(team) || `team-${i}`;
    const logoPath = path.join(LOGOS_DIR, `logo-${slug}.png`);
    if (fs.existsSync(logoPath)) {
      console.log(`[${i+1}/${rows.length}] ${team} - Logo exists, skip`);
      captured.push({ team, path: `team-logos/logo-${slug}.png` });
      continue;
    }
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: logoPath,
        clip: { x: 0, y: 0, width: 1280, height: 200 }
      });
      console.log(`[${i+1}/${rows.length}] ${team} - Captured`);
      captured.push({ team, path: `team-logos/logo-${slug}.png` });
    } catch (err) {
      console.log(`[${i+1}/${rows.length}] ${team} - Error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, DELAY_MS));
  }
  
  await browser.close();
  console.log(`\nDone. Captured ${captured.length} logos to docs/team-logos/`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
