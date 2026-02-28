#!/bin/bash
# Push all chat changes to GitLab for production deploy

set -e
cd "$(dirname "$0")"

echo "=== Staging all changes ==="
git add -A

if git diff --cached --quiet; then
  echo "No changes to commit (working tree already clean)."
  exit 0
fi

echo ""
echo "=== Committing ==="
git commit -m "Mobile fixes, coach sign-up dropdowns, phone verification improvements

- Add viewport & overflow-x fix for mobile
- Fix training page: replace @lucide/lab, mobile location search, card margin
- Fix HeroSection syntax (missing paren, stray char)
- Coach sign-up: dark dropdowns for Typeahead + Select, visible on simulator
- Phone verification: dev bypass (123456), better error handling for live site
- Surface Twilio 21608 (trial) and other errors to user
- Add PHONE-VERIFICATION-TROUBLESHOOTING.md
- Update READY-TO-GO-LIVE with TWILIO_VERIFY_SERVICE_SID"

echo ""
echo "=== Pushing to GitLab ==="
git push

echo ""
echo "Done! Deploy to prod from your GitLab/Vercel dashboard."
