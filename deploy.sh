#!/bin/bash
# Збирає index.html з parts/ і публікує на deutsch-c1.vercel.app через GitHub.
# Vercel слухає main у ViktoriiaMarkovska/deutsch-c1 і деплоїть сам.
set -e
cd "$(dirname "$0")"

MSG="${1:-Update}"

python3 build.py

if git diff --quiet && git diff --cached --quiet; then
  echo "Змін немає — нічого публікувати."
  exit 0
fi

git add -A
git commit -q -m "$MSG

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push -q origin main
echo "Запушено. Vercel деплоїть; за ~20 с перевір:"
echo "  https://deutsch-c1.vercel.app"
