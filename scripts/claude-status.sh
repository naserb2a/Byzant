#!/usr/bin/env bash
# claude-status.sh — persistent status line for Claude Code sessions
# Refreshes every 5 seconds on a single line.

# ── ANSI colors ───────────────────────────────────────────────────────
# Label color: cyan (closest ANSI match to Byzant mint #99E1D9)
LBL=$'\033[38;5;87m'
VAL=$'\033[97m'
DIM=$'\033[38;5;243m'
RST=$'\033[0m'

# ── Session / 5hr window start ────────────────────────────────────────
SESSION_START=$(date +%s)
WINDOW_START=$SESSION_START
WINDOW_SECS=$((5 * 60 * 60))

# ── Helpers ───────────────────────────────────────────────────────────
human_dur() {
  local s=$1
  if (( s < 0 )); then s=0; fi
  local h=$(( s / 3600 ))
  local m=$(( (s % 3600) / 60 ))
  if (( h > 0 )); then
    printf "%d:%02d" "$h" "$m"
  else
    local sec=$(( s % 60 ))
    printf "%d:%02d" "$m" "$sec"
  fi
}

get_model() {
  local m=""
  # Primary: project-local override
  if [[ -f "$PWD/.claude/settings.local.json" ]]; then
    m=$(grep -oE '"model"[[:space:]]*:[[:space:]]*"[^"]+"' "$PWD/.claude/settings.local.json" 2>/dev/null | head -1 | sed -E 's/.*"model"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
  fi
  # Fallback: global settings
  if [[ -z "$m" && -f "$HOME/.claude/settings.json" ]]; then
    m=$(grep -oE '"model"[[:space:]]*:[[:space:]]*"[^"]+"' "$HOME/.claude/settings.json" 2>/dev/null | head -1 | sed -E 's/.*"model"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
  fi
  if [[ -z "$m" ]]; then
    m="default"
  fi
  printf "%s" "$m"
}

get_ctx() {
  # No public API for live context usage yet — show window size placeholder.
  printf "%s" "--/200k"
}

get_branch() {
  git -C "$PWD" branch --show-current 2>/dev/null || printf "%s" "—"
}

get_project() {
  basename "$PWD"
}

# ── Cleanup: restore cursor + newline on exit ─────────────────────────
cleanup() {
  printf "\033[?25h\n"
  exit 0
}
trap cleanup INT TERM EXIT

# Hide cursor
printf "\033[?25l"

# ── Render loop ───────────────────────────────────────────────────────
while true; do
  NOW=$(date +%s)
  SESSION_ELAPSED=$(( NOW - SESSION_START ))
  WINDOW_REMAIN=$(( WINDOW_START + WINDOW_SECS - NOW ))

  MODEL=$(get_model)
  CTX=$(get_ctx)
  BRANCH=$(get_branch)
  PROJECT=$(get_project)
  SESSION_FMT=$(human_dur "$SESSION_ELAPSED")
  WINDOW_FMT=$(human_dur "$WINDOW_REMAIN")

  LINE="${LBL}[MODEL:${RST} ${VAL}${MODEL}${RST}${LBL}]${RST} "
  LINE+="${LBL}[CTX:${RST} ${VAL}${CTX}${RST}${LBL}]${RST} "
  LINE+="${LBL}[BRANCH:${RST} ${VAL}${BRANCH}${RST}${LBL}]${RST} "
  LINE+="${LBL}[PROJECT:${RST} ${VAL}${PROJECT}${RST}${LBL}]${RST} "
  LINE+="${LBL}[SESSION:${RST} ${VAL}${SESSION_FMT}${RST}${LBL}]${RST} "
  LINE+="${LBL}[5HR:${RST} ${VAL}${WINDOW_FMT}${RST}${LBL}]${RST} "
  LINE+="${LBL}[QUOTA:${RST} ${DIM}--${RST}${LBL}]${RST}"

  # \r to overwrite, \033[K to clear rest of line
  printf "\r\033[K%b" "$LINE"

  sleep 5
done
