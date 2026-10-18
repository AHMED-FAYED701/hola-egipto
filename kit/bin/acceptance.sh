#!/usr/bin/env bash
# Hola Egipto — acceptance checks (Next.js + Payload).
# Usage (from the repository root, with `pnpm start` running):
#   bash kit/bin/acceptance.sh            # full run
#   bash kit/bin/acceptance.sh --preflight  # S0: proves the script runs; failures expected
# Optional env: BASE_URL (default NEXT_PUBLIC_SITE_URL from .env.local, else http://localhost:3000)
#               ACCEPT_SKIP_GATES=1 skips `pnpm lint` / `pnpm typecheck` (never in the final run)
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! command -v python3 >/dev/null 2>&1; then
  echo "[FAIL] A0 python3 is required to run the acceptance checks (sudo apt install -y python3)"
  echo "ACCEPTANCE SUMMARY: pass=0 fail=1 warn=0 blocked=0"
  exit 1
fi
exec python3 -I "$HERE/acceptance.py" "$@"
