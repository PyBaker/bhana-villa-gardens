#!/usr/bin/env bash
# Deploy Villa Gardens site via rsync over SSH
# Usage: ./deploy.sh [--dry-run]

set -euo pipefail

# --- Config ---
REMOTE_USER="root"             # change if different
REMOTE_HOST="134.209.71.98"    # from dns-records.csv (villa A record)
REMOTE_PATH="/var/www/html"    # change to actual web root on the server
LOCAL_PATH="$(cd "$(dirname "$0")" && pwd)/"

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "[dry-run] No files will actually be transferred"
fi

echo "Deploying Villa Gardens site..."
echo "  From: $LOCAL_PATH"
echo "  To:   $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo ""

rsync -avz --progress \
  $DRY_RUN \
  --exclude '.DS_Store' \
  --exclude 'deploy.sh' \
  --exclude 'dns-records.csv' \
  "$LOCAL_PATH" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

echo ""
echo "Done."
