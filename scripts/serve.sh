#!/usr/bin/env bash
# Start/stop the production server in the background, output appended to kit/logs/server.log.
# Usage: bash scripts/serve.sh start|stop|restart
set -u
cd "$(dirname "$0")/.."
mkdir -p kit/logs

stop() {
  local pids
  pids=$(ss -ltnpH 'sport = :3000' 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u)
  # shellcheck disable=SC2086
  [ -n "$pids" ] && kill $pids 2>/dev/null
  for port in 3000 3002; do
    for pid in $(ss -ltnpH "sport = :$port" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u); do kill "$pid" 2>/dev/null; done
  done
  for _ in $(seq 1 40); do
    ss -ltn | grep -q ':3000 ' || { echo "server stopped"; return 0; }
    sleep 0.5
  done
  echo "server still listening on 3000"
  return 1
}

start() {
  if ss -ltn | grep -q ':3000 '; then
    echo "port 3000 busy"
    return 1
  fi
  setsid nohup pnpm start >> kit/logs/server.log 2>&1 < /dev/null &
  for _ in $(seq 1 120); do
    code=$(curl -s -m 5 -o /dev/null -w '%{http_code}' http://localhost:3000/robots.txt)
    case "$code" in
      200 | 404 | 503) echo "server up (robots.txt $code)"; return 0 ;;
    esac
    sleep 0.5
  done
  echo "server did not start"
  return 1
}

# Review instance on :3002 with the coming-soon gate off (process env only; .env.local untouched).
visual() {
  ss -ltn | grep -q ':3002 ' && return 0
  HOLA_COMING_SOON=0 setsid nohup pnpm exec next start -p 3002 >> kit/logs/visual.log 2>&1 < /dev/null &
  for _ in $(seq 1 60); do curl -s -o /dev/null http://localhost:3002/robots.txt && { echo "visual up"; return 0; }; sleep 0.5; done
}

case "${1:-start}" in
  visual) visual ;;
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  *) echo "usage: $0 start|stop|restart"; exit 2 ;;
esac
