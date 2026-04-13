#!/usr/bin/env bash
set -euo pipefail

echo "=== HackSwipe deploy ==="

cd "$(dirname "$0")"

echo "-> pulling latest code..."
git pull --ff-only 2>/dev/null || echo "   (skip git pull -- not a git repo or no remote)"

echo "-> building and starting container..."
docker compose up --build -d

echo "-> seeding database (if empty)..."
docker compose exec hackswipe node scripts/seed-from-json.js 2>/dev/null || true

echo ""
echo "=== HackSwipe is running on http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo localhost):3000 ==="
