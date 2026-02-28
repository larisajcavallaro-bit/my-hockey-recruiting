# Load Teams from CSV

The script `scripts/load-teams-from-csv.ts` loads all teams/schools from `docs/1MHR_All_Teams_Expanded.csv` into the website's Teams and Schools page.

## School vs Team

Each row is automatically marked as **school** or **team** based on:

- **School** if the name contains: "School", "Academy", "Prep", or "Abbey"
- **School** if leagues include: NEPSAC, ISL, Prep, or FAA
- **Team** for everything else (youth clubs, town programs, etc.)

You can change any entry's type later in **Admin → Schools**.

## How to Run

1. Make sure your database is set up (`.env.local` has your DATABASE_URL).
2. In the terminal (at the project folder), run:
   ```
   npm run load-teams
   ```
3. The script will add new entries and update existing ones (matched by slug).
4. Go to **Admin → Schools** to edit any missing or incorrect info.

## What Gets Loaded

- **Name** from Team Name column
- **Address, city, zip** parsed from Address column
- **Phone** from Phone # column
- **Boys/Girls websites** from Boys Website, Girls Website
- **Leagues** from Boys Leagues, Girls Leagues
- **Age brackets** parsed from Boys Ages, Girls Ages (e.g. U8–U18)
- **Gender** inferred from websites/leagues (Male, Female, or Co-ed)
- **Description** uses a placeholder; update in Admin
- **Logo/image** from the Logo column when present (files in `public/newasset/teams/`); otherwise empty
