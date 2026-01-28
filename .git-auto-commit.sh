#!/bin/bash
# Auto-commit changed files
set -e

if [[ -z "$(git status --porcelain)" ]]; then
  echo "[AUTO-GIT] No changes to commit"
  exit 0
fi

MESSAGE="${1:-Auto-commit: $(date +%Y-%m-%d\ %H:%M:%S)}"

echo "[AUTO-GIT] Auto-committing changes..."
git add -A
git commit -m "$MESSAGE"
echo "[AUTO-GIT] ✓ Committed and pushed!"
