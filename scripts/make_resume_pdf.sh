#!/usr/bin/env bash
# Renders /resume to public/resume.pdf with headless Chrome. Requires a running server (default :3000).
# Usage: npm run build && npm start &  then  bash scripts/make_resume_pdf.sh [http://localhost:3000]
set -euo pipefail
URL="${1:-http://localhost:3000}/resume"
CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || true)"
[ -n "$CHROME" ] || { echo "Chrome/Chromium not found; set CHROME_PATH" >&2; exit 1; }
"$CHROME" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf="public/resume.pdf" "$URL" 2>/dev/null
echo "wrote public/resume.pdf"
