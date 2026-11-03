#!/usr/bin/env bash
# Dumb tester: starts the real server binary in a throwaway folder (so it
# gets a fresh habits.sqlite), exercises the API the way the screens do,
# and prints the server log when anything fails.
#
# Usage:  ./scripts/smoke-test.sh
# Port 8080 must be free, so stop your normal `cargo run` first.
set -u

cd "$(dirname "$0")/.."
BASE="http://127.0.0.1:8080"
WORK="$(mktemp -d)"
LOG="$WORK/server.log"
BIN="$PWD/target/debug/habit_server"

cleanup() {
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null
  rm -rf "$WORK"
}
trap cleanup EXIT

fail() {
  echo "FAIL: $1"
  echo "----- server log -----"
  cat "$LOG" 2>/dev/null
  echo "----------------------"
  exit 1
}

expect_status() {
  # expect_status <wanted> <actual> <what>
  [ "$2" = "$1" ] || fail "$3 returned HTTP $2 (wanted $1)"
}

cargo build -p habit_server >/dev/null 2>&1 || fail "cargo build"

(cd "$WORK" && "$BIN" >"$LOG" 2>&1) &
SERVER_PID=$!

for _ in $(seq 1 50); do
  curl -s -o /dev/null "$BASE/api/health" && break
  sleep 0.2
done

echo "1. health reports a usable database"
BODY="$(curl -s -w '\n%{http_code}' "$BASE/api/health")"
CODE="$(printf '%s' "$BODY" | tail -n1)"
expect_status 200 "$CODE" "GET /api/health"
printf '%s' "$BODY" | grep -q '"status":"ok"' || fail "health body was: $BODY"

echo "2. create a counter habit"
BODY="$(curl -s -w '\n%{http_code}' -X POST "$BASE/api/habits" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Smoke Water","habit_type":"numeric","target_value":8,"unit":"glasses","is_task":false,"schedule_days":[0,1,2,3,4,5,6]}')"
CODE="$(printf '%s' "$BODY" | tail -n1)"
expect_status 201 "$CODE" "POST /api/habits"
ID="$(printf '%s' "$BODY" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p' | head -n1)"
[ -n "$ID" ] || fail "create returned no id: $BODY"

echo "3. today lists it, still pending"
TODAY="$(curl -s "$BASE/api/today")"
printf '%s' "$TODAY" | grep -q "Smoke Water" || fail "today did not list the habit: $TODAY"

echo "4. partial progress, then completion"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/habits/$ID/status" \
  -H 'Content-Type: application/json' \
  -d "{\"date\":\"$(date +%F)\",\"status\":\"in_progress\",\"value\":3}")"
expect_status 200 "$CODE" "POST status in_progress"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/habits/$ID/status" \
  -H 'Content-Type: application/json' \
  -d "{\"date\":\"$(date +%F)\",\"status\":\"completed\",\"value\":8}")"
expect_status 200 "$CODE" "POST status completed"

echo "5. month view shows the note text round-trip"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/habits/$ID/status" \
  -H 'Content-Type: application/json' \
  -d "{\"date\":\"$(date +%F)\",\"status\":\"completed\",\"value\":8,\"note\":\"smoke note\"}")"
expect_status 200 "$CODE" "POST status with note"
MONTH="$(curl -s "$BASE/api/habits/$ID/month")"
printf '%s' "$MONTH" | grep -q "smoke note" || fail "month did not return the note: $MONTH"

echo "6. statistics include the monthly chart"
STATS="$(curl -s "$BASE/api/statistics")"
printf '%s' "$STATS" | grep -q "monthly_completions" || fail "statistics missing monthly_completions: $STATS"

echo "7. reminder and daily-backup setting round-trip"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X PUT "$BASE/api/habits/$ID/reminders" \
  -H 'Content-Type: application/json' -d '{"enabled":true,"remind_at":"07:30"}')"
expect_status 200 "$CODE" "PUT reminders"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X PUT "$BASE/api/settings" \
  -H 'Content-Type: application/json' -d '{"daily_backup":true}')"
expect_status 200 "$CODE" "PUT settings"

echo "8. backup downloads and restores"
curl -s "$BASE/api/backup" > "$WORK/backup.json" || fail "GET /api/backup"
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/backup/restore" \
  -H 'Content-Type: application/json' --data @"$WORK/backup.json")"
expect_status 200 "$CODE" "POST /api/backup/restore"

echo "PASS: every screen's API answered as the frontend expects."
