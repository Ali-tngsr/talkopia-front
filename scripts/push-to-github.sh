#!/usr/bin/env bash
# Talkotopia — Push to GitHub Helper Script
# Run this script after creating an empty repo on GitHub.
#
# Usage:
#   ./push-to-github.sh <your-github-username> <repo-name>
#
# Example:
#   ./push-to-github.sh ali-talkotopia talkotopia-frontend

set -e

USERNAME="$1"
REPO="$2"

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
  echo "❌ Usage: $0 <github-username> <repo-name>"
  echo "   Example: $0 ali-talkotopia talkotopia-frontend"
  exit 1
fi

REMOTE_URL="https://github.com/${USERNAME}/${REPO}.git"

echo "🚀 Preparing to push Talkotopia to: ${REMOTE_URL}"
echo ""

# Make sure we're in the project root
cd "$(dirname "$0")/.."

# Check if 'origin' remote already exists
if git remote get-url origin >/dev/null 2>&1; then
  echo "🔄 Updating existing 'origin' remote..."
  git remote set-url origin "$REMOTE_URL"
else
  echo "➕ Adding 'origin' remote..."
  git remote add origin "$REMOTE_URL"
fi

echo ""
echo "📤 Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for your GitHub credentials."
echo "   For the password, use a Personal Access Token (PAT), NOT your GitHub password."
echo "   Create one at: https://github.com/settings/tokens (scopes: repo, workflow)"
echo ""

git push -u origin main

echo ""
echo "✅ Done! Your project is now live at:"
echo "   ${REMOTE_URL}"
