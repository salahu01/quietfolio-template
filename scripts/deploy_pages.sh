#!/usr/bin/env bash
# Builds a static export and publishes it to the `gh-pages` branch (GitHub Pages "Deploy from a branch").
# No GitHub Actions needed. Usage: npm run deploy:pages
# Override with: PAGES_BASE_PATH=/repo-name PAGES_SITE_URL=https://user.github.io/repo-name
set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE="$(git remote get-url origin)"
REPO="$(basename -s .git "$REMOTE")"
OWNER="$(echo "$REMOTE" | sed -E 's#.*[:/]([^/]+)/[^/]+(\.git)?$#\1#')"
BASE="${PAGES_BASE_PATH:-/$REPO}"
URL="${PAGES_SITE_URL:-https://$OWNER.github.io$BASE}"

echo "→ building static export for $URL"
rm -rf out .next
STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH="$BASE" NEXT_PUBLIC_SITE_URL="$URL" NEXT_PUBLIC_NOINDEX=1 npm run build

echo "→ publishing out/ to gh-pages"
touch out/.nojekyll
(
  cd out
  git init -q -b gh-pages
  git add -A
  git commit -q -m "deploy: static export"
  git push -f -q "$REMOTE" gh-pages
)
rm -rf out/.git
echo "✔ pushed. Live at $URL (first publish can take a minute or two)"
