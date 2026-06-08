#!/usr/bin/env bash
# deploy.sh — Deploy apps/web to Vercel
#
# Usage:
#   bash scripts/deploy.sh              # preview deployment (default)
#   bash scripts/deploy.sh --prod       # production deployment
#   bash scripts/deploy.sh --scope my-team  # target a specific Vercel team

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$REPO_ROOT/apps/web"
PROD=false
SCOPE=""

# ── Parse args ────────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prod)       PROD=true; shift ;;
    --scope)      SCOPE="$2"; shift 2 ;;
    --scope=*)    SCOPE="${1#--scope=}"; shift ;;
    -h|--help)
      echo "Usage: bash scripts/deploy.sh [--prod] [--scope <team-slug>]"
      exit 0 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Helpers ───────────────────────────────────────────────────────────────────

info()    { echo "▶  $*"; }
success() { echo "✓  $*"; }
warn()    { echo "⚠  $*"; }
die()     { echo "✗  $*" >&2; exit 1; }

# ── Step 1: Vercel CLI ────────────────────────────────────────────────────────

if ! command -v vercel &>/dev/null; then
  info "Vercel CLI not found — installing..."
  npm install -g vercel@latest
fi

VERCEL_VERSION=$(vercel --version 2>/dev/null | head -1)
success "Vercel CLI: $VERCEL_VERSION"

# ── Step 2: Auth ──────────────────────────────────────────────────────────────

WHOAMI=$(vercel whoami 2>/dev/null || true)
if [[ -z "$WHOAMI" ]]; then
  info "Not authenticated — opening browser for login..."
  vercel login
  WHOAMI=$(vercel whoami)
fi
success "Authenticated as: $WHOAMI"

# ── Step 3: Team scope ────────────────────────────────────────────────────────

SCOPE_FLAG=""
if [[ -n "$SCOPE" ]]; then
  SCOPE_FLAG="--scope $SCOPE"
  info "Using team scope: $SCOPE"
else
  # Auto-detect: if only one team, use it silently; if multiple, list them
  TEAMS_JSON=$(vercel teams list --format json 2>/dev/null || echo "[]")
  TEAM_COUNT=$(echo "$TEAMS_JSON" | node -e "
    const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    const teams = d.teams ?? d ?? [];
    console.log(teams.length);
  " 2>/dev/null || echo "0")

  if [[ "$TEAM_COUNT" -gt 1 ]]; then
    warn "You belong to multiple Vercel teams. Pass --scope <team-slug> to target one."
    echo ""
    echo "$TEAMS_JSON" | node -e "
      const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
      const teams = d.teams ?? d ?? [];
      teams.forEach(t => console.log('  •', t.slug ?? t.name));
    " 2>/dev/null || true
    echo ""
    die "Re-run with: bash scripts/deploy.sh --scope <team-slug>"
  fi
fi

# ── Step 4: Link project ──────────────────────────────────────────────────────

cd "$APP_DIR"

if [[ ! -f ".vercel/project.json" && ! -f ".vercel/repo.json" ]]; then
  info "Linking project to Vercel (using git remote)..."
  # --repo matches the git remote to an existing Vercel project or creates one
  # shellcheck disable=SC2086
  vercel link --repo $SCOPE_FLAG
  success "Project linked"
else
  success "Project already linked"
fi

# ── Step 5: Deploy ────────────────────────────────────────────────────────────

DEPLOY_FLAGS="-y --no-wait $SCOPE_FLAG"
if [[ "$PROD" == true ]]; then
  info "Deploying to PRODUCTION..."
  DEPLOY_FLAGS="$DEPLOY_FLAGS --prod"
else
  info "Deploying preview..."
fi

# shellcheck disable=SC2086
DEPLOY_URL=$(vercel deploy $DEPLOY_FLAGS 2>/dev/null)

echo ""
success "Deployment triggered!"
echo ""
echo "  URL: $DEPLOY_URL"
echo ""

# Poll build status
info "Checking build status..."
for i in {1..5}; do
  STATUS=$(vercel inspect "$DEPLOY_URL" --format json 2>/dev/null \
    | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.readyState ?? d.status ?? 'UNKNOWN');" 2>/dev/null \
    || echo "BUILDING")
  echo "  status: $STATUS"
  if [[ "$STATUS" == "READY" ]]; then
    echo ""
    success "Build complete → $DEPLOY_URL"
    break
  elif [[ "$STATUS" == "ERROR" ]]; then
    die "Build failed. Check the Vercel dashboard: https://vercel.com"
  fi
  sleep 10
done
